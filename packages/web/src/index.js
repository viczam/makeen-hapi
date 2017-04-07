import Joi from 'joi';
import Inert from 'inert';
import Vision from 'vision';
import H2O2 from 'h2o2';
import HapiReactViews from 'hapi-react-views';
import pkg from '../package.json';
import MainRouter from './routers/Main';
import pluginOptionsSchema from './schemas/pluginOptions';

export async function register(server, options, next) {
  try {
    const pluginOptions = Joi.attempt(options, pluginOptionsSchema);

    await server.register([Inert, Vision, H2O2]);

    server.views({
      engines: {
        jsx: HapiReactViews,
      },
      relativeTo: __dirname,
      path: 'views',
    });

    new MainRouter(pluginOptions).mount(server);
    next();
  } catch (err) {
    next(err);
  }
}

register.attributes = {
  pkg,
  dependencies: [],
};
