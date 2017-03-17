import Joi from 'joi';
import Boom from 'boom';
import { CRUDServiceContainer } from 'octobus-crud';
import { ObjectID as objectId } from 'mongodb';
import { Store } from 'octobus-mongodb-store';
import jwt from 'jsonwebtoken';
import pick from 'lodash/pick';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import { service, withSchema } from 'makeen-core/src/octobus/annotations';
import userSchema from '../schemas/user';

class User extends CRUDServiceContainer {
  static hashPassword({ password, salt }) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, salt, (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });
  }

  constructor(options) {
    super(
      new Store({
        db: options.mongoDb,
        refManager: options.refManager,
        collectionName: 'User',
      }),
      userSchema,
    );

    this.jwtConfig = options.jwtConfig;
  }

  @service()
  @withSchema({
    user: Joi.object().keys({
      id: Joi.required(),
      username: Joi.string().required(),
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
    const Account = this.extract('Account');
    const user = await this.findOne({
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

    const account = await Account.findById(user.accountId);

    if (!account.labels.includes('isConfirmed')) {
      throw Boom.badRequest('Account is not confirmed!');
    }

    if (!account.labels.includes('isActive')) {
      throw Boom.badRequest('Account is not active!');
    }

    const hashedPassword = await User.hashPassword({ password, salt: user.salt });

    if (user.password !== hashedPassword) {
      throw Boom.badRequest('Incorrect password!');
    }

    const updatedUser = await this.replaceOne({
      ...user,
      lastLogin: new Date(),
    });

    const serializedUser = await this.serialize(updatedUser);
    const token = await this.createToken({
      user: {
        id: serializedUser.id,
        username: serializedUser.username,
      },
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
      id: data._id,
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
    const user = await this.findById(userId);

    if (!user) {
      throw Boom.badRequest('User not found!');
    }

    const oldHashedPassword = await User.hashPassword({
      password: oldPassword,
      salt: user.salt,
    });

    if (oldHashedPassword !== user.password) {
      throw Boom.badRequest('Invalid password!');
    }

    const hashedPassword = await User.hashPassword({
      password,
      salt: user.salt,
    });

    if (hashedPassword === user.password) {
      throw Boom.badRequest('You can\'t use the same password!');
    }

    return this.updateOne({
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
    const user = await this.findOne({
      query: {
        'resetPassword.token': token,
      },
    });

    if (!user) {
      throw Boom.badRequest('Token not found!');
    }

    const hashedPassword = await User.hashPassword({
      password,
      salt: user.salt,
    });

    if (hashedPassword === user.password) {
      throw Boom.badRequest('You can\'t use the same password!');
    }

    const updateResult = await this.updateOne({
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
  async register({ username, email }, { message }) {
    const Account = this.extract('Account');
    const existingUser = await this.findOne({
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

    const account = await Account.createOne({});

    const user = await this.createOne({
      accountId: account._id,
      ...message.data,
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
    const user = await this.findOne({
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

    const updateResult = await this.updateOne({
      query: { _id: user._id },
      update: {
        $set: { resetPassword },
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

    const user = await this.findOne({
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

    const updatedUser = await this.replaceOne({
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

  save(data) {
    const { hashPassword, ...restData } = data;

    if (!restData.salt) {
      restData.salt = bcrypt.genSaltSync(10);
    }

    const shouldHashPassword = (!restData._id || hashPassword) && !!restData.password;

    if (!shouldHashPassword) {
      return super.save(restData);
    }

    return User.hashPassword({
      password: restData.password,
      salt: restData.salt,
    }).then((password) => (
      super.save({
        ...restData,
        password,
      })
    ));
  }

  validateJWT = (decodedToken, request, cb) => {
    if (!decodedToken || !decodedToken.id) {
      cb(null, false);
    } else {
      this.serviceBus.send('User.findById', objectId(decodedToken.id))
        .then((result) => cb(null, !!result), cb);
    }
  }
}

export default User;
