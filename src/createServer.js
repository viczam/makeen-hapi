import Glue from 'glue';
import path from 'path';
import DotEnv from 'dotenv';

DotEnv.config();

export default (store) => {
  const manifest = store.get('/', {
    env: process.env.NODE_ENV,
  });

  const options = {
    relativeTo: path.join(__dirname, '..', 'packages'),
  };
  console.log(JSON.stringify(manifest, null, 2));

  Glue.compose(manifest, options, (err, server) => {
    if (err) {
      return console.log(err); // eslint-disable-line
    }

    return server.start((startErr) => {
      if (startErr) {
        return console.log(startErr); // eslint-disable-line
      }

      console.log(`plugins:\n ${Object.keys(server.plugins).join(', ')}`);

      if (Array.isArray(server.connections)) {
        server.connections.forEach((connection) => {
          server.log(['server', 'info'], `Server started at: ${connection.info.uri}`);
          console.log(connection.info);
        });
      } else {
        server.log(['server', 'info'], `Server started at: ${server.info.uri}`, server.info);
      }
    });
  });
};
