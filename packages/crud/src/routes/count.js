import { toBSON } from 'makeen-core/src/libs/mongo-helpers';
import Joi from 'joi';
import handler from '../handlers/count';

export default ({ entityName, path, config = {} }) => ({
  path,
  method: 'GET',
  handler: handler({ entityName }),
  config: {
    id: `${entityName}:count`,
    validate: {
      query: {
        query: Joi.object().default({}),
      },
    },
    description: `Count entities of type ${entityName}`,
    tags: ['api'],
    pre: [
      {
        method: (request, reply) => reply(toBSON(request.query.query)),
        assign: 'query',
      },
    ],
    ...config,
  },
});
