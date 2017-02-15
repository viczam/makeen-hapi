import Joi from 'joi';
import { RefManager } from 'mongo-dnorm';
import pkg from '../package.json';
import pluginOptionsSchema from './schemas/pluginOptions';
import { connect } from './libs/mongo';
import EntityManager from './libs/EntityManager';

export async function register(server, options, next) {
  const { mongoDb } = Joi.attempt(options, pluginOptionsSchema);

  try {
    const db = await connect(mongoDb);
    const dispatcher = server.plugins['hapi-octobus'].eventDispatcher;
    const refManager = new RefManager(db);

    server.expose('mongoDb', db);
    server.expose('refManager', refManager);
    server.expose('entityManager', new EntityManager({
      dispatcher,
      db,
      refManager,
    }));

    next();
  } catch (err) {
    next(err);
  }
}

register.attributes = {
  pkg,
  dependencies: ['hapi-octobus'],
};
