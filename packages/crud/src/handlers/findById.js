import Boom from 'boom';
import { ObjectID as objectId } from 'mongodb';

export default ({
  entityName,
  entityNs = 'entity',
  extractId = (request) => objectId(request.params.id),
  extractQuery = (request) => request.pre.query,
}) => async (request, reply) => {
  const { dispatch } = request.eventDispatcher;
  const query = extractQuery(request);
  const id = extractId(request);

  try {
    const entity = await dispatch(`${entityNs}.${entityName}.findOne`, { query });

    if (!entity) {
      return reply(Boom.notFound(`Unable to find ${entityName} with id ${id}`));
    }

    return reply(entity);
  } catch (err) {
    return reply(Boom.wrap(err));
  }
};
