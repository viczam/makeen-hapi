import DotEnv from 'dotenv';
import Confidence from 'confidence';
import manifestConfig from './clientManifest.json';
import createServer from './src/createServer';

DotEnv.config();

process.once('uncaughtException', console.log); // eslint-disable-line no-console

const store = new Confidence.Store(manifestConfig);
createServer(store);
