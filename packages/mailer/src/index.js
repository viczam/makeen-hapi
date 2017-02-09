import HapiReactViews from 'hapi-react-views';
import Inert from 'inert';
import Vision from 'vision';
import nodemailer from 'nodemailer';
import Joi from 'joi';
import pkg from '../package.json';
import setupServices from './services/index';
import pluginOptionsSchema from './schemas/pluginOptions';
import fileTransporter from './fileTransporter';
import browseEmailsRoute from './routes/browseEmails';

export function register(server, options, next) {
  const { isDevelopment } = server.settings.app;
  const pluginOptions = Joi.attempt(options, pluginOptionsSchema);
  const { saveToDisk, emailsDir } = pluginOptions;
  const dispatcher = server.plugins['hapi-octobus'].eventDispatcher;

  const transporter = saveToDisk ? fileTransporter : nodemailer.createTransport({
    ...pluginOptions.transport,
    logger: isDevelopment,
    debug: isDevelopment,
  });

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

    setupServices({
      dispatcher,
      renderTemplate(template, context, renderOptions) {
        return new Promise((resolve, reject) => {
          server.render(template, context, renderOptions, (renderErr, rendered) => {
            if (renderErr) {
              return reject(renderErr);
            }

            return resolve(rendered);
          });
        });
      },
      transporter,
      app: server.settings.app,
      emailsDir,
    });

    if (saveToDisk) {
      server.route(browseEmailsRoute(emailsDir));
    }

    return next();
  }, next);
}

register.attributes = {
  pkg,
  dependencies: ['hapi-octobus'],
};
