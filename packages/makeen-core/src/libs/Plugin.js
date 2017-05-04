/* eslint-disable class-methods-use-this */
import Joi from 'joi';
import { Store, decorators } from 'octobus-mongodb-store';
import camelCase from 'lodash/camelCase';
import omit from 'lodash/omit';
import kebabCase from 'lodash/kebabCase';
import { CRUDServiceContainer } from 'octobus-crud';
import { MongoResourceRouter } from 'makeen-router';
import ServiceBus from '../octobus/ServiceBus';

const MongoDbStore = decorators.withTimestamps(Store);

class Plugin {
  constructor(config = {}) {
    this.config = {
      name: camelCase(this.constructor.name),
      autoCreateServiceBus: true,
      dependencies: ['makeen-core'],
      plugins: [],
      ...config,
    };

    this.register = this.register.bind(this);

    this.register.attributes = {
      pkg: {
        name: this.config.name,
      },
      dependencies: this.config.dependencies,
    };
  }

  async register(server, options, next) {
    try {
      this.options = this.config.schema
        ? Joi.attempt(options, this.config.schema)
        : options;
      this.server = server;

      if (this.config.autoCreateServiceBus) {
        this.serviceBus = this.createServiceBus(this.config.name);
      }

      if (this.getPlugins().length) {
        await server.register(this.getPlugins());
      }

      await this.boot(this.server, this.options);

      next();
    } catch (err) {
      next(err);
    }
  }

  boot() {}

  getPlugins() {
    return this.config.plugins;
  }

  createServiceBus(...args) {
    const serviceBus = new ServiceBus(...args);
    serviceBus.connect(this.server.plugins['hapi-octobus'].messageBus);
    this.server.expose('serviceBus', serviceBus);
    return serviceBus;
  }

  createStore(options) {
    return new MongoDbStore({
      db: this.server.plugins['makeen-db'].mongoDb,
      refManager: this.server.plugins['makeen-db'].refManager,
      ...options,
    });
  }

  createRepository(name, schema) {
    const store = this.createStore({ collectionName: name });
    return new CRUDServiceContainer(store, schema);
  }

  createResourceRouter(repository, options) {
    return new MongoResourceRouter(repository, {
      ...options,
      entitySchema: omit(options.entitySchema, [
        '_id',
        'createdAt',
        'updatedAt',
      ]),
    });
  }

  createResource(name, options = {}) {
    const { schema } = options;
    const repository = this.serviceBus.register(
      `${name}Repository`,
      options.repository || this.createRepository(name, schema),
    );
    const router = options.router ||
      this.createResourceRouter(repository, {
        basePath: `/${kebabCase(name)}s`,
        namespace: name,
        entitySchema: schema,
      });

    this.server.expose(`${name}Repository`, repository);
    router.mount(this.server);

    return {
      repository,
      router,
    };
  }

  mountRouters(routers) {
    routers.forEach(router => {
      router.mount(this.server);
    });
  }

  registerServices(services) {
    if (Array.isArray(services)) {
      return services.map(service => this.serviceBus.register(service));
    }
    return Object.keys(services).reduce(
      (acc, serviceName) => ({
        ...acc,
        [serviceName]: this.serviceBus.register(
          serviceName,
          services[serviceName],
        ),
      }),
      {},
    );
  }
}

export default Plugin;
