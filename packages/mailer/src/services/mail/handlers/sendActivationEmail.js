import Joi from 'joi';
import { hoc, applyDecorators } from 'octobus.js';

const { withSchema, withHandler } = hoc;

const schema = Joi.object().keys({
  user: Joi.object().required(),
  account: Joi.object().required(),
}).required();

const handler = ({ user, account, dispatch }) => (
  dispatch('Mail.send', {
    to: user.email,
    subject: 'welcome',
    template: 'UserRegistration',
    context: {
      user,
      account,
    },
  })
);

export default applyDecorators([
  withSchema(schema),
  withHandler,
], handler);
