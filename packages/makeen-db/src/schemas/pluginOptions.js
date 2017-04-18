import Joi from 'joi';

export default {
  mongoDb: Joi.object().keys({
    host: Joi.string().default('localhost'),
    port: Joi.number().default(27017),
    db: Joi.string().required(),
  }),
};
