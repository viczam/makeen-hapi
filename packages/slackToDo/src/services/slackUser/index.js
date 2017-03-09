import * as handlers from './handlers';
import schema from '../../schemas/slackUser';

export default ({
  entityManager,
}) => {
  entityManager.register('SlackUser', {
    schema,
    handlers,
  });
};
