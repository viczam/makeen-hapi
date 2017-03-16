import HapiBoomDecorators from 'hapi-boom-decorators';
import Scooter from 'scooter';
import * as HapiOctobus from 'hapi-octobus';
import MessageBus from './octobus/MessageBus';
import ServiceBus from './octobus/ServiceBus';
import pkg from '../package.json';

const register = async (server, options, next) => {
  process.on('unhandledRejection', (reason, p) => {
    console.log(reason); // eslint-disable-line no-console
    server.log(`Unhandled Rejection at: Promise ${p}, reason: ${reason}`);
    throw reason;
  });

  try {
    const messageBus = new MessageBus();

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

    server.method('createServiceBus', (...args) => new ServiceBus(...args));

    next();
  } catch (err) {
    next(err);
  }
};

register.attributes = {
  pkg,
  dependencies: ['hapi-octobus'],
};

export { register };
