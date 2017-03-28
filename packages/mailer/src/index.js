import HapiReactViews from 'hapi-react-views';
import Inert from 'inert';
import Vision from 'vision';
import Joi from 'joi';
import pkg from '../package.json';
import pluginOptionsSchema from './schemas/pluginOptions';
import browseEmailsRoute from './routes/browseEmails';
import Mail from './services/Mail';

export function register(server, options, next) {
  const pluginOptions = Joi.attempt(options, pluginOptionsSchema);
  const { saveToDisk, emailsDir } = pluginOptions;
  const { messageBus } = server.plugins['hapi-octobus'];
  const serviceBus = server.methods.createServiceBus('mailer');
  serviceBus.connect(messageBus);

  server.register([
    Inert,
    Vision,
  ]).then(() => {
    server.views({
      engines: {
        jsx: HapiReactViews,
      },
      relativeTo: __dirname,
      path: 'views',
    });

    const mail = serviceBus.register(
      'Mail',
      new Mail({
        ...pluginOptions,
        renderTemplate: (template, context, renderOptions) => (
          new Promise((resolve, reject) => {
            server.render(template, context, renderOptions, (renderErr, rendered) => {
              if (renderErr) {
                return reject(renderErr);
              }

              return resolve(rendered);
            });
          })
        ),
      }),
    );

    server.expose('Mail', mail);

    if (saveToDisk) {
      server.route(browseEmailsRoute(emailsDir));
    }

    return next();
  }, next);
}

register.attributes = {
  pkg,
  dependencies: ['makeen-core'],
};
