import Joi from 'joi';
import Boom from 'boom';
import pick from 'lodash/pick';
import Router from './Router';
import { toBSON, idValidator, idToQuery } from '../libs/mongo-helpers';
import { route } from '../libs/decorators';

class MongoResourceRouter extends Router {
  static applyContextToRoute = (routeId, generateContext) =>
    (request, reply) => {
      const context = generateContext(request);

      switch (routeId) {
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

  constructor(Repository, config) {
    super(
      Joi.attempt(
        config,
        Joi.object()
          .keys({
            entitySchema: Joi.object(),
          })
          .unknown(),
      ),
    );

    this.Repository = Repository;

    this.addRoute('deleteOneById', {
      path: '/{id}',
      method: 'DELETE',
      handler: this.deleteOne,
      config: {
        validate: {
          params: {
            id: idValidator,
          },
        },
        description: 'Delete an entity by id',
        pre: [
          {
            method: (request, reply) => reply(idToQuery(request.params.id)),
            assign: 'query',
          },
        ],
      },
    });

    this.routes.createOne.config.validate.payload = this.config.entitySchema;
    this.routes.replaceOne.config.validate.payload = this.config.entitySchema;
  }

  @route.get({
    path: '/count',
    config: {
      validate: {
        query: {
          query: Joi.object().default({}),
        },
      },
      description: 'Count entities',
      pre: [
        {
          method: (request, reply) => reply(toBSON(request.query.query)),
          assign: 'query',
        },
      ],
    },
  })
  count(request) {
    const { query } = request.pre;
    return this.Repository.count({ query });
  }

  @route.post({
    path: '/',
    config: {
      validate: {},
      description: 'Create a new entity',
      pre: [
        {
          method: (request, reply) => reply(toBSON(request.payload)),
          assign: 'payload',
        },
      ],
    },
  })
  createOne(request) {
    const { payload } = request.pre;
    return this.Repository.createOne(payload);
  }

  @route.delete({
    path: '/deleteOne',
    config: {
      validate: {
        payload: {
          query: Joi.object().required(),
        },
      },
      description: 'Delete an entity',
      pre: [
        {
          method: (request, reply) => reply(toBSON(request.query.query)),
          assign: 'query',
        },
      ],
    },
  })
  deleteOne(request) {
    const { query } = request.pre;
    return this.Repository.deleteOne({ query });
  }

  @route.get({
    path: '/{id}',
    config: {
      validate: {
        params: {
          id: idValidator,
        },
      },
      description: 'Find an entity by id',
      pre: [
        {
          method: (request, reply) => reply(idToQuery(request.params.id)),
          assign: 'query',
        },
      ],
    },
  })
  async findById(request) {
    const { query } = request.pre;
    const entity = await this.Repository.findOne({ query });

    if (!entity) {
      throw Boom.notFound(`Unable to find entity with id ${request.params.id}`);
    }

    return entity;
  }

  @route.get({
    path: '/',
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
      pre: [
        {
          method: (request, reply) => reply(toBSON(request.query.query)),
          assign: 'query',
        },
        {
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
        },
      ],
    },
  })
  findMany(request) {
    const { queryParams } = request.pre;
    return this.Repository.findMany(queryParams).then(c => c.toArray());
  }

  @route.get({
    path: '/findOne',
    config: {
      validate: {
        query: {
          query: Joi.object().default({}),
        },
      },
      description: 'Find one entity',
      pre: [
        {
          method: (request, reply) => reply(toBSON(request.query.query)),
          assign: 'query',
        },
      ],
    },
  })
  async findOne(request) {
    const { query } = request.pre;
    const entity = await this.Repository.findOne({ query });

    if (!entity) {
      throw Boom.notFound('Unable to find entity.');
    }

    return entity;
  }

  @route.put({
    path: '/{id}',
    method: 'PUT',
    config: {
      validate: {
        params: {
          id: idValidator,
        },
      },
      description: 'Replace an entity',
      pre: [
        {
          method: (request, reply) => reply(idToQuery(request.params.id)),
          assign: 'query',
        },
        {
          method: (request, reply) => reply(toBSON(request.payload)),
          assign: 'payload',
        },
      ],
    },
  })
  async replaceOne(request) {
    const { query, payload } = request.pre;
    const entity = await this.Repository.findOne({ query });

    if (!entity) {
      throw Boom.notFound(`Unable to find entity with id ${request.params.id}`);
    }

    return this.Repository.replaceOne({
      ...entity,
      ...payload,
    });
  }

  @route.patch({
    path: '/{id}',
    config: {
      validate: {
        params: {
          id: idValidator,
        },
      },
      description: 'Update an entity',
      pre: [
        {
          method: (request, reply) => reply(idToQuery(request.params.id)),
          assign: 'query',
        },
        {
          method: (request, reply) => reply(toBSON(request.payload)),
          assign: 'payload',
        },
      ],
    },
  })
  async updateOne(request) {
    const { query, payload } = request.pre;
    const entity = await this.Repository.findOne({ query });

    if (!entity) {
      throw Boom.notFound(`Unable to find entity with id ${request.params.id}`);
    }

    try {
      await this.Repository.validate({
        ...entity,
        ...payload,
      });
    } catch (err) {
      if (err.isJoi) {
        throw Boom.badRequest(err.details[0].message);
      }

      throw err;
    }

    return this.Repository.updateOne({
      query,
      update: {
        $set: payload,
      },
    });
  }

  applyContext({ routes, generateContext }) {
    (routes || Object.keys(this.routes)).forEach(routeId => {
      this.routes[routeId].config.pre.push({
        method: this.constructor.applyContextToRoute(routeId, generateContext),
      });
    });
  }
}

export default MongoResourceRouter;
