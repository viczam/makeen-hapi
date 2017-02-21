import Joi from 'joi';

export default {
  name: Joi.string().trim().required().description('task name, describes what needs to be done'),
  friendlyId: Joi.string().required().description('Uniq visual friendly id used to identify list (we can\'t rely on the same)'),
  slackTeamId: Joi.string().description('slack team id to which the task belongs to'),
  assignedTo: Joi.string().allow(null).description('slack user id to which the task is asigned to'),
  isCompleted: Joi.boolean().default(false).description('true if task is completed, false otherwise'),
  startDate: Joi.date().description('start date of the task'),
  dueDate: Joi.date().description('due date of the task').allow(null),
  createdBy: Joi.object(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
};
