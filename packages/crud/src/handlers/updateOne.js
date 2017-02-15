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

    await Entity.validate({
      ...entity,
      ...payload,
    });

    const result = await Entity.updateOne({
      query: {
        _id: objectId(id),
      },
      update: {
        $set: payload,
      },
    });

    return reply(result);
  } catch (err) {
    if (err.isJoi) {
      return reply(Boom.badRequest(err.details[0].message));
    }

    return reply(Boom.wrap(err));
  }
};
