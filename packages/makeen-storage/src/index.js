import Joi from 'joi';
import Inert from 'inert';
import HapiHawk from 'hapi-auth-hawk';
import pkg from '../package.json';
import pluginOptionsSchema from './schemas/pluginOptions';
import FileService from './services/File';
import FileRepositoryService from './services/FileRepository';
import FileRouter from './routers/File';

export async function register(server, options, next) {
  try {
    const pluginOptions = Joi.attempt(options, pluginOptionsSchema);
    const { uploadDir, bewitCredentials } = pluginOptions;
    const serviceBus = server.methods.createServiceBus('storage');

    await server.register([Inert, HapiHawk]);

    server.auth.strategy('bewit', 'bewit', {
      getCredentialsFunc: (id, cb) => {
        cb(null, {
          ...bewitCredentials,
          id,
        });
      },
    });

    const File = serviceBus.register(
      new FileService({
        uploadDir,
      }),
    );

    const FileRepository = serviceBus.register(
      new FileRepositoryService({
        store: server.methods.createStore({ collectionName: 'File' }),
      }),
    );

    server.expose('File', File);

    server.bind({
      File,
      FileRepository,
    });

    new FileRouter({
      bewitCredentials,
      File,
      FileRepository,
    }).mount(server);

    next();
  } catch (error) {
    next(error);
  }
}

register.attributes = {
  pkg,
  dependencies: ['makeen-core'],
};
