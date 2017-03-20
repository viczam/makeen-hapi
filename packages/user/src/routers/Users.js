import MongoResourceRouter from 'makeen-core/src/routers/MongoResourceRouter';
import { route } from 'makeen-core/src/octobus/decorators';
import Joi from 'joi';
import { ObjectID as objectId } from 'mongodb';
import pick from 'lodash/pick';
import { extractProfileInfo } from '../lib/helpers';
import userSchema from '../schemas/user';

class UsersRouter extends MongoResourceRouter {
  constructor(config = {}) {
    super({
      namespace: 'Users',
      basePath: '/users',
      getRepository: (request) => request.server.plugins['makeen-user'].UserService,
      entitySchema: userSchema,
      ...config,
    });

    [
      'count', 'deleteOne', 'findById', 'findMany', 'findOne', 'replaceOne', 'updateOne',
    ].forEach((routeId) => {
      this.routes[routeId].config.auth = {
        strategy: 'jwt',
        scope: 'admin',
      };
    });
  }

  @route({
    path: '/login',
    method: 'POST',
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

  @route({
    path: '/register',
    method: 'POST',
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

  @route({
    path: '/reset-password',
    method: 'POST',
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

  @route({
    path: '/recover-password/{token}',
    method: 'POST',
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

  @route({
    path: '/change-password',
    method: 'POST',
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

  @route({
    path: '/me',
    method: 'GET',
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

  @route({
    path: '/me',
    method: 'POST',
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
