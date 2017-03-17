import { CRUDServiceContainer } from 'octobus-crud';
import { Store } from 'octobus-mongodb-store';
import { service } from 'makeen-core/src/octobus/annotations';
import listSchema from '../schemas/list';

class List extends CRUDServiceContainer {
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
    const Item = this.extract('Item');
    const { query } = params;
    const list = await this.findOne({ query });
    const result = await next(params);

    await Promise.all([
      Item.deleteMany({
        query: {
          listId: list._id,
        },
      }),
    ]);

    return result;
  }

  @service()
  async findManyWithStats(params) {
    const Item = this.extract('Item');
    const lists = await this.findMany(params).then((c) => c.toArray());
    const listIds = lists.map(({ _id }) => _id);

    const [
      items,
      checkedItemsPerList,
    ] = await Promise.all([
      Item.findMany({
        query: {
          listId: {
            $in: listIds,
          },
          isChecked: false,
        },
      }).then((c) => c.toArray()),
      Item.aggregate({
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

export default List;
