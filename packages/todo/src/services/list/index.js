import * as handlers from './handlers';
import schema from '../../schemas/list';

export default ({
  createEntity,
}) => {
  createEntity({
    entityName: 'TodoList',
    schema,
    handlers,
  });
};
