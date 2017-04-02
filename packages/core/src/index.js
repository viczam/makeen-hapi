import HapiBoomDecorators from 'hapi-boom-decorators';
import Scooter from 'scooter';
import * as HapiOctobus from 'hapi-octobus';
import { Store, decorators } from 'octobus-mongodb-store';
import MessageBus from './octobus/MessageBus';
import ServiceBus from './octobus/ServiceBus';
import pkg from '../package.json';

const MongoDbStore = decorators.withTimestamps(Store);

const register = async (server, options, next) => {
  process.on('unhandledRejection', (reason, p) => {
    console.log(reason); // eslint-disable-line no-console
    server.log(`Unhandled Rejection at: Promise ${p}, reason: ${reason}`);
    throw reason;
  });

  try {
    const { mongoDb, refManager } = server.plugins['makeen-db'];
    const messageBus = new MessageBus();

    messageBus.onMessage((msg) => {
      console.log(JSON.stringify(msg, null, 2)); // eslint-disable-line
    });

    await server.register([
      HapiBoomDecorators,
      Scooter,
      {
        register: HapiOctobus,
        options: {
          messageBus,
        },
      },
    ]);

    server.method('createServiceBus', (...args) => {
      const serviceBus = new ServiceBus(...args);
      serviceBus.connect(messageBus);
      return serviceBus;
    });

    server.method('createStore', (config = {}) => (
      new MongoDbStore({
        db: mongoDb,
        refManager,
        ...config,
      })
    ));

    next();
  } catch (err) {
    next(err);
  }
};

register.attributes = {
  pkg,
  dependencies: ['hapi-octobus', 'makeen-db'],
};

export { register };
