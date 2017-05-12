import { Plugin } from 'makeen-core';
import Bell from 'bell';
import Inert from 'inert';
import HapiAuthJwt2 from 'hapi-auth-jwt2';
import schema from './schemas/pluginOptions';
import UserService from './services/User';
import UserRepositoryService from './services/UserRepository';
import AccountService from './services/Account';
import AccountRepositoryService from './services/AccountRepository';
import UserLoginRepositoryService from './services/UserLoginRepository';
import AccountRouter from './routers/Account';
import UsersRouter from './routers/Users';

class UserPlugin extends Plugin {
  constructor() {
    super({
      schema,
      name: 'User',
      plugins: [Bell, Inert, HapiAuthJwt2],
      autoCreateServiceBus: false,
      dependencies: ['makeen-core', 'makeen-mailer'],
    });

    this.register.attributes.pkg.name = 'makeen-user';
  }

  setupServices({ jwt, userSchema, accountSchema }) {
    return this.registerServices({
      User: new UserService({
        jwtConfig: jwt,
      }),
      UserRepository: new UserRepositoryService({
        store: this.server.methods.createStore({ collectionName: 'User' }),
        userSchema,
      }),
      Account: new AccountService(),
      AccountRepository: new AccountRepositoryService({
        store: this.server.methods.createStore({ collectionName: 'Account' }),
        accountSchema,
      }),
      UserLoginRepository: new UserLoginRepositoryService({
        store: this.server.methods.createStore({ collectionName: 'UserLogin' }),
      }),
    });
  }

  setupAuthStrategy({ jwt, User }) {
    this.server.auth.strategy('jwt', 'jwt', {
      key: jwt.key,
      validateFunc: User.validateJWT,
      verifyOptions: {
        algorithms: ['HS256'],
      },
    });

    this.server.auth.default('jwt');
  }

  setupRouters({
    User,
    UserRepository,
    UserLoginRepository,
    userSchema,
    Account,
  }) {
    return this.mountRouters([
      new UsersRouter(
        {
          User,
          UserLoginRepository,
          UserRepository,
        },
        {
          entitySchema: userSchema,
        },
      ),
      new AccountRouter({
        User,
        Account,
      }),
    ]);
  }

  async boot(server, options) {
    if (options.socialPlatforms.facebook) {
      server.auth.strategy('facebook', 'bell', {
        provider: 'facebook',
        isSecure: false,
        ...options.socialPlatforms.facebook,
      });
    }

    if (options.socialPlatforms.google) {
      server.auth.strategy('google', 'bell', {
        provider: 'google',
        isSecure: false,
        ...options.socialPlatforms.google,
      });
    }

    this.serviceBus = this.createServiceBus('user', [
      {
        matcher: /^mailer/,
      },
    ]);

    const {
      User,
      UserRepository,
      Account,
      AccountRepository,
      UserLoginRepository,
    } = this.setupServices(options);

    this.setupAuthStrategy({
      ...options,
      User,
    });

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

    this.setupRouters({
      ...options,
      User,
      UserRepository,
      UserLoginRepository,
      Account,
    });
  }
}

export const { register } = new UserPlugin();
