import schema from '../../schemas/userLogin';
import * as handlers from './handlers';

export default ({
  createEntity,
}) => {
  createEntity({
    entityName: 'UserLogin',
    schema,
    handlers,
  });
};
