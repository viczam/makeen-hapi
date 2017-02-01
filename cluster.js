/* eslint-disable no-console */
import cluster from 'cluster';
import Confidence from 'confidence';
import manifestConfig from './serverManifest.json';
import createServer from './src/createServer';

const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) { // eslint-disable-line
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    console.log(
      `Worker ${worker.process.pid} is online, expecting: ${numCPUs} workers.`,
    );
  });

  // Get a new worker if one dies
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);

    if (code !== 0 && !worker.suicide) {
      console.log('Starting a new worker');
      cluster.fork();
    }
  });
} else if (cluster.isWorker) {
  const store = new Confidence.Store(manifestConfig);
  createServer(store);
}
