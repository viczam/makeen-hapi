import Joi from 'joi';
import path from 'path';

export default {
  appDir: Joi.string().default(path.resolve(__dirname, '../../app')),
  isDev: Joi.boolean(),
};
