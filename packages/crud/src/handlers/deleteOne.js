import Boom from 'boom';

export default ({
  entityName,
  extractQuery = (request) => request.pre.query,
}) => async (request, reply) => {
  const query = extractQuery(request);
  const Entity = request.server.plugins['makeen-storage'].entityManager.get(entityName);

  try {
    reply(await Entity.deleteOne({ query }));
  } catch (err) {
    reply(Boom.wrap(err));
  }
};
