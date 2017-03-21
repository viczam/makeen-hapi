import Joi from 'joi';
import Boom from 'boom';
import { ObjectID as objectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import pick from 'lodash/pick';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import { decorators } from 'octobus.js';
import crypto from 'crypto';
import ServiceContainer from 'makeen-core/src/octobus/ServiceContainer';

const { service, withSchema } = decorators;

class User extends ServiceContainer {
  constructor(options) {
    super(options);
    this.jwtConfig = options.jwtConfig;
  }

  setServiceBus(serviceBus) {
    super.setServiceBus(serviceBus);
    this.UserRepository = serviceBus.extract('UserRepository');
    this.AccountRepository = serviceBus.extract('AccountRepository');
    this.Mail = serviceBus.extract('mailer.Mail');
  }

  @service()
  @withSchema({
    user: Joi.object().keys({
      id: Joi.string().required(),
      accountId: Joi.object(),
      username: Joi.string().required(),
      scope: Joi.array().default([]),
    }),
    options: Joi.object().default({}),
  })
  createToken({ options, user }) { // eslint-disable-line class-methods-use-this
    return jwt.sign(user, this.jwtConfig.key, { ...this.jwtConfig.options, ...options });
  }

  @service()
  @withSchema({
    username: Joi.string().required(),
    password: Joi.string().required(),
  })
  async login({ username, password }) {
    const user = await this.UserRepository.findOne({
      query: {
        $or: [{
          username,
        }, {
          email: username,
        }],
      },
    });

    if (
      !user ||
      user.labels.includes('isDeleted')
    ) {
      throw Boom.badRequest('User not found!');
    }

    if (!user.labels.includes('isActive')) {
      throw Boom.badRequest('User is not active!');
    }

    const account = await this.AccountRepository.findById(user.accountId);

    if (!account.labels.includes('isConfirmed')) {
      throw Boom.badRequest('Account is not confirmed!');
    }

    if (!account.labels.includes('isActive')) {
      throw Boom.badRequest('Account is not active!');
    }

    const hashedPassword = await this.hashPassword({ password, salt: user.salt });

    if (user.password !== hashedPassword) {
      throw Boom.badRequest('Incorrect password!');
    }

    const updatedUser = await this.UserRepository.replaceOne({
      ...user,
      lastLogin: new Date(),
    });

    const token = await this.createToken({
      user: await this.serialize(updatedUser),
    });

    return {
      ...updatedUser,
      token,
    };
  }

  @service()
  dump(data) { // eslint-disable-line class-methods-use-this
    return pick(data, [
      'accountId', 'username', 'firstName', 'lastName', 'email', '_id', 'updatedAt',
      'createdAt', 'token', 'labels', 'lastLogin', 'roles',
    ]);
  }

  @service()
  serialize(data) { // eslint-disable-line class-methods-use-this
    return {
      id: data._id.toString(),
      username: data.username,
      accountId: data.accountId,
      scope: data.roles,
    };
  }

  @service()
  @withSchema({
    userId: Joi.object().required(),
    oldPassword: Joi.string().required(),
    password: Joi.string().required(),
  })
  async changePassword({ userId, oldPassword, password }) {
    const user = await this.UserRepository.findById(userId);

    if (!user) {
      throw Boom.badRequest('User not found!');
    }

    const oldHashedPassword = await this.hashPassword({
      password: oldPassword,
      salt: user.salt,
    });

    if (oldHashedPassword !== user.password) {
      throw Boom.badRequest('Invalid password!');
    }

    const hashedPassword = await this.hashPassword({
      password,
      salt: user.salt,
    });

    if (hashedPassword === user.password) {
      throw Boom.badRequest('You can\'t use the same password!');
    }

    return this.UserRepository.updateOne({
      query: { _id: user._id },
      update: {
        $set: {
          resetPassword: {},
          password: hashedPassword,
        },
      },
    });
  }

  @service()
  @withSchema({
    password: Joi.string().required(),
    token: Joi.string().required(),
  })
  async recoverPassword({ password, token }) {
    const user = await this.UserRepository.findOne({
      query: {
        'resetPassword.token': token,
      },
    });

    if (!user) {
      throw Boom.badRequest('Token not found!');
    }

    const hashedPassword = await this.hashPassword({
      password,
      salt: user.salt,
    });

    if (hashedPassword === user.password) {
      throw Boom.badRequest('You can\'t use the same password!');
    }

    const updateResult = await this.UserRepository.updateOne({
      query: { _id: user._id },
      update: {
        $set: {
          resetPassword: {},
          password: hashedPassword,
        },
      },
    });

    return {
      user,
      updateResult,
    };
  }

  @service()
  async signup({ username, email }, { message }) {
    const existingUser = await this.UserRepository.findOne({
      query: {
        $or: [{
          username,
        }, {
          email,
        }],
      },
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw Boom.badRequest('Username already taken.');
      }

      if (existingUser.email === email) {
        throw Boom.badRequest('Email already taken.');
      }
    }

    const account = await this.AccountRepository.createOne({});

    const user = await this.UserRepository.createOne({
      accountId: account._id,
      ...message.data,
    });

    this.Mail.send({
      to: user.email,
      subject: 'welcome',
      template: 'UserSignup',
      context: {
        user,
        account,
      },
    });

    return {
      user: pick(user, [
        'accountId', '_id', 'title', 'firstName', 'lastName', 'email', 'username', 'roles',
        'labels', 'createdAt', 'updatedAt',
      ]),
      account: pick(account, [
        'labels', '_id', 'updatedAt', 'createdAt',
      ]),
    };
  }

  @service()
  async resetPassword(usernameOrEmail) {
    const user = await this.UserRepository.findOne({
      query: {
        $or: [{
          username: usernameOrEmail,
        }, {
          email: usernameOrEmail,
        }],
      },
    });

    if (!user) {
      throw Boom.badRequest('User not found!');
    }

    const resetPassword = {
      token: crypto.randomBytes(20).toString('hex'),
      resetAt: new Date(),
    };

    const updateResult = await this.UserRepository.updateOne({
      query: { _id: user._id },
      update: {
        $set: { resetPassword },
      },
    });

    this.Mail.send({
      to: user.email,
      subject: 'forgot password',
      template: 'ForgotPassword',
      context: {
        user,
        resetPassword,
      },
    });

    return {
      user: {
        ...user,
        resetPassword,
      },
      updateResult,
    };
  }

  @service()
  async socialLogin(params) {
    const { provider, token, expiresIn, profile } = params;

    if (provider === 'google') {
      profile.id = profile.raw.sub;
    }

    const user = await this.UserRepository.findOne({
      query: {
        $or: [{
          [`socialLogin.${provider}.id`]: profile.id,
        }, {
          email: profile.email,
        }],
      },
    });

    if (!user) {
      throw Boom.badRequest('User not found!');
    }

    user.socialLogin[provider] = {
      id: profile.id,
      name: profile.displayName,
      email: profile.email,
      token,
      expiresAt: moment().add(expiresIn, 'seconds').toDate(),
    };

    const updatedUser = await this.UserRepository.replaceOne({
      ...user,
      lastLogin: new Date(),
    });

    const authToken = await this.createToken({
      id: updatedUser._id,
      username: updatedUser.username,
    });

    return {
      ...updatedUser,
      token: authToken,
    };
  }

  @service()
  hashPassword({ password, salt }) { // eslint-disable-line
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, salt, (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });
  }

  validateJWT = (decodedToken, request, cb) => {
    if (!decodedToken || !decodedToken.id) {
      cb(null, false);
    } else {
      this.serviceBus.send('UserRepository.findById', objectId(decodedToken.id))
        .then((result) => cb(null, !!result), cb);
    }
  }
}

export default User;
