import { ObjectID as objectId } from 'mongodb';
import generateCRUDRoutes from 'makeen-crud/src/libs/generateCRUDRoutes';
import applyContextToCRUDRoute from 'makeen-crud/src/libs/applyContextToCRUDRoute';
import omit from 'lodash/omit';
import listSchema from '../../schemas/list';
import * as handlers from './handlers';

const pathPrefix = '/lists';

const baseConfig = {
  pre: [],
  tags: ['api'],
};

const crudRoutes = generateCRUDRoutes({
  pathPrefix,
  entityName: 'TodoList',
  schema: omit(listSchema, ['_id', 'createdBy', 'createdAt', 'updatedAt', 'accountId']),
});

Object.keys(crudRoutes).forEach((route) => {
  crudRoutes[route].config.pre.push(
    {
      method: applyContextToCRUDRoute(
        route,
        (request) => ({
          accountId: objectId(request.auth.credentials.accountId),
        }),
      ),
    },
  );
});

crudRoutes.createOne.config.pre.push({
  async method(request, reply) {
    Object.assign(request.pre.payload, {
      createdBy: objectId(request.auth.credentials.id),
    });

    reply();
  },
});

export default [
  ...Object.keys(crudRoutes).reduce((acc, route) => [...acc, crudRoutes[route]], []),
  {
    path: `${pathPrefix}/find-with-stats`,
    method: 'GET',
    handler: handlers.findWithStats,
    config: {
      ...baseConfig,
      description: 'Find lists with stats and items',
    },
  },
];
