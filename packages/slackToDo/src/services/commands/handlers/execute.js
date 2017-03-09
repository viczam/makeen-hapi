import Joi from 'joi';
import moment from 'moment';
import { last } from 'lodash';
import commandSchema from '../../../schemas/commandSchema';

const executeSchema = Joi.object().keys({
  commands: Joi.array().items(commandSchema),
  slackTeamId: Joi.string().required(),
  userId: Joi.string().required(),
});


const getHelpInstructions = () => [
  'Hello, this is the /todo app and this is how I can be used: ',
  '>list all tasks: `/todo list`',
  '>create task: `/todo create Build hapijs based microservices`',
  '>toggle check/uncheck task: /todo check TK123456',
  '>assign task: `/todo assign TK123456 to @danmo`',
  '>set due date for task: `/todo due TK123456 February 23`',
  '>remove task: `/todo remove TK123456`',
  '> multiple actions on task: `/todo create Build hapijs based app assign to @danmo due February 24 check`',
].join('\n');

const stringifyTaskDetails = (task, index) => {
  const { assignedTo, dueDate, isCompleted } = task;
  let taskDetails = `Id: TK${task.friendlyId} | Description: "${task.name}"`;

  if (!isNaN(index)) {
    taskDetails = `${index + 1}) ${taskDetails}`;
  }

  taskDetails = `${taskDetails} ${assignedTo ? `| Assigned To @${assignedTo}` : ''}`;

  taskDetails = `${taskDetails} ${dueDate ? `| Due at ${moment(dueDate).format('ll')}` : ''}`;

  taskDetails = `${taskDetails} ${isCompleted ? '| <<Completed>>' : ''}`;

  return taskDetails;
};

const stringifyCommandResult = ({ command, result }) => {
  switch (command.name) {
    case 'help':
      return getHelpInstructions();
    case 'list':
      return result.map(stringifyTaskDetails).join('\t\n');
    case 'create':
      return `Created new task: ${stringifyTaskDetails(result)}`;
    case 'check':
    case 'due':
    case 'assign':
      return `Updated task: ${stringifyTaskDetails(result)}`;
    case 'remove':
      return `executed "${command.name.toUpperCase()}" command; result: ${JSON.stringify(result)}`;
    default:
      return `Unknown command ${JSON.stringify(command)}, try using "/todo help"`;
  }
};

export default async ({ params, dispatch }) => {
  const { commands, slackTeamId } = params;

  const { error } = Joi.validate(params, executeSchema);
  if (error) {
    throw error;
  }

  try {
    //
    const commandResults = [];

    // execute each command and collect it's result
    for (let index = 0; index < commands.length; index += 1) {
      const { command, assets } = commands[index];
      const { taskId } = assets;
      const previousCommandTaskId = last(commandResults) ?
        last(commandResults).result.friendlyId : null;

      // execute command
      const result = await dispatch(`entity.SlackToDoTask.${command}`, {
        ...assets,
        // if command has not taskId try to grab it from previous command if any
        taskId: taskId || previousCommandTaskId,
        slackTeamId,
      });

      // collect result
      commandResults.push({
        command: { name: command, assets },
        result,
      });
    }


    return commandResults
      .map(stringifyCommandResult)
      .join('\n') || 'Unknown command, try using "/todo help" first';
  } catch (e) {
    return `Something went teribly wrong: ${e.toString()}`;
  }
};

