import * as handlers from './handlers';
import schema from '../../schemas/item';

export default ({
  entityManager,
}) => {
  entityManager.register('TodoItem', {
    schema,
    handlers,
  });
};
