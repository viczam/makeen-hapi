import Joi from 'joi';

export default {
  command: Joi.string().valid(['create', 'remove', 'check', 'uncheck', 'assign', 'due', 'list', 'help']),
  assets: Joi.object().keys({
    name: Joi.string().allow(null, ''),
    assignedTo: Joi.string().allow(null),
    dueDate: Joi.date().allow(null),
    taskId: Joi.string().allow(null),
  }),
};
