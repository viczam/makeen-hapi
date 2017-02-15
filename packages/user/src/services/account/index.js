import schema from '../../schemas/account';
import * as handlers from './handlers';

export default ({
  entityManager,
}) => {
  entityManager.register('Account', {
    schema,
    handlers,
  });
};
