import Joi from 'joi';
import HapiReactViews from 'hapi-react-views';

export default {
  transport: Joi.object().default({
    jsonTransport: true,
  }),
  saveToDisk: Joi.boolean().default(false),
  emailsDir: Joi.string().required(),
  messageBus: Joi.object(),
  views: Joi.object().keys({
    engines: Joi.object().default({
      jsx: HapiReactViews,
    }),
    relativeTo: Joi.string().required(),
    path: Joi.string().default('views'),
  }).required(),
};
