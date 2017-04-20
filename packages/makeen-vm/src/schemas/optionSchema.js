import Joi from 'joi';

export default {
  auth: Joi.alternatives().try(Joi.boolean(), Joi.string()),
  awsCredentials: {
    apiVersion: Joi.string(),
    region: Joi.string(),
    accessKeyId: Joi.string(),
    secretAccessKey: Joi.string(),
  },
  azureCredentials: {
    key: Joi.string(),
    appId: Joi.string(),
    tenantId: Joi.string(),
    subscriptionId: Joi.string(),
    user: Joi.string(),
    password: Joi.string(),
  },
};
