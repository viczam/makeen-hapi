import Joi from 'joi';

export default {
  _id: Joi.object(),
  accountId: Joi.object().required(),
  userId: Joi.object().required(),
  filename: Joi.string().required(),
  contentType: Joi.string().required(),
  extension: Joi.string().required(),
  size: Joi.number().required(),
  uploadedAt: Joi.date(),
};
