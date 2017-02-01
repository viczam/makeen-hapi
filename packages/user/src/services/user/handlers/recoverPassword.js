import { decorators, applyDecorators } from 'octobus.js';
import Boom from 'boom';

const { withLookups, withHandler } = decorators;

const handler = async ({ password, token, User, UserEntity }) => {
  const user = await UserEntity.findOne({
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

  const updateResult = await UserEntity.updateOne({
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
};

export default applyDecorators([
  withLookups({
    UserEntity: 'entity.User',
    User: 'User',
  }),
  withHandler,
], handler);
