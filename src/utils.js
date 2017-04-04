import { transformFileSync } from 'babel-core';
import path from 'path';
import fsp from 'fs-promise';
import fs from 'fs';
import glob from 'glob';
import { PACKAGES_DIR, SRC_DIR, BUILD_DIR } from './constants';

export const getBabelConfig = () => (
  fsp.readJson(path.resolve(__dirname, '..', '.babelrc'))
);

export const getPackageDirs = async () => (
  (await fsp.readdir(PACKAGES_DIR))
    .map((file) => path.resolve(PACKAGES_DIR, file))
    .filter((file) => fs.lstatSync(path.resolve(file)).isDirectory())
);

export const getPackageFiles = (pkg) => {
  const srcDir = path.resolve(pkg, SRC_DIR);
  const pattern = path.resolve(srcDir, '**/*.js');
  return glob.sync(pattern, { nodir: true });
};

export const getDestinationPath = (file) => {
  const pkgName = path.relative(PACKAGES_DIR, file).split(path.sep)[0];
  const pkg = path.resolve(PACKAGES_DIR, pkgName);
  const srcDir = path.resolve(pkg, SRC_DIR);
  const buildDir = path.resolve(pkg, BUILD_DIR);
  const relativeToSrcPath = path.relative(srcDir, file);
  return path.resolve(buildDir, relativeToSrcPath);
};

export const compileFile = async (file) => {
  const babelConfig = await getBabelConfig();
  const transformed = transformFileSync(file, babelConfig).code;
  return fsp.outputFile(getDestinationPath(file), transformed);
};
