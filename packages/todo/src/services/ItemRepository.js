import { CRUDServiceContainer } from 'octobus-crud';
import itemSchema from '../schemas/item';

class ItemRepository extends CRUDServiceContainer {
  constructor({ store }) {
    super(store, itemSchema);
  }
}

export default ItemRepository;
