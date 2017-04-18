import Inert from 'inert';
import Vision from 'vision';
import Joi from 'joi';
import pkg from '../package.json';
import pluginOptionsSchema from './schemas/pluginOptions';
import browseEmailsRoute from './routes/browseEmails';
import Mail from './services/Mail';

export async function register(server, options, next) {
  try {
    const pluginOptions = Joi.attempt(options, pluginOptionsSchema);
    const { saveToDisk, emailsDir, views } = pluginOptions;
    const messageBus = pluginOptions.messageBus ||
      server.plugins['hapi-octobus'].messageBus;
    const serviceBus = server.methods.createServiceBus('mailer');
    serviceBus.connect(messageBus);

    await server.register([Inert, Vision]);

    server.views(views);

    const mail = serviceBus.register(
      'Mail',
      new Mail({
        ...pluginOptions,
        renderTemplate: (template, context, renderOptions) =>
          new Promise((resolve, reject) => {
            server.render(
              template,
              context,
              renderOptions,
              (renderErr, rendered) => {
                if (renderErr) {
                  return reject(renderErr);
                }

                return resolve(rendered);
              },
            );
          }),
      }),
    );

    server.expose('Mail', mail);

    if (saveToDisk) {
      server.route(browseEmailsRoute(emailsDir));
    }

    next();
  } catch (error) {
    next(error);
  }
}

register.attributes = {
  pkg,
  dependencies: [],
};
