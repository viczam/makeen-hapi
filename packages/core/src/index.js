import * as HapiOctobus from 'hapi-octobus';
import Octobus, { OctobusWithLogger } from 'octobus.js';
import pkg from '../package.json';
import setupServices from './services';

export async function register(server, options, next) {
  process.on('unhandledRejection', (reason, p) => {
    console.log(reason); // eslint-disable-line no-console
    server.log(`Unhandled Rejection at: Promise ${p}, reason: ${reason}`);
    throw reason;
  });

  try {
    const eventDispatcher = process.env.NODE_ENV === 'production' ?
      new Octobus() :
      new OctobusWithLogger({
        log(msg) { console.log(msg); }, // eslint-disable-line no-console
        logParams: false,
        logSubscriptions: false,
      });

    await server.register([{
      register: HapiOctobus,
      options: {
        eventDispatcher,
      },
    }]);

    const dispatcher = server.plugins['hapi-octobus'].eventDispatcher;
    setupServices(dispatcher);

    next();
  } catch (err) {
    next(err);
  }
}

register.attributes = {
  pkg,
  dependencies: ['hapi-octobus'],
};
