import Boom from 'boom';

export default ({
  entityName,
  extractQuery = (request) => request.pre.query,
}) => async (request, reply) => {
  const query = extractQuery(request);
  const Entity = request.server.plugins['makeen-storage'].entityManager.get(entityName);

  try {
    const entity = await Entity.findOne({ query });

    if (!entity) {
      return reply(Boom.notFound('Unable to find entity.'));
    }

    return reply(entity);
  } catch (err) {
    return Boom.wrap(err);
  }
};
