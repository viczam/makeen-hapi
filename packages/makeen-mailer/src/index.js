import { Plugin } from 'makeen-core';
import Inert from 'inert';
import Vision from 'vision';
import schema from './schemas/pluginOptions';
import browseEmailsRoute from './routes/browseEmails';
import MailService from './services/Mail';

class Mailer extends Plugin {
  constructor() {
    super({
      schema,
      plugins: [Inert, Vision],
    });

    this.register.attributes.pkg.name = 'makeen-mailer';
  }

  async boot(server, options) {
    const { saveToDisk, emailsDir, views } = options;

    server.views(views);

    const Mail = this.serviceBus.register(
      new MailService({
        ...options,
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

    server.expose('Mail', Mail);

    if (saveToDisk) {
      server.route(browseEmailsRoute(emailsDir));
    }

    this.serviceBus.subscribe('user.User.didSignUp', ({ message }) => {
      const { user, account } = message.data;

      Mail.send({
        to: user.email,
        subject: 'welcome',
        template: 'UserSignup',
        context: {
          user,
          account,
        },
      });
    });
  }
}

export const { register } = new Mailer();
