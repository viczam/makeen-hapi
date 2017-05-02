import Confidence from 'confidence';
import { set, get } from 'lodash';
import doCreateServer from '../../src/libs/createServer';
import serverManifest from './serverManifest.test.json';

global.jasmine.DEFAULT_TIMEOUT_INTERVAL = 500000;

let hapiServer;

export const stopServer = async () => {
  if (!hapiServer) {
    return null;
  }

  return hapiServer.stop();
};

export const createServer = async (options = { loadOnly: [] }) => {
  if (hapiServer) {
    await stopServer();
  }

  const store = new Confidence.Store(serverManifest);

  if (options.loadOnly.length) {
    // filter out banned plugins
    const filteredPlugins = get(store, '_tree.registrations.$base').filter(
      ({ plugin }) => options.loadOnly.indexOf(plugin.register) !== -1,
    );

    set(store, '_tree.registrations.$base', filteredPlugins);
  }

  hapiServer = await doCreateServer(store);

  return hapiServer;
};
