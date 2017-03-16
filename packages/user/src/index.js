import Joi from 'joi';
import Bell from 'bell';
import Inert from 'inert';
import HapiAuthJwt2 from 'hapi-auth-jwt2';
import pkg from '../package.json';
import pluginOptionsSchema from './schemas/pluginOptions';
import UserService from './services/User';
import AccountService from './services/Account';
import UserLoginService from './services/UserLogin';
import AccountRouter from './routers/Account';
import UsersRouter from './routers/Users';

export async function register(server, options, next) {
  try {
    const pluginOptions = Joi.attempt(options, pluginOptionsSchema);
    const { mongoDb, refManager } = server.plugins['makeen-db'];
    const { messageBus } = server.plugins['hapi-octobus'];
    const serviceBus = server.methods.createServiceBus('user');
    serviceBus.connect(messageBus);

    const User = serviceBus.register(
      new UserService({
        mongoDb,
        refManager,
        jwtConfig: pluginOptions.jwt,
      }),
    );

    const Account = serviceBus.register(
      new AccountService({
        mongoDb,
        refManager,
      }),
    );

    const UserLogin = serviceBus.register(
      new UserLoginService({
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
        User,
        UserLogin,
        Account,
      });

      server.expose('UserService', User);
      server.expose('UserLoginService', UserLogin);
      server.expose('AccountService', Account);

      server.route([
        ...(new AccountRouter()).toArray(),
        ...(new UsersRouter()).toArray(),
      ]);

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
  dependencies: ['makeen-db', 'makeen-core'],
};
