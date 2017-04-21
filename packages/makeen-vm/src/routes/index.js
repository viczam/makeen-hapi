import AwsRoutes from './aws';
import AzureRoutes from './azure';

export default (server, { awsCredentials, azureCredentials, auth }) => {
  if (awsCredentials) {
    const awsRoutes = new AwsRoutes(awsCredentials, auth || false);
    awsRoutes.mount(server);
  }

  if (azureCredentials) {
    const azureRoutes = new AzureRoutes(azureCredentials, auth || false);
    azureRoutes.mount(server);
  }
};
