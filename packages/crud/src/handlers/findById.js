import Boom from 'boom';
import { ObjectID as objectId } from 'mongodb';

export default ({
  entityName,
  extractId = (request) => objectId(request.params.id),
  extractQuery = (request) => request.pre.query,
}) => async (request, reply) => {
  const query = extractQuery(request);
  const id = extractId(request);
  const Entity = request.server.plugins['makeen-storage'].entityManager.get(entityName);

  try {
    const entity = await Entity.findOne({ query });

    if (!entity) {
      return reply(Boom.notFound(`Unable to find ${entityName} with id ${id}`));
    }

    return reply(entity);
  } catch (err) {
    return reply(Boom.wrap(err));
  }
};
