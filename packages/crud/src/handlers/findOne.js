import Boom from 'boom';

export default ({
  entityName,
  entityNs = 'entity',
  extractQuery = (request) => request.pre.query,
}) => async (request, reply) => {
  const { dispatch } = request.eventDispatcher;
  const query = extractQuery(request);

  try {
    const entity = await dispatch(`${entityNs}.${entityName}.findOne`, { query });

    if (!entity) {
      return reply(Boom.notFound('Unable to find entity.'));
    }

    return reply(entity);
  } catch (err) {
    return Boom.wrap(err);
  }
};
