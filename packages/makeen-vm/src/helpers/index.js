const getEnv = subEnvName => {
  const envName = Object.keys(process.env).find(
    env => env.indexOf(subEnvName) > -1,
  );
  if (!envName) {
    return '';
  }

  return process.env[envName];
};

export const loadPluginOptions = () => ({
  auth: false,
  awsCredentials: {
    apiVersion: getEnv('AWSCREDENTIALS_APIVERSION'),
    region: getEnv('AWSCREDENTIALS_REGION'),
    accessKeyId: getEnv('AWSCREDENTIALS_ACCESSKEYID'),
    secretAccessKey: getEnv('AWSCREDENTIALS_SECRETACCESSKEY'),
  },
  azureCredentials: {
    key: getEnv('AZURECREDENTIALS_KEY'),
    appId: getEnv('AZURECREDENTIALS_APPID'),
    tenantId: getEnv('AZURECREDENTIALS_TENANTID'),
    subscriptionId: getEnv('AZURECREDENTIALS_SUBSCRIPTIONID'),
    user: getEnv('AZURECREDENTIALS_USER'),
    password: getEnv('AZURECREDENTIALS_PASSWORD'),
  },
});
