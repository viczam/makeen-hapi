import Joi from 'joi';
import Boom from 'boom';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import trimEnd from 'lodash/trimEnd';
import trimStart from 'lodash/trimStart';

class Router {
  static defaultConfig = {
    baseRouteConfig: {},
    basePath: '',
  };

  constructor(config = {}) {
    this.config = Joi.attempt({
      ...Router.defaultConfig,
      ...config,
    }, Joi.object().keys({
      namespace: Joi.string().required(),
      basePath: Joi.string().required(),
      baseRouteConfig: Joi.object().default({}),
    }).unknown());

    this.routes = {};
  }

  addRoute = (id, routeConfig) => {
    if (!id) {
      throw new Error('Route id is required!');
    }

    if (this.routes[id]) {
      throw new Error(`Route with id ${id} already added!`);
    }

    const route = Joi.attempt(routeConfig, {
      method: Joi.string().default('GET'),
      path: Joi.string().required(),
      handler: Joi.alternatives().try([
        Joi.func().required(),
        Joi.object().required(),
      ]),
      config: Joi.object().default({}),
    });

    this.routes[id] = {
      ...route,
      path: this.buildPath(route.path),
      handler: Router.wrapHandler(route.handler),
      config: {
        ...this.config.baseRouteConfig,
        id: `${this.config.namespace}:${id}`,
        tags: ['api'],
        ...route.config,
      },
    };

    return this;
  }

  buildPath(suffix) {
    return trimEnd(
      `${trimEnd(this.config.basePath, '/')}/${trimStart(suffix, '/')}`,
      '/',
    );
  }

  addRoutes(routes) {
    Object.keys(routes).forEach((routeId) => {
      this.addRoute(routeId, routes[routeId]);
    });

    return this;
  }

  getRoutes() {
    return this.routes;
  }

  toArray(args) {
    const { only, without } = {
      ...(args || {}),
      only: [],
      without: [],
    };

    let ids = Object.keys(this.routes);

    if (only.length) {
      ids = pick(ids, only);
    }

    if (without.length) {
      ids = omit(ids, without);
    }

    return ids.reduce((acc, id) => [...acc, this.routes[id]], []);
  }

  nestRouter(router) {
    const routes = router.getRoutes();
    Object.keys(routes).forEach((routeId) => {
      this.addRoute(`${router.config.namespace}:${routeId}`, {
        ...routes[routeId],
        config: {
          ...routes[routeId].config,
          id: `${this.config.namespace}:${router.config.namespace}:${routeId}`,
        },
      });
    });
  }

  static wrapHandler(handler) {
    return async function (request, reply) { // eslint-disable-line func-names
      try {
        reply(await Promise.resolve(handler.call(this, request, reply)));
      } catch (err) {
        reply(Boom.wrap(err));
      }
    };
  }
}

export default Router;
