import Joi from 'joi';

export default {
  _id: Joi.object(),
  userId: Joi.object().required(),
  ip: Joi.string().required(),
  browser: Joi.string().required(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
};
