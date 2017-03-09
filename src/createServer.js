import Glue from 'glue';
import path from 'path';
import DotEnv from 'dotenv';
import override from 'environment-override';

DotEnv.config();

export default (store) => {
  const manifest = store.get('/', {
    env: process.env.NODE_ENV,
  });

  const options = {
    relativeTo: path.join(__dirname, '..', 'packages'),
  };

  const prefix = 'MAKEEN_ENV_';

  override(manifest, prefix);

  Glue.compose(manifest, options, (err, server) => {
    if (err) {
      return console.log(err); // eslint-disable-line
    }

    return server.start((startErr) => {
      if (startErr) {
        console.log(startErr); // eslint-disable-line
        return;
      }

      if (Array.isArray(server.connections)) {
        server.connections.forEach((connection) => {
          server.log(['server', 'info'], `Server started at: ${connection.info.uri}`);
        });
      } else {
        server.log(['server', 'info'], `Server started at: ${server.info.uri}`);
      }
    });
  });
};
