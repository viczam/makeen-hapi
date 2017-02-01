import Joi from 'joi';
import { objectIdPattern } from 'makeen-core/src/constants';
import * as handlers from './handlers';

export default [{
  path: '/account/{id}/confirm',
  method: 'GET',
  handler: handlers.confirm,
  config: {
    auth: false,
    validate: {
      params: {
        id: Joi.string().regex(objectIdPattern).required(),
      },
    },
    description: 'Confirm account',
    tags: ['api'],
  },
}, {
  path: '/account/users',
  method: 'GET',
  handler: handlers.findUsers,
  config: {
    description: 'Retrieve all account users',
    tags: ['api'],
  },
}, {
  path: '/account/resend-activation-email',
  method: 'POST',
  handler: handlers.resendActivationEmail,
  config: {
    auth: false,
    validate: {
      payload: Joi.object().keys({
        email: Joi.string().required().email(),
      }),
    },
    description: 'Resend activation email',
    tags: ['api'],
  },
}];
