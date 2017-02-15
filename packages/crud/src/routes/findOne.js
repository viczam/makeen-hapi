import { toBSON } from 'makeen-core/src/libs/mongo-helpers';
import Joi from 'joi';
import handler from '../handlers/findOne';

export default ({ entityName, path, config = {} }) => ({
  path,
  method: 'GET',
  handler: handler({ entityName }),
  config: {
    id: `${entityName}:findOne`,
    validate: {
      query: {
        query: Joi.object().default({}),
      },
    },
    description: `Find one entity of type ${entityName}`,
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
