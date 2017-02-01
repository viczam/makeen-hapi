import crypto from 'crypto';
import { decorators, applyDecorators } from 'octobus.js';
import Boom from 'boom';

const { withLookups, withHandler } = decorators;

const handler = async ({ params, UserEntity }) => {
  const usernameOrEmail = params;

  const user = await UserEntity.findOne({
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

  const updateResult = await UserEntity.updateOne({
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
};

export default applyDecorators([
  withLookups({
    UserEntity: 'entity.User',
  }),
  withHandler,
], handler);
