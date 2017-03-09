import Joi from 'joi';

export default {
  name: Joi.string().required().description('Todo list name'),
  friendlyId: Joi.string().required().description('Uniq visual friendly id used to easily identify list (we can\'t rely on the same)'),
  slackTeamId: Joi.string().description('slack team id to which the list belongs to'),

  createdBy: Joi.string().description('slack user id that created the list'),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
};

