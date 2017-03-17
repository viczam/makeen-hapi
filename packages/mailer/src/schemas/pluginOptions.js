import Joi from 'joi';
import path from 'path';

export default {
  transport: Joi.object().default({
    jsonTransport: true,
  }),
  saveToDisk: Joi.boolean().default(false),
  emailsDir: Joi.string().default(path.join(__dirname, '..', '..', 'emails')),
};
