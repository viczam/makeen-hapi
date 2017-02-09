import setupTodoItemServices from './item/index';
import setupListServices from './list/index';

export default (options) => {
  setupTodoItemServices(options);
  setupListServices(options);
};
