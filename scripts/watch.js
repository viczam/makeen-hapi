import DotEnv from 'dotenv';
import chokidar from 'chokidar';
import path from 'path';
import fs from 'fs';
import fsp from 'fs-promise';
import { compileFile, getDestinationPath } from '../src/utils';

DotEnv.config();

const watch = async () => {
  const watcher = chokidar.watch(
    path.resolve(__dirname, '../packages/*/src/**'),
    {
      ignoreInitial: true,
    },
  );

  watcher.on('add', compileFile);
  watcher.on('change', compileFile);
  watcher.on('unlink', file => fs.unlinkSync(getDestinationPath(file)));
  watcher.on('unlinkDir', dirPath => {
    fsp.remove(getDestinationPath(dirPath));
  });

  return watcher;
};

watch().then(w => w.on('error', console.log.bind(console))); // eslint-disable-line no-console
