import Joi from 'joi';

export default {
  uploadDir: Joi.string().required(),
  bewitCredentials: Joi.object().keys({
    key: Joi.string().required(),
    algorithm: Joi.string().valid(['sha256']).default('sha256'),
  }),
};
