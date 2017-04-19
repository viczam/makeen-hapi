import Joi from 'joi';

export default {
  sentry: Joi.object()
    .keys({
      dsn: Joi.string().required(),
    })
    .default({}),
};
