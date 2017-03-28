import Joi from 'joi';

export default {
  _id: Joi.object(),
  accountId: Joi.object().required(),
  listId: Joi.object().required(),
  assignedTo: Joi.object().allow(null),

  title: Joi.string().trim().required(),
  description: Joi.string().allow(null),
  isChecked: Joi.boolean().default(false),

  createdBy: Joi.object(),
  startDate: Joi.date(),
  dueDate: Joi.date(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
};
