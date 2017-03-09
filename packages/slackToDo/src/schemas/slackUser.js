import Joi from 'joi';

export default {
  name: Joi.string().description('Slack user nane'),
  slackId: Joi.string().description('Slack team id provided by slack api'),
  slackTeamId: Joi.string().description('slack team id to which the list belongs to'),
  meta: Joi.object().description('Entire slack team object data provided by slack'),
};
