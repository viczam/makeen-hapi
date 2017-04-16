import chokidar from 'chokidar';
import fs from 'fs';
import fsp from 'fs-promise';
import {
  compileFile,
  getBuildDestinationPath,
  makeConfig,
} from '../libs/utils';

const run = async (
  {
    watchGlob,
    packagesDir,
    srcDir,
    buildDir,
    babelConfig,
  },
) => {
  const watcher = chokidar.watch(watchGlob, {
    ignoreInitial: true,
  });

  watcher.on('add', file =>
    compileFile({ file, babelConfig, packagesDir, srcDir, buildDir }));
  watcher.on('change', file =>
    compileFile({ file, babelConfig, packagesDir, srcDir, buildDir }));
  watcher.on('unlink', srcPath =>
    fs.unlinkSync(
      getBuildDestinationPath({ srcPath, packagesDir, srcDir, buildDir }),
    ));
  watcher.on('unlinkDir', srcPath =>
    fsp.remove(
      getBuildDestinationPath({ srcPath, packagesDir, srcDir, buildDir }),
    ));

  return watcher;
};

run(makeConfig());
