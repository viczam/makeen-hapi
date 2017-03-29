import * as MakeenMailer from 'makeen-mailer';
import path from 'path';
import pkg from '../package.json';

export async function register(server, options, next) {
  try {
    const { messageBus } = server.plugins['hapi-octobus'];
    await server.register([{
      register: MakeenMailer.register,
      options: {
        ...options,
        messageBus,
        emailsDir: path.join(__dirname, '..', 'emails'),
        views: {
          relativeTo: __dirname,
        },
      },
      routes: {
        prefix: '/emails',
      },
    }]);

    next();
  } catch (error) {
    next(error);
  }
}

register.attributes = {
  pkg,
  dependencies: [],
};
