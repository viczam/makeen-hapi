import Joi from 'joi';
import Boom from 'boom';
import { decorators, applyDecorators } from 'octobus.js';

const { withSchema, withLookups, withHandler } = decorators;

const schema = Joi.object().keys({
  _id: Joi.object().required(),
}).required();

const handler = async ({ _id, AccountEntity }) => {
  const account = await AccountEntity.findById(_id);

  if (!account) {
    throw Boom.badRequest('Account not found!');
  }

  if (account.isConfirmed) {
    throw Boom.badRequest('Account is already confirmed!');
  }

  return AccountEntity.replaceOne({
    ...account,
    isConfirmed: true,
  });
};

export default applyDecorators([
  withSchema(schema),
  withLookups({
    AccountEntity: 'entity.Account',
  }),
  withHandler,
], handler);
