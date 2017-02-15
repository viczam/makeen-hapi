import { ObjectID as objectId } from 'mongodb';
import Joi from 'joi';
import { objectIdPattern } from 'makeen-core/src/constants';
import handler from '../handlers/findById';

export default ({ entityName, path, config = {} }) => ({
  path,
  method: 'GET',
  handler: handler({ entityName }),
  config: {
    id: `${entityName}:findById`,
    validate: {
      params: {
        id: Joi.string().regex(objectIdPattern).required(),
      },
    },
    description: `Find an entity of type ${entityName} by id`,
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
