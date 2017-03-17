import Joi from 'joi';

export default {
  _id: Joi.object(),
  accountId: Joi.object().required(),

  name: Joi.string().required(),

  createdBy: Joi.object(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
};
