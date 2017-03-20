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
    const { mongoDb, refManager } = server.plugins['makeen-db'];
    const { messageBus } = server.plugins['hapi-octobus'];
    const serviceBus = server.methods.createServiceBus('user', [{
      pattern: /^mailer/,
    }]);
    serviceBus.connect(messageBus);

    const User = serviceBus.register(
      new UserService({
        jwtConfig: pluginOptions.jwt,
      }),
    );

    const UserRepository = serviceBus.register(
      new UserRepositoryService({
        mongoDb,
        refManager,
      }),
    );

    const Account = serviceBus.register(
      new AccountService(),
    );

    const AccountRepository = serviceBus.register(
      new AccountRepositoryService({
        mongoDb,
        refManager,
      }),
    );

    const UserLoginRepository = serviceBus.register(
      new UserLoginRepositoryService({
        mongoDb,
        refManager,
      }),
    );

    server.register([
      Bell,
      Inert,
      HapiAuthJwt2,
    ]).then(() => {
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

      (new UsersRouter()).mount(server);
      (new AccountRouter()).mount(server);

      return next();
    }, next);

    next();
  } catch (err) {
    next(err);
  }

  // if (pluginOptions.socialPlatforms.facebook) {
  //   server.auth.strategy('facebook', 'bell', {
  //     provider: 'facebook',
  //     isSecure: false,
  //     ...pluginOptions.socialPlatforms.facebook,
  //   });
  // }
  //
  // if (pluginOptions.socialPlatforms.google) {
  //   server.auth.strategy('google', 'bell', {
  //     provider: 'google',
  //     isSecure: false,
  //     ...pluginOptions.socialPlatforms.google,
  //   });
  // }
}

register.attributes = {
  pkg,
  dependencies: ['makeen-db', 'makeen-core', 'makeen-mailer'],
};
