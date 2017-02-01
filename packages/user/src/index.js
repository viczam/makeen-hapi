import Joi from 'joi';
import * as hbUser from 'hb-user';
import Inert from 'inert';
import pkg from '../package.json';
import pluginOptionsSchema from './schemas/pluginOptions';
import userSchema from './schemas/user';
import setupServices from './services/index';
import routes from './routes';

export function register(server, options, next) {
  const dispatcher = server.plugins['hapi-octobus'].eventDispatcher;
  const { dispatch, lookup } = dispatcher;
  const pluginOptions = Joi.attempt(options, pluginOptionsSchema);
  const { mongoDb, refManager } = server.plugins['makeen-storage'];
  const { createEntity } = server.plugins['makeen-core'];

  if (pluginOptions.socialPlatforms.facebook) {
    server.auth.strategy('facebook', 'bell', {
      provider: 'facebook',
      isSecure: false,
      ...pluginOptions.socialPlatforms.facebook,
    });
  }

  if (pluginOptions.socialPlatforms.google) {
    server.auth.strategy('google', 'bell', {
      provider: 'google',
      isSecure: false,
      ...pluginOptions.socialPlatforms.google,
    });
  }

  server.register([{
    register: hbUser,
    options: {
      jwt: pluginOptions.jwt,
      serviceOptions: {
        ...pluginOptions.user,
        references: [],
        schema: userSchema,
        db: mongoDb,
        refManager,
      },
      registerRoutes: false,
    },
  }, {
    register: Inert,
  }]).then(() => {
    server.auth.default('jwt');

    setupServices({
      createEntity,
      dispatcher,
      pluginOptions,
      app: server.settings.app,
    });

    const UserEntity = lookup('entity.User');
    const AccountEntity = lookup('entity.Account');
    const User = lookup('User');
    const UserLogin = lookup('entity.UserLogin');

    server.expose('UserEntity', UserEntity);
    server.expose('AccountEntity', AccountEntity);
    server.expose('User', User);

    server.bind({
      dispatch,
      lookup,
      UserEntity,
      AccountEntity,
      User,
      UserLogin,
    });

    server.route(routes);

    return next();
  }, next);
}

register.attributes = {
  pkg,
  dependencies: ['makeen-storage', 'bell', 'makeen-crud', 'makeen-core'],
};
