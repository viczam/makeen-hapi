import * as handlers from './handlers';
import schema from '../../schemas/task';

export default ({
  entityManager,
}) => {
  entityManager.register('SlackToDoTask', {
    schema,
    handlers,
  });
};
