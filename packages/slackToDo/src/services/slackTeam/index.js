import * as handlers from './handlers';
import schema from '../../schemas/slackTeam';

export default ({
  entityManager,
}) => {
  entityManager.register('SlackTeam', {
    schema,
    handlers,
  });
};
