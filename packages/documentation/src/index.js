import Vision from 'vision';
import Inert from 'inert';
import HapiSwagger from 'hapi-swagger';
import Blipp from 'blipp';
import pkg from '../package.json';

export function register(server, options, next) {
  server.register([
    Vision,
    Inert,
    {
      register: HapiSwagger,
      select: ['api'],
      options: {
        jsonEditor: true,
        securityDefinitions: {
          jwt: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
          },
        },
        security: [{ jwt: [] }],
        auth: false,
      },
    },
    Blipp,
  ]).then(next, next);
}

register.attributes = {
  pkg,
  dependencies: [],
};
