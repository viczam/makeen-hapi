import Boom from 'boom';

export default ({
  entityName,
  entityNs = 'entity',
  extractPayload = (request) => request.pre.payload,
}) => async (request, reply) => {
  const { dispatch } = request.eventDispatcher;
  const payload = extractPayload(request);

  try {
    const result = await dispatch(`${entityNs}.${entityName}.createOne`, payload);

    reply(result);
  } catch (err) {
    reply(Boom.wrap(err));
  }
};
