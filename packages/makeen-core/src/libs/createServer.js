import Glue from 'glue';
import path from 'path';
import override from 'environment-override';
import Promise from 'bluebird';

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

  const compose = Promise.promisify(Glue.compose, Glue);

  const server = await compose(manifest, options);
  return new Promise((resolve, reject) => {
    server.start(err => {
      if (err) {
        return reject(err);
      }

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

      return resolve(server);
    });
  });
};
