import Joi from 'joi';

export default {
  token: Joi.string().required(),
};
