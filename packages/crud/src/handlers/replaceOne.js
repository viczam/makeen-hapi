import Boom from 'boom';
import { ObjectID as objectId } from 'mongodb';

export default ({
  entityName,
  extractId = (request) => objectId(request.params.id),
  extractQuery = (request) => request.pre.query,
  extractPayload = (request) => request.pre.payload,
}) => async (request, reply) => {
  const id = extractId(request);
  const payload = extractPayload(request);
  const query = extractQuery(request);
  const Entity = request.server.plugins['makeen-storage'].entityManager.get(entityName);

  try {
    const entity = await Entity.findOne({ query });

    if (!entity) {
      return reply(Boom.notFound(`Unable to find entity with id ${id}`));
    }

    const result = await Entity.replaceOne({
      ...entity,
      ...payload,
      _id: objectId(id),
      createdAt: entity.createdAt,
    });

    return reply(result);
  } catch (err) {
    return reply(Boom.wrap(err));
  }
};
