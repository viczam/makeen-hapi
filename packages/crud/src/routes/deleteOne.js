import Joi from 'joi';
import { toBSON } from 'makeen-core/src/libs/mongo-helpers';
import handler from '../handlers/deleteOne';

export default ({ entityName, path, config = {} }) => ({
  path,
  method: 'DELETE',
  handler: handler({ entityName }),
  config: {
    id: `${entityName}:deleteOne`,
    validate: {
      payload: {
        query: Joi.object().required(),
      },
    },
    description: `Delete an entity of type ${entityName}`,
    tags: ['api'],
    pre: [
      {
        method: (request, reply) => reply(toBSON(request.payload.query)),
        assign: 'query',
      },
    ],
    ...config,
  },
});
