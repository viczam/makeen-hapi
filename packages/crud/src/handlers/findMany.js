import Boom from 'boom';
import pick from 'lodash/pick';

export default ({
  entityName,
  entityNs = 'entity',
  extractQueryParams = (request) => (
    pick(request.pre.queryParams, ['query', 'skip', 'limit', 'orderBy', 'fields'])
  ),
}) => async (request, reply) => {
  const { dispatch } = request.eventDispatcher;
  const queryParams = extractQueryParams(request);

  try {
    const result = await dispatch(`${entityNs}.${entityName}.findMany`, queryParams)
      .then((c) => c.toArray());

    reply(result);
  } catch (err) {
    reply(Boom.wrap(err));
  }
};
