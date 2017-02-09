import Boom from 'boom';
import { ObjectID as objectId } from 'mongodb';

export default ({
  entityName,
  entityNs = 'entity',
  extractId = (request) => objectId(request.params.id),
  extractQuery = (request) => request.pre.query,
  extractPayload = (request) => request.pre.payload,
}) => async (request, reply) => {
  const { dispatch } = request.eventDispatcher;
  const id = extractId(request);
  const payload = extractPayload(request);
  const query = extractQuery(request);

  try {
    const entity = await dispatch(`${entityNs}.${entityName}.findOne`, { query });

    if (!entity) {
      return reply(Boom.notFound(`Unable to find entity with id ${id}`));
    }

    await dispatch(`entity.${entityName}.validate`, {
      ...entity,
      ...payload,
    });

    const result = await dispatch(`entity.${entityName}.updateOne`, {
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
