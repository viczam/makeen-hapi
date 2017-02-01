import schema from '../../schemas/account';
import * as handlers from './handlers';

export default ({
  createEntity,
}) => {
  createEntity({
    entityName: 'Account',
    schema,
    handlers,
  });
};
