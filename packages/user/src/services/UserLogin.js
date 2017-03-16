import { CRUDServiceContainer } from 'octobus-crud';
import { Store } from 'octobus-mongodb-store';
import userLoginSchema from '../schemas/userLogin';

class UserLogin extends CRUDServiceContainer {
  constructor(options) {
    super(
      new Store({
        db: options.mongoDb,
        refManager: options.refManager,
        collectionName: 'UserLogin',
      }),
      userLoginSchema,
    );
  }
}

export default UserLogin;
