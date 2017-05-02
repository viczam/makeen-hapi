import Glue from 'glue';
import path from 'path';
import override from 'environment-override';

export default async store => {
  const manifest = store.get('/', {
    env: process.env.NODE_ENV,
    isDockerized: process.env.IS_DOCKERIZED,
  });

  const options = {
    relativeTo: path.resolve('./packages'),
  };

  const prefix = 'MAKEEN_ENV_';

  override(manifest, prefix);

  const server = await Glue.compose(manifest, options);

  await server.start();

  if (Array.isArray(server.connections)) {
    server.connections.forEach(connection => {
      server.log(
        ['server', 'info'],
        `Server started at: ${connection.info.uri}`,
      );
    });
  } else {
    server.log(['server', 'info'], `Server started at: ${server.info.uri}`);
  }

  return server;
};
