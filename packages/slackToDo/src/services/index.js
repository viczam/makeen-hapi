import setupSlackToDoListService from './list';
import setupSlackToDoTaskService from './task';
import setupSlackToDoTeamService from './slackTeam';
import setupSlackToDoUserService from './slackUser';
import setupCommandsService from './commands';

export default (options) => {
  setupSlackToDoListService(options);
  setupSlackToDoTaskService(options);
  setupSlackToDoTeamService(options);
  setupSlackToDoUserService(options);
  setupCommandsService(options);
};
