import Joi from 'joi';
import * as constants from '../constants/account';

export default {
  _id: Joi.object(),

  name: Joi.string(),
  labels: Joi.array()
    .items(Joi.string().valid(constants.labels))
    .default(constants.defaultLabels),

  deletedAt: Joi.date(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
};
