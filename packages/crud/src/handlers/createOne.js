import Boom from 'boom';

export default ({
  entityName,
  extractPayload = (request) => request.pre.payload,
}) => async (request, reply) => {
  const payload = extractPayload(request);
  const Entity = request.server.plugins['makeen-storage'].entityManager.get(entityName);

  try {
    reply(await Entity.createOne(payload));
  } catch (err) {
    reply(Boom.wrap(err));
  }
};
