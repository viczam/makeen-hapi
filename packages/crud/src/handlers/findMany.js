import Boom from 'boom';
import pick from 'lodash/pick';

export default ({
  entityName,
  extractQueryParams = (request) => (
    pick(request.pre.queryParams, ['query', 'skip', 'limit', 'orderBy', 'fields'])
  ),
}) => async (request, reply) => {
  const queryParams = extractQueryParams(request);
  const Entity = request.server.plugins['makeen-storage'].entityManager.get(entityName);

  try {
    reply(
      await Entity.findMany(queryParams).then((c) => c.toArray()),
    );
  } catch (err) {
    reply(Boom.wrap(err));
  }
};
