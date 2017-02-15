import * as handlers from './handlers';
import schema from '../../schemas/list';

export default ({
  entityManager,
}) => {
  entityManager.register('TodoList', {
    schema,
    handlers,
  });
};
