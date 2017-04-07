import Joi from 'joi';

export default {
  assetsPath: Joi.string().required(),
  viewsDir: Joi.string().required(),
};
