import { CRUDServiceContainer } from 'octobus-crud';
import bcrypt from 'bcryptjs';

class UserRepository extends CRUDServiceContainer {
  static hashPassword({ password, salt }) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, salt, (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });
  }

  constructor({ store, userSchema }) {
    super(store, userSchema);
  }

  setServiceBus(serviceBus) {
    super.setServiceBus(serviceBus);
    this.User = serviceBus.extract('User');
  }

  save(data) {
    const { hashPassword, ...restData } = data;

    if (!restData.salt) {
      restData.salt = bcrypt.genSaltSync(10);
    }

    const shouldHashPassword = (!restData._id || hashPassword) &&
      !!restData.password;

    if (!shouldHashPassword) {
      return super.save(restData);
    }

    return this.User
      .hashPassword({
        password: restData.password,
        salt: restData.salt,
      })
      .then(password =>
        super.save({
          ...restData,
          password,
        }));
  }
}

export default UserRepository;
