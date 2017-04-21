import Joi from 'joi';
import pkg from '../package.json';
import optionSchema from './schemas/optionSchema';
import AwsEntity from './services/aws';
import AzureEntity from './services/azure';
import AwsRouter from './routes/aws';
import AzureRouter from './routes/azure';

export async function register(server, options, next) {
  try {
    Joi.attempt(options, optionSchema);

    const { awsCredentials, azureCredentials, auth } = options;

    const serviceBus = server.methods.createServiceBus('vm');
    const { messageBus } = server.plugins['makeen-core'];

    messageBus.options.replyTimeout = 20000;

    const AwsService = serviceBus.register(new AwsEntity(awsCredentials));

    const AzureService = serviceBus.register(new AzureEntity());
    await AzureService.init(azureCredentials);

    new AwsRouter(AwsService, auth).mount(server);
    new AzureRouter(AzureService, auth).mount(server);

    next();
  } catch (err) {
    next(err);
  }
}

register.attributes = {
  pkg,
  dependencies: ['makeen-core'],
};
