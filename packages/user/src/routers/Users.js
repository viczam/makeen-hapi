import MongoResourceRouter from 'makeen-core/src/routers/MongoResourceRouter';
import { route } from 'makeen-core/src/octobus/decorators';
import Joi from 'joi';
import { ObjectID as objectId } from 'mongodb';
import pick from 'lodash/pick';
import { extractProfileInfo } from '../lib/helpers';
import userSchema from '../schemas/user';

class UsersRouter extends MongoResourceRouter {
  constructor(
    {
      User,
      UserLoginRepository,
      UserRepository,
    },
    config = {},
  ) {
    super(UserRepository, {
      namespace: 'Users',
      basePath: '/users',
      entitySchema: userSchema,
      ...config,
    });

    this.User = User;
    this.UserLoginRepository = UserLoginRepository;
    this.UserRepository = UserRepository;

    [
      'count',
      'deleteOne',
      'findById',
      'findMany',
      'findOne',
      'replaceOne',
      'updateOne',
    ].forEach(routeId => {
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
    path: '/refresh-token',
    config: {
      description: 'Refresh authentication token',
    },
  })
  async refreshToken(request) {
    const userId = objectId(request.auth.credentials.id);
    const user = await this.UserRepository.findById(userId);
    const token = await this.User.createToken({
      user: await this.User.serialize(user),
    });
    return { token };
  }

  @route.post({
    path: '/signup',
    config: {
      auth: false,
      validate: {
        payload: {
          ...pick(userSchema, ['name', 'username', 'email', 'password']),
        },
      },
      description: 'Register a new user',
    },
  })
  signup(request) {
    return this.User.signup(request.payload);
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
    const user = await this.UserRepository.findById(userId);
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
        payload: {
          username: Joi.string(),
          name: Joi.string(),
        },
      },
    },
  })
  async updateProfile(request) {
    const userId = objectId(request.auth.credentials.id);
    const data = request.payload;
    const user = await this.UserRepository.findById(userId);
    await this.UserRepository.updateOne({
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
