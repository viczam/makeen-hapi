import MongoResourceRouter from 'makeen-core/src/routers/MongoResourceRouter';
import { ObjectID as objectId } from 'mongodb';
import omit from 'lodash/omit';
import { route } from 'makeen-core/src/octobus/decorators';
import listSchema from '../schemas/list';

class ListsRouter extends MongoResourceRouter {
  constructor(serviceBus, config = {}) {
    super({
      namespace: 'TodoLists',
      basePath: '/lists',
      getRepository: (request, reply) => reply(request.server.plugins['makeen-todo'].ListRepository),
      entitySchema: omit(listSchema, [
        '_id', 'createdBy', 'createdAt', 'updatedAt', 'accountId',
      ]),
      ...config,
    });

    this.applyContext({
      generateContext: (request) => ({
        accountId: objectId(request.auth.credentials.accountId),
      }),
    });

    this.ListRepository = serviceBus.extract('ListRepository');

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

    return this.ListRepository.findManyWithStats({
      query: { accountId },
    });
  }
}

export default ListsRouter;
