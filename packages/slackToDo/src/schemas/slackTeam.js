import Joi from 'joi';

export default {
  name: Joi.string().description('Slack Team nane'),
  slackId: Joi.string().description('Slack team id provided by slack api'),
  meta: Joi.object().description('Entire slack team object data provided by slack'),
};
