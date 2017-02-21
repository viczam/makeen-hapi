import Joi from 'joi';
import pkg from '../package.json';
import setupServices from './services';
import routes from './routes';
import optionsSchema from './schemas/optionsSchema';

export function register(server, options, next) {
  const dispatcher = server.plugins['hapi-octobus'].eventDispatcher;
  const { dispatch, lookup } = dispatcher;
  const { entityManager } = server.plugins['makeen-storage'];
  const { token } = Joi.attempt(options, optionsSchema);

  setupServices({
    dispatcher,
    entityManager,
  });

  const SlackTodoTaskEntity = entityManager.get('entity.SlackTodoTask');
  const SlackTodoListEntity = entityManager.get('entity.SlackTodoList');
  const SlackTeamEntity = entityManager.get('entity.SlackTeam');
  const SlackUserEntity = entityManager.get('enitiy.SlackUser');

  server.bind({
    dispatch,
    lookup,
    SlackTodoTaskEntity,
    SlackTodoListEntity,
    SlackTeamEntity,
    SlackUserEntity,
    token,
  });

  server.route(routes);

  return next();
}

register.attributes = {
  pkg,
  dependencies: ['makeen-storage', 'makeen-crud', 'makeen-core'],
};
