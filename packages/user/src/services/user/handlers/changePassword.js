import { decorators, applyDecorators } from 'octobus.js';
import Boom from 'boom';
import Joi from 'joi';

const { withLookups, withHandler, withSchema } = decorators;

const schema = Joi.object().keys({
  userId: Joi.object().required(),
  oldPassword: Joi.string().required(),
  password: Joi.string().required(),
}).required();

const handler = async ({ userId, oldPassword, password, User, UserEntity }) => {
  const user = await UserEntity.findById(userId);

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

  return await UserEntity.updateOne({
    query: { _id: user._id },
    update: {
      $set: {
        resetPassword: {},
        password: hashedPassword,
      },
    },
  });
};

export default applyDecorators([
  withSchema(schema),
  withLookups({
    UserEntity: 'entity.User',
    User: 'User',
  }),
  withHandler,
], handler);
