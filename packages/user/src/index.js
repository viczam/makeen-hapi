import Joi from 'joi';
import Bell from 'bell';
import Inert from 'inert';
import HapiAuthJwt2 from 'hapi-auth-jwt2';
import pkg from '../package.json';
import pluginOptionsSchema from './schemas/pluginOptions';
import UserService from './services/User';
import UserRepositoryService from './services/UserRepository';
import AccountService from './services/Account';
import AccountRepositoryService from './services/AccountRepository';
import UserLoginRepositoryService from './services/UserLoginRepository';
import AccountRouter from './routers/Account';
import UsersRouter from './routers/Users';

export async function register(server, options, next) {
  try {
    const pluginOptions = Joi.attempt(options, pluginOptionsSchema);

    await server.register([Bell, Inert, HapiAuthJwt2]);

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

    const serviceBus = server.methods.createServiceBus('user', [{
      matcher: /^mailer/,
    }]);

    const User = serviceBus.register(
      new UserService({
        jwtConfig: pluginOptions.jwt,
      }),
    );

    const UserRepository = serviceBus.register(
      new UserRepositoryService({
        store: server.methods.createStore({ collectionName: 'User' }),
      }),
    );

    const Account = serviceBus.register(
      new AccountService(),
    );

    const AccountRepository = serviceBus.register(
      new AccountRepositoryService({
        store: server.methods.createStore({ collectionName: 'Account' }),
      }),
    );

    const UserLoginRepository = serviceBus.register(
      new UserLoginRepositoryService({
        store: server.methods.createStore({ collectionName: 'UserLogin' }),
      }),
    );

    server.auth.strategy('jwt', 'jwt', {
      key: pluginOptions.jwt.key,
      validateFunc: User.validateJWT,
      verifyOptions: {
        algorithms: ['HS256'],
      },
    });

    server.auth.default('jwt');

    server.bind({
      UserRepository,
      User,
      UserLoginRepository,
      Account,
      AccountRepository,
    });

    server.expose('User', User);
    server.expose('UserRepository', UserRepository);
    server.expose('UserLoginRepository', UserLoginRepository);
    server.expose('Account', Account);
    server.expose('AccountRepository', AccountRepository);

    (new UsersRouter({
      User, UserLoginRepository, UserRepository,
    })).mount(server);
    (new AccountRouter({
      User, Account,
    })).mount(server);

    next();
  } catch (err) {
    next(err);
  }
}

register.attributes = {
  pkg,
  dependencies: ['makeen-core', 'makeen-mailer'],
};
