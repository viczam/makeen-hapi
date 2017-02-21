import todoCommand from './handlers/todoCommand';
import validateSlackToken from './handlers/validateSlackToken';
import payloadSchema from './../schemas/payloadSchema';

const pathPrefix = '/slack';
const baseConfig = {
  pre: [validateSlackToken],
  tags: ['api'],
};

export default [
  {
    path: `${pathPrefix}/todo`,
    method: 'POST',
    handler: todoCommand,
    config: {
      ...baseConfig,
      validate: {
        payload: payloadSchema,
      },
      auth: false,
      description: 'slack todo command endpoint',
    },
  },
];
