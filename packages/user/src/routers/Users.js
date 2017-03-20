import MongoResourceRouter from 'makeen-core/src/routers/MongoResourceRouter';
import { route } from 'makeen-core/src/octobus/decorators';
import Joi from 'joi';
import { ObjectID as objectId } from 'mongodb';
import pick from 'lodash/pick';
import { extractProfileInfo } from '../lib/helpers';
import userSchema from '../schemas/user';

class UsersRouter extends MongoResourceRouter {
  constructor(serviceBus, config = {}) {
    super({
      namespace: 'Users',
      basePath: '/users',
      getRepository: (request, reply) => reply(request.server.plugins['makeen-user'].UserRepository),
      entitySchema: userSchema,
      ...config,
    });

    this.User = serviceBus.extract('User');
    this.UserLoginRepository = serviceBus.extract('UserLoginRepository');

    [
      'count', 'deleteOne', 'findById', 'findMany', 'findOne', 'replaceOne', 'updateOne',
    ].forEach((routeId) => {
      this.routes[routeId].config.auth = {
        strategy: 'jwt',
        scope: 'admin',
      };
    });
  }

  @route.post({
    path: '/login',
    config: {
      auth: false,
      validate: {
        payload: pick(userSchema, ['username', 'password']),
      },
      description: 'User login',
    },
  })
  async login(request) {
    const result = await this.User.login(request.payload);
    const user = await this.User.dump(result);

    await this.UserLoginRepository.createOne({
      userId: user._id,
      ip: request.info.remoteAddress,
      browser: request.plugins.scooter.toString(),
    });

    return user;
  }

  @route.post({
    path: '/register',
    config: {
      auth: false,
      validate: {
        payload: {
          ...pick(userSchema, [
            'name', 'username', 'email', 'password',
          ]),
        },
      },
      description: 'Register a new user',
    },
  })
  register(request) {
    return this.User.register(request.payload);
  }

  @route.post({
    path: '/reset-password',
    config: {
      auth: false,
      validate: {
        payload: {
          usernameOrEmail: Joi.string(),
        },
      },
      description: 'Reset password',
    },
  })
  async resetPassword(request) {
    const { user, updateResult } = await this.User.resetPassword(request.payload.usernameOrEmail);
    const curatedUser = await this.User.dump(user);
    return {
      user: curatedUser,
      updateResult,
    };
  }

  @route.post({
    path: '/recover-password/{token}',
    config: {
      auth: false,
      validate: {
        params: {
          token: Joi.string().required(),
        },
        payload: {
          password: Joi.string().required(),
        },
      },
      description: 'Recover password',
    },
  })
  async recoverPassword(request) {
    const { password } = request.payload;
    const { token } = request.params;
    const { user, updateResult } = await this.User.recoverPassword({ password, token });
    const curatedUser = await this.User.dump(user);
    return {
      user: curatedUser,
      updateResult,
    };
  }

  @route.post({
    path: '/change-password',
    config: {
      validate: {
        payload: {
          oldPassword: Joi.string().required(),
          password: Joi.string().required(),
        },
      },
      description: 'Change password',
    },
  })
  async changePassword(request) {
    const { oldPassword, password } = request.payload;
    return this.User.changePassword({
      password,
      oldPassword,
      userId: objectId(request.auth.credentials.id),
    });
  }

  @route.get({
    path: '/me',
    config: {
      description: 'User profile',
    },
  })
  async getProfile(request) {
    const userId = objectId(request.auth.credentials.id);
    const user = await this.User.findById(userId);
    return {
      ...extractProfileInfo(user),
      profilePicture: request.server.settings.app.uploadDir,
    };
  }

  @route.post({
    path: '/me',
    config: {
      description: 'Update user profile',
      validate: {
        payload: pick(userSchema, ['username', 'name', 'email']),
      },
    },
  })
  async updateProfile(request) {
    const userId = objectId(request.auth.credentials.id);
    const data = request.payload;
    const user = await this.User.findById(userId);
    await this.User.updateOne({
      query: {
        _id: userId,
      },
      update: {
        $set: data,
      },
    });

    return extractProfileInfo({
      ...user,
      ...data,
    });
  }
}

export default UsersRouter;
