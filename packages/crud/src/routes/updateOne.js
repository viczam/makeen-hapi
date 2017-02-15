import Joi from 'joi';
import { ObjectID as objectId } from 'mongodb';
import { toBSON } from 'makeen-core/src/libs/mongo-helpers';
import { objectIdPattern } from 'makeen-core/src/constants';
import handler from '../handlers/updateOne';

export default ({ entityName, path, config = {} }) => ({
  path,
  method: 'PATCH',
  handler: handler({ entityName }),
  config: {
    id: `${entityName}:updateOne`,
    validate: {
      params: {
        id: Joi.string().regex(objectIdPattern).required(),
      },
      payload: Joi.object().required(),
    },
    description: `Update an entity of type ${entityName}`,
    tags: ['api'],
    pre: [
      {
        method: (request, reply) => reply({ _id: objectId(request.params.id) }),
        assign: 'query',
      },
      {
        method: (request, reply) => reply(toBSON(request.payload)),
        assign: 'payload',
      },
    ],
    ...config,
  },
});
