import Joi from 'joi';

export default {
  _id: Joi.object(),

  isConfirmed: Joi.boolean().default(false),
  isActive: Joi.boolean().default(true),

  name: Joi.string(),

  isDeleted: Joi.boolean().default(false),
  deletedAt: Joi.date(),

  createdAt: Joi.date(),
  updatedAt: Joi.date(),
};
