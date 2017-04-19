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
      ...config,
    };

    this.register = this.register.bind(this);

    this.register.attributes = {
      pkg: {
        name: this.config.name,
      },
      dependencies: ['makeen-core'],
    };
  }

  boot() {}

  createServiceBus(...args) {
    return new ServiceBus(...args);
  }

  createStore(options) {
    return new MongoDbStore({
      db: this.db,
      refManager: this.refManager,
      ...options,
    });
  }

  createRepository(name, schema) {
    const store = this.createStore({ collectionName: name });
    return new CRUDServiceContainer(store, schema);
  }

  createResourceRouter(repository, options) {
    return new MongoResourceRouter(repository, options);
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
        entitySchema: omit(schema, ['_id']),
      });

    this.server.expose(`${name}Repository`, repository);
    router.mount(this.server);

    return {
      repository,
      router,
    };
  }

  async register(server, options, next) {
    try {
      this.options = this.config.schema
        ? Joi.attempt(options, this.config.schema)
        : options;
      this.server = server;
      this.messageBus = server.plugins['hapi-octobus'].messageBus;
      this.db = server.plugins['makeen-db'].mongoDb;
      this.refManager = server.plugins['makeen-db'].refManager;
      this.serviceBus = this.createServiceBus(this.config.name);

      this.serviceBus.connect(this.messageBus);

      this.boot(this.server, this.options);

      next();
    } catch (err) {
      next(err);
    }
  }
}

export default Plugin;
