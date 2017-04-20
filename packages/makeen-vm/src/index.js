import Joi from 'joi';
import pkg from '../package.json';
import routesBuilder from './routes';
import optionSchema from './schemas/optionSchema';

export async function register(server, options, next) {
  try {
    Joi.attempt(options, optionSchema);

    routesBuilder(server, options);

    next();
  } catch (err) {
    next(err);
  }
}

register.attributes = {
  pkg,
  dependencies: ['makeen-core'],
};
