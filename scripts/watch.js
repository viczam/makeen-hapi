import chokidar from 'chokidar';
import path from 'path';
import { buildFile } from '../src/utils';

const watch = async () => {
  const watcher = chokidar.watch([
    path.resolve(__dirname, '../packages/*/src/**/*.js'),
    path.resolve(__dirname, '../packages/package.json'),
  ]);

  watcher.on('add', buildFile);
};

watch();
