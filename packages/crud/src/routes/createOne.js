import { toBSON } from 'makeen-core/src/libs/mongo-helpers';
import handler from '../handlers/createOne';

export default ({ entityName, path, schema, config = {} }) => ({
  path,
  method: 'POST',
  handler: handler({ entityName }),
  config: {
    id: `${entityName}:createOne`,
    validate: {
      payload: schema,
    },
    description: `Create a new entity of type ${entityName}`,
    tags: ['api'],
    pre: [
      {
        method: (request, reply) => reply(toBSON(request.payload)),
        assign: 'payload',
      },
    ],
    ...config,
  },
});
