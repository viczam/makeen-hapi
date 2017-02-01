import * as HapiOctobus from 'hapi-octobus';
import Octobus, { OctobusWithLogger } from 'octobus.js';
import pkg from '../package.json';
import setupServices from './services';
import createEntity from './libs/createEntity';

export function register(server, options, next) {
  process.on('unhandledRejection', (reason, p) => {
    console.log(reason); // eslint-disable-line no-console
    server.log(`Unhandled Rejection at: Promise ${p}, reason: ${reason}`);
    throw reason;
  });

  const eventDispatcher = process.env.NODE_ENV === 'production' ?
    new Octobus() :
    new OctobusWithLogger({
      log(msg) { console.log(msg); }, // eslint-disable-line no-console
      logParams: false,
      logSubscriptions: false,
    });

  server.register([{
    register: HapiOctobus,
    options: {
      eventDispatcher,
    },
  }]).then(() => {
    const dispatcher = server.plugins['hapi-octobus'].eventDispatcher;
    const { mongoDb: db, refManager } = server.plugins['makeen-storage'];

    setupServices(dispatcher);

    server.expose('createEntity', createEntity({ dispatcher, db, refManager }));

    return next();
  }, next);
}

register.attributes = {
  pkg,
  dependencies: ['hapi-octobus', 'makeen-storage'],
};
