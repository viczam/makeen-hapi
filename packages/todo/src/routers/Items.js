import Boom from 'boom';
import MongoResourceRouter from 'makeen-core/src/routers/MongoResourceRouter';
import { ObjectID as objectId } from 'mongodb';
import omit from 'lodash/omit';
import { idValidator } from 'makeen-core/src/libs/mongo-helpers';
import itemSchema from '../schemas/item';

class ItemsRouter extends MongoResourceRouter {
  constructor(config = {}) {
    super({
      namespace: 'TodoItems',
      basePath: '/items',
      getRepository: (request) => request.server.plugins['makeen-todo'].ItemService,
      entitySchema: omit(itemSchema, [
        '_id', 'accountId', 'listId', 'createdBy', 'createdAt', 'updatedAt',
      ]),
      baseRouteConfig: {
        pre: [{
          method: MongoResourceRouter.wrapHandler(
            function method(request) {
              return this.List.findOne({
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

    this.addRoute('toggle', {
      path: '/{id}/toggle',
      method: 'POST',
      handler: this.constructor.toggleHandler,
      config: {
        validate: {
          params: {
            id: idValidator,
          },
        },
        description: 'Toggle an item status (checked / unchecked)',
      },
    });
  }

  static async toggleHandler(request) {
    const item = this.Item.findOne({
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

    await this.Item.updateOne({
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
