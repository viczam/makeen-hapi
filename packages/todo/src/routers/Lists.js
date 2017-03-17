import MongoResourceRouter from 'makeen-core/src/routers/MongoResourceRouter';
import { ObjectID as objectId } from 'mongodb';
import omit from 'lodash/omit';
import itemSchema from '../schemas/item';

class ListsRouter extends MongoResourceRouter {
  constructor(config = {}) {
    super({
      namespace: 'TodoLists',
      basePath: '/lists',
      getRepository: (request) => request.server.plugins['makeen-todo'].ListService,
      entitySchema: omit(itemSchema, [
        '_id', 'createdBy', 'createdAt', 'updatedAt', 'accountId',
      ]),
      ...config,
    });

    this.applyContext({
      generateContext: (request) => ({
        accountId: objectId(request.auth.credentials.accountId),
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

    this.addRoute('findWithStats', {
      path: 'find-with-stats',
      method: 'GET',
      handler: this.constructor.findWithStatsHandler,
      config: {
        description: 'Find lists with stats and items',
      },
    });
  }

  static findWithStatsHandler(request) {
    const accountId = objectId(request.auth.credentials.accountId);

    return this.List.findManyWithStats({
      query: { accountId },
    });
  }
}

export default ListsRouter;
