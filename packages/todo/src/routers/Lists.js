import { ObjectID as objectId } from 'mongodb';
import omit from 'lodash/omit';
import { route, MongoResourceRouter } from 'makeen-router';
import listSchema from '../schemas/list';

class ListsRouter extends MongoResourceRouter {
  constructor(ListRepository, config = {}) {
    super(ListRepository, {
      namespace: 'TodoLists',
      basePath: '/lists',
      entitySchema: omit(listSchema, [
        '_id',
        'createdBy',
        'createdAt',
        'updatedAt',
        'accountId',
      ]),
      ...config,
    });

    this.applyContext({
      generateContext: request => ({
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
  }

  @route.get({
    path: 'find-with-stats',
    method: 'GET',
    config: {
      description: 'Find lists with stats and items',
    },
  })
  findWithStats(request) {
    const accountId = objectId(request.auth.credentials.accountId);

    return this.Repository.findManyWithStats({
      query: { accountId },
    });
  }
}

export default ListsRouter;
