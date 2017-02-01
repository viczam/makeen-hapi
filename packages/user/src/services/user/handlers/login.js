import Joi from 'joi';
import Boom from 'boom';
import { decorators, applyDecorators } from 'octobus.js';

const { withSchema, withLookups, withHandler } = decorators;

const schema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
}).required();

const handler = async ({ username, UserEntity, AccountEntity, next, params }) => {
  const user = await UserEntity.findOne({
    query: {
      $or: [{
        username,
      }, {
        email: username,
      }],
    },
  });

  if (!user) {
    throw Boom.badRequest('User not found!');
  }

  if (!user.isActive) {
    throw Boom.badRequest('User is not active!');
  }

  const account = await AccountEntity.findById(user.accountId);

  if (!account.isConfirmed) {
    throw Boom.badRequest('Account is not confirmed!');
  }

  if (!account.isActive) {
    throw Boom.badRequest('Account is not active!');
  }

  return next({
    ...params,
    user,
  });
};

export default applyDecorators([
  withSchema(schema),
  withLookups({
    UserEntity: 'entity.User',
    AccountEntity: 'entity.Account',
  }),
  withHandler,
], handler);
