import * as handlers from './handlers';
import schema from '../../schemas/item';

export default ({
  createEntity,
}) => {
  createEntity({
    entityName: 'TodoItem',
    schema,
    handlers,
  });
};
