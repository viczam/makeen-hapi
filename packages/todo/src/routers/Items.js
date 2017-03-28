import Boom from 'boom';
import MongoResourceRouter from 'makeen-router/src/routers/MongoResourceRouter';
import { ObjectID as objectId } from 'mongodb';
import omit from 'lodash/omit';
import { idValidator } from 'makeen-router/src/libs/mongo-helpers';
import { route } from 'makeen-router';
import itemSchema from '../schemas/item';

class ItemsRouter extends MongoResourceRouter {
  constructor(ItemRepository, config = {}) {
    super(ItemRepository, {
      namespace: 'TodoItems',
      basePath: '/lists/{listId}/items',
      entitySchema: omit(itemSchema, [
        '_id', 'accountId', 'listId', 'createdBy', 'createdAt', 'updatedAt',
      ]),
      baseRouteConfig: {
        pre: [{
          method: MongoResourceRouter.wrapHandler(
            function method(request) {
              return this.ListRepository.findOne({
                query: {
                  _id: objectId(request.params.listId),
                  accountId: objectId(request.auth.credentials.accountId),
                },
              });
            },
          ),
          assign: 'list',
        }],
        validate: {
          params: {
            listId: idValidator,
          },
        },
      },
      ...config,
    });

    this.ItemRepository = ItemRepository;

    this.applyContext({
      generateContext: (request) => ({
        accountId: objectId(request.auth.credentials.accountId),
        listId: request.pre.list._id,
      }),
    });

    this.routes.createOne.config.pre.push({
      async method(request, reply) {
        Object.assign(request.pre.payload, {
          createdBy: objectId(request.auth.credentials.id),
        });

        reply();
      },
    });
  }

  @route.post({
    path: '/{id}/toggle',
    config: {
      validate: {
        params: {
          id: idValidator,
        },
      },
      description: 'Toggle an item status (checked / unchecked)',
    },
  })
  async toggle(request) {
    const item = this.ItemRepository.findOne({
      query: {
        accountId: objectId(request.auth.credentials.accountId),
        listId: request.pre.list._id,
        id: objectId(request.params.id),
      },
    });

    if (!item) {
      throw Boom.notFound(`Unable to find entity with id ${request.params.id}`);
    }

    const isChecked = !item.isChecked;

    await this.ItemRepository.updateOne({
      query: {
        _id: item._id,
      },
      update: {
        $set: { isChecked },
      },
    });

    return {
      ...item,
      isChecked,
    };
  }
}

export default ItemsRouter;
