import { CRUDServiceContainer } from 'octobus-crud';
import { Store } from 'octobus-mongodb-store';
import accountSchema from '../schemas/account';

class AccountRepository extends CRUDServiceContainer {
  constructor(options) {
    super(
      new Store({
        db: options.mongoDb,
        refManager: options.refManager,
        collectionName: 'Account',
      }),
      accountSchema,
    );
  }
}

export default AccountRepository;
