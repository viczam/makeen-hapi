import Joi from 'joi';
import { ObjectID as objectId } from 'mongodb';
import { objectIdPattern } from 'makeen-core/src/constants';
import handler from '../handlers/deleteOneById';

export default ({ entityName, entityNs, path, config = {} }) => ({
  path,
  method: 'DELETE',
  handler: handler({ entityName, entityNs }),
  config: {
    id: `${entityName}:deleteOneById`,
    validate: {
      params: {
        id: Joi.string().regex(objectIdPattern).required(),
      },
    },
    description: `Delete an entity of type ${entityName} by id`,
    tags: ['api'],
    pre: [
      {
        method: (request, reply) => reply({ _id: objectId(request.params.id) }),
        assign: 'query',
      },
    ],
    ...config,
  },
});
