import { CRUDServiceContainer } from 'octobus-crud';
import accountSchema from '../schemas/account';

class AccountRepository extends CRUDServiceContainer {
  constructor({ store }) {
    super(store, accountSchema);
  }
}

export default AccountRepository;
