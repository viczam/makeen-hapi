import { CRUDServiceContainer } from 'octobus-crud';

class AccountRepository extends CRUDServiceContainer {
  constructor({ store, accountSchema }) {
    super(store, accountSchema);
  }
}

export default AccountRepository;
