import Joi from 'joi';

export default {
  jwt: Joi.object().keys({
    key: Joi.string().min(10).required(),
    options: {
      expiresIn: Joi.alternatives().try(Joi.string(), Joi.number()).default('1d'),
    },
  }),
  user: Joi.object().keys({
    collectionName: Joi.string().default('User'),
  }).default({}),
  socialPlatforms: Joi.object().keys({
    facebook: Joi.object().keys({
      password: Joi.string().required(),
      clientId: Joi.string().required(),
      clientSecret: Joi.string().required(),
    }),

    google: Joi.object().keys({
      password: Joi.string().required(),
      clientId: Joi.string().required(),
      clientSecret: Joi.string().required(),
    }),
  }).required(),
};
