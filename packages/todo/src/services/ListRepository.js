import { CRUDServiceContainer } from 'octobus-crud';
import { Store } from 'octobus-mongodb-store';
import { service } from 'makeen-core/src/octobus/decorators';
import listSchema from '../schemas/list';

class ListRepository extends CRUDServiceContainer {
  constructor(options) {
    super(
      new Store({
        db: options.mongoDb,
        refManager: options.refManager,
        collectionName: 'TodoList',
      }),
      listSchema,
    );
  }

  @service()
  async deleteOne(params, { next }) {
    const ItemRepository = this.extract('ItemRepository');
    const { query } = params;
    const list = await this.findOne({ query });
    const result = await next(params);

    await Promise.all([
      ItemRepository.deleteMany({
        query: {
          listId: list._id,
        },
      }),
    ]);

    return result;
  }

  @service()
  async findManyWithStats(params) {
    const ItemRepository = this.extract('ItemRepository');
    const lists = await this.findMany(params).then((c) => c.toArray());
    const listIds = lists.map(({ _id }) => _id);

    const [
      items,
      checkedItemsPerList,
    ] = await Promise.all([
      ItemRepository.findMany({
        query: {
          listId: {
            $in: listIds,
          },
          isChecked: false,
        },
      }).then((c) => c.toArray()),
      ItemRepository.aggregate({
        pipeline: [{
          $match: {
            listId: {
              $in: listIds,
            },
            isChecked: true,
          },
        }, {
          $group: {
            _id: '$listId',
            count: {
              $sum: 1,
            },
          },
        }],
      }).then((c) => c.toArray()),
    ]);

    return {
      lists,
      items,
      checkedItemsPerList,
    };
  }
}

export default ListRepository;
