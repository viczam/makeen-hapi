import Joi from 'joi';
import generateCRUDRoutes from 'makeen-crud/src/libs/generateCRUDRoutes';
import applyContextToCRUDRoute from 'makeen-crud/src/libs/applyContextToCRUDRoute';
import omit from 'lodash/omit';
import { ObjectID as objectId } from 'mongodb';
import { objectIdPattern } from 'makeen-core/src/constants';
import findOne from 'makeen-crud/src/handlers/findOne';
import itemSchema from '../../schemas/item';
import * as handlers from './handlers';

const pathPrefix = '/lists/{listId}/items';

const pres = {
  list: {
    method: findOne({
      entityName: 'TodoList',
      extractQuery: (request) => ({
        _id: objectId(request.params.listId),
        accountId: objectId(request.auth.credentials.accountId),
      }),
    }),
    assign: 'list',
  },
  item: {
    method: findOne({
      entityName: 'TodoItem',
      extractQuery: (request) => ({
        _id: objectId(request.params.id),
        listId: objectId(request.pre.list._id),
      }),
    }),
    assign: 'item',
  },
};

const baseConfig = {
  pre: [
    pres.list,
  ],
  validate: {
    params: {
      listId: Joi.string().regex(objectIdPattern).required(),
    },
  },
  tags: ['api'],
};

const crudRoutes = generateCRUDRoutes({
  pathPrefix,
  entityName: 'TodoItem',
  schema: omit(itemSchema, ['_id', 'accountId', 'listId', 'createdBy', 'createdAt', 'updatedAt']),
});

Object.keys(crudRoutes).forEach((route) => {
  crudRoutes[route].config = {
    ...baseConfig,
    ...crudRoutes[route].config,
    validate: {
      ...crudRoutes[route].config.validate,
      params: {
        ...(crudRoutes[route].config.validate.params || {}),
        ...baseConfig.validate.params,
      },
    },
    pre: [
      ...baseConfig.pre,
      ...crudRoutes[route].config.pre,
      {
        method: applyContextToCRUDRoute(route, (request) => ({
          accountId: objectId(request.auth.credentials.accountId),
          listId: request.pre.list._id,
        })),
      },
    ],
  };
});

crudRoutes.createOne.config.pre.push({
  async method(request, reply) {
    Object.assign(request.pre.payload, {
      createdBy: objectId(request.auth.credentials.id),
    });

    reply();
  },
});

const routes = [{
  path: `${pathPrefix}/{id}/toggle`,
  method: 'POST',
  handler: handlers.toggle,
  config: {
    ...baseConfig,
    validate: {
      params: {
        ...baseConfig.validate.params,
        id: Joi.string().regex(objectIdPattern).required(),
      },
    },
    description: 'Toggle an item status (checked / unchecked)',
    pre: [
      [pres.list, pres.item],
    ],
  },
}];

export default [
  ...Object.keys(crudRoutes).reduce((acc, route) => [...acc, crudRoutes[route]], []),
  ...routes,
];
