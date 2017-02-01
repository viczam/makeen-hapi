import Boom from 'boom';

export default ({
  entityName,
  entityNs = 'entity',
  extractQuery = (request) => request.pre.query,
}) => async (request, reply) => {
  const { dispatch } = request.eventDispatcher;
  const query = extractQuery(request);

  try {
    const result = await dispatch(`${entityNs}.${entityName}.deleteOne`, { query });

    reply(result);
  } catch (err) {
    reply(Boom.wrap(err));
  }
};
