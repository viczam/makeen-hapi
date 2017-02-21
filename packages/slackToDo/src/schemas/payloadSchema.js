import Joi from 'joi';

export default {
  token: Joi.string().required(),
  team_id: Joi.string().required(),
  team_domain: Joi.string().required(),
  channel_id: Joi.string().required(),
  channel_name: Joi.string().required(),
  user_id: Joi.string().required(),
  user_name: Joi.string().required(),
  command: Joi.string().required(),
  text: Joi.string().required(),
  response_url: Joi.string().required(),
};
