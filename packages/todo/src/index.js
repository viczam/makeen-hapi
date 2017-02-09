import pkg from '../package.json';
import setupServices from './services/index';
import routes from './routes';

export function register(server, options, next) {
  const dispatcher = server.plugins['hapi-octobus'].eventDispatcher;
  const { dispatch, lookup } = dispatcher;
  const { createEntity } = server.plugins['makeen-core'];

  setupServices({
    dispatcher,
    createEntity,
  });

  const TodoItemEntity = lookup('entity.TodoItem');
  const TodoListEntity = lookup('entity.TodoList');

  server.expose('TodoItemEntity', TodoItemEntity);
  server.expose('TodoListEntity', TodoListEntity);

  server.bind({
    dispatch,
    lookup,
    TodoItemEntity,
    TodoListEntity,
  });

  server.route(routes);

  return next();
}

register.attributes = {
  pkg,
  dependencies: ['makeen-storage', 'makeen-crud', 'makeen-core'],
};
