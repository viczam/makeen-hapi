import Joi from 'joi';
import StatusMonitor from 'hapijs-status-monitor';
import Vision from 'vision';
import Inert from 'inert';
import Tv from 'tv';
import Raven from 'raven';
import has from 'lodash/has';
import pkg from '../package.json';
import pluginOptionsSchema from './schemas/pluginOptions';

export function register(server, options, next) {
  const pluginOptions = Joi.attempt(options, pluginOptionsSchema);

  if (has(pluginOptions, 'sentry.dsn')) {
    Raven.config(pluginOptions.sentry.dsn).install();
    server.expose('raven', Raven);

    server.on('request-error', (request, err) => {
      const baseUrl = request.info.uri ||
        (request.info.host ? `${server.info.protocol}://${request.info.host}` : server.info.uri);

      Raven.captureException(err, {
        request: {
          method: request.method,
          query_string: request.query,
          headers: request.headers,
          cookies: request.state,
          url: baseUrl + request.path,
        },
        extra: {
          timestamp: request.info.received,
          id: request.id,
          remoteAddress: request.info.remoteAddress,
        },
        tags: options.tags,
      });
    });
  }

  server.register([
    Vision,
    Inert,
    Tv,
    {
      register: StatusMonitor,
      options: {
        path: '/status-monitor',
      },
    },
  ], next);
}

register.attributes = {
  pkg,
  dependencies: [],
};
