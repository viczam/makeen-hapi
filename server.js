import Confidence from 'confidence';
import manifestConfig from './serverManifest.json';
import createServer from './src/createServer';

process.once('uncaughtException', console.log); // eslint-disable-line no-console

const store = new Confidence.Store(manifestConfig);
createServer(store);
