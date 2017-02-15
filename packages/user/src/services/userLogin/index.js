import schema from '../../schemas/userLogin';
import * as handlers from './handlers';

export default ({
  entityManager,
}) => {
  entityManager.register('UserLogin', {
    schema,
    handlers,
  });
};
