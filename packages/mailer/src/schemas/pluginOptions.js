import Joi from 'joi';
import path from 'path';

export default {
  transport: Joi.object().default({
    jsonTransport: true,
    logger: false,
    debug: false,
  }),
  saveToDisk: Joi.boolean().default(false),
  emailsDir: Joi.string().default(path.joi),
};
