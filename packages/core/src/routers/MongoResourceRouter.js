import Joi from 'joi';
import Boom from 'boom';
import pick from 'lodash/pick';
import Router from './Router';
import { toBSON, idValidator, idToQuery } from '../libs/mongo-helpers';

class MongoResourceRouter extends Router {
  static applyContextToRoute = (route, generateContext) => (request, reply) => {
    const context = generateContext(request);

    switch (route) {
      case 'count':
      case 'deleteOne':
      case 'deleteOneById':
      case 'findById':
      case 'findOne':
        Object.assign(request.pre.query, context);
        break;
      case 'createOne':
        Object.assign(request.pre.payload, context);
        break;
      case 'findMany':
        Object.assign(request.pre.queryParams.query, context);
        break;
      case 'replaceOne':
      case 'updateOne':
        Object.assign(request.pre.query, context);
        Object.assign(request.pre.payload, context);
        break;
      default:
    }

    reply();
  };

  constructor(config) {
    super(
      Joi.attempt(config, Joi.object().keys({
        getRepository: Joi.func().required(),
        entitySchema: Joi.object(),
      }).unknown()),
    );

    this.addRoutes({
      count: {
        path: '/count',
        method: 'GET',
        handler: this.constructor.countHandler,
        config: {
          validate: {
            query: {
              query: Joi.object().default({}),
            },
          },
          description: 'Count entities',
          pre: [{
            method: (request, reply) => reply(toBSON(request.query.query)),
            assign: 'query',
          }],
        },
      },
      createOne: {
        path: '/',
        method: 'POST',
        handler: this.constructor.createOneHandler,
        config: {
          validate: {
            payload: this.config.entitySchema,
          },
          description: 'Create a new entity',
          pre: [{
            method: (request, reply) => reply(toBSON(request.payload)),
            assign: 'payload',
          }],
        },
      },
      deleteOne: {
        path: '/deleteOne',
        method: 'DELETE',
        handler: this.constructor.deleteOneHandler,
        config: {
          validate: {
            payload: {
              query: Joi.object().required(),
            },
          },
          description: 'Delete an entity',
          pre: [{
            method: (request, reply) => reply(toBSON(request.query.query)),
            assign: 'query',
          }],
        },
      },
      deleteOneById: {
        path: '/{id}',
        method: 'DELETE',
        handler: this.constructor.deleteOneHandler,
        config: {
          validate: {
            params: {
              id: idValidator,
            },
          },
          description: 'Delete an entity by id',
          pre: [{
            method: (request, reply) => reply(idToQuery(request.params.id)),
            assign: 'query',
          }],
        },
      },
      findById: {
        path: '/{id}',
        method: 'GET',
        handler: this.constructor.findByIdHandler,
        config: {
          validate: {
            params: {
              id: idValidator,
            },
          },
          description: 'Find an entity by id',
          pre: [{
            method: (request, reply) => reply(idToQuery(request.params.id)),
            assign: 'query',
          }],
        },
      },
      findMany: {
        path: '/',
        method: 'GET',
        handler: this.constructor.findManyHandler,
        config: {
          validate: {
            query: {
              query: Joi.object().default({}),
              offset: Joi.number(),
              limit: Joi.number(),
              orderBy: Joi.object().default({}),
              fields: Joi.object().default({}),
            },
          },
          description: 'Find entities',
          pre: [{
            method: (request, reply) => reply(toBSON(request.query.query)),
            assign: 'query',
          }, {
            method: (request, reply) => {
              const params = pick(request.query, ['fields', 'orderBy']);
              params.query = request.pre.query;

              if (request.query.offset !== undefined) {
                params.skip = parseInt(request.query.offset, 10);
              }

              if (request.query.limit !== undefined) {
                params.limit = parseInt(request.query.limit, 10);
              }

              reply(params);
            },
            assign: 'queryParams',
          }],
        },
      },
      findOne: {
        path: '/findOne',
        method: 'GET',
        handler: this.constructor.findOneHandler,
        config: {
          validate: {
            query: {
              query: Joi.object().default({}),
            },
          },
          description: 'Find one entity',
          pre: [{
            method: (request, reply) => reply(toBSON(request.query.query)),
            assign: 'query',
          }],
        },
      },
      replaceOne: {
        path: '/{id}',
        method: 'PUT',
        handler: this.constructor.replaceOneHandler,
        config: {
          validate: {
            params: {
              id: idValidator,
            },
            payload: this.config.entitySchema,
          },
          description: 'Replace an entity',
          pre: [{
            method: (request, reply) => reply(idToQuery(request.params.id)),
            assign: 'query',
          }, {
            method: (request, reply) => reply(toBSON(request.payload)),
            assign: 'payload',
          }],
        },
      },
      updateOne: {
        path: '/{id}',
        method: 'PATCH',
        handler: this.constructor.updateOneHandler,
        config: {
          validate: {
            params: {
              id: idValidator,
            },
          },
          description: 'Update an entity',
          pre: [{
            method: (request, reply) => reply(idToQuery(request.params.id)),
            assign: 'query',
          }, {
            method: (request, reply) => reply(toBSON(request.payload)),
            assign: 'payload',
          }],
        },
      },
    });
  }

  addRoute(id, route = {}) {
    return super.addRoute(id, {
      ...route,
      config: {
        ...route.config,
        pre: [
          {
            method: this.config.getRepository,
            assign: 'Repository',
          },
          ...(route.config.pre || []),
        ],
      },
    });
  }

  static countHandler(request) {
    const { query, Repository } = request.pre;
    return Repository.count({ query });
  }

  static createOneHandler(request) {
    const { payload, Repository } = request.pre;
    return Repository.createOne(payload);
  }

  static deleteOneHandler(request) {
    const { query, Repository } = request.pre;
    return Repository.deleteOne({ query });
  }

  static async findByIdHandler(request) {
    const { query, Repository } = request.pre;
    const entity = await Repository.findOne({ query });

    if (!entity) {
      throw Boom.notFound(`Unable to find entity with id ${request.params.id}`);
    }

    return entity;
  }

  static findManyHandler(request) {
    const { queryParams, Repository } = request.pre;
    return Repository.findMany(queryParams).then(c => c.toArray());
  }

  static async findOneHandler(request) {
    const { query, Repository } = request.pre;
    const entity = await Repository.findOne({ query });

    if (!entity) {
      throw Boom.notFound('Unable to find entity.');
    }

    return entity;
  }

  static async replaceOneHandler(request) {
    const { query, payload, Repository } = request.pre;
    const entity = await Repository.findOne({ query });

    if (!entity) {
      throw Boom.notFound(`Unable to find entity with id ${request.params.id}`);
    }

    return Repository.replaceOne({
      ...entity,
      ...payload,
    });
  }

  static async updateOneHandler(request) {
    const { query, payload, Repository } = request.pre;
    const entity = await Repository.findOne({ query });

    if (!entity) {
      throw Boom.notFound(`Unable to find entity with id ${request.params.id}`);
    }

    try {
      await Repository.validate({
        ...entity,
        ...payload,
      });
    } catch (err) {
      if (err.isJoi) {
        throw Boom.badRequest(err.details[0].message);
      }

      throw err;
    }

    return Repository.updateOne({
      query,
      update: {
        $set: payload,
      },
    });
  }

  applyContext({ routes, generateContext }) {
    (routes || Object.keys(this.routes)).forEach((routeId) => {
      this.routes[routeId].config.pre.push({
        method: this.constructor.applyContextToRoute(routeId, generateContext),
      });
    });
  }
}

export default MongoResourceRouter;
