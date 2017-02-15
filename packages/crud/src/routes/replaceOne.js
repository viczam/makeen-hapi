import Joi from 'joi';
import { ObjectID as objectId } from 'mongodb';
import { toBSON } from 'makeen-core/src/libs/mongo-helpers';
import { objectIdPattern } from 'makeen-core/src/constants';
import handler from '../handlers/replaceOne';

export default ({ entityName, path, schema, config = {} }) => ({
  path,
  method: 'PUT',
  handler: handler({ entityName }),
  config: {
    id: `${entityName}:replaceOne`,
    validate: {
      params: {
        id: Joi.string().regex(objectIdPattern).required(),
      },
      payload: schema,
    },
    description: `Replace an entity of type ${entityName}`,
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
