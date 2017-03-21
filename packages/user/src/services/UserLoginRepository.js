import { CRUDServiceContainer } from 'octobus-crud';
import userLoginSchema from '../schemas/userLogin';

class UserLoginRepository extends CRUDServiceContainer {
  constructor({ store }) {
    super(store, userLoginSchema);
  }
}

export default UserLoginRepository;
