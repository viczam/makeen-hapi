import Boom from 'boom';

export default ({
  entityName,
  entityNs = 'entity',
  extractQuery = (request) => request.pre.query,
}) => async (request, reply) => {
  const { dispatch } = request.eventDispatcher;
  const query = extractQuery(request);

  try {
    const count = await dispatch(`${entityNs}.${entityName}.count`, { query });

    reply(count);
  } catch (err) {
    reply(Boom.wrap(err));
  }
};
