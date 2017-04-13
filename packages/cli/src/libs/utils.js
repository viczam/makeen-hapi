/* eslint-disable import/no-extraneous-dependencies */
import { transformFileSync } from 'babel-core';
import path from 'path';
import fsp from 'fs-promise';
import fs from 'fs';
import glob from 'glob';
import yargs from 'yargs';

export const getPackageDirs = async ({ packagesDir, ignoredPackages }) =>
  (await fsp.readdir(packagesDir))
    .map(file => path.resolve(packagesDir, file))
    .filter(file => fs.lstatSync(path.resolve(file)).isDirectory())
    .filter(dir => !ignoredPackages.includes(path.basename(dir)));

export const getPackageFiles = ({ pkg, srcDir }) => {
  const pkgSrcDir = path.resolve(pkg, srcDir);
  const pattern = path.resolve(pkgSrcDir, '**/*.js?(x)');
  return glob.sync(pattern, { nodir: true });
};

export const getBuildDestinationPath = (
  { srcPath, packagesDir, srcDir, buildDir },
) => {
  const pkgName = path.relative(packagesDir, srcPath).split(path.sep)[0];
  const pkg = path.resolve(packagesDir, pkgName);
  const pkgSrcDir = path.resolve(pkg, srcDir);
  const pkgBuildDir = path.resolve(pkg, buildDir);
  const relativeToSrcPath = path.relative(pkgSrcDir, srcPath);
  return path.resolve(pkgBuildDir, relativeToSrcPath);
};

export const compileFile = async (
  { file, babelConfig, packagesDir, srcDir, buildDir },
) => {
  const transformed = transformFileSync(file, babelConfig).code;
  return fsp.outputFile(
    getBuildDestinationPath({ srcPath: file, packagesDir, srcDir, buildDir }),
    transformed,
  );
};

export const makeConfig = () => ({
  srcDir: 'src',
  buildDir: 'build',
  packagesDir: path.resolve('./packages'),
  ignoredPackages: [],
  babelConfig: fsp.readJsonSync(path.resolve('./.babelrc')),
  watchGlob: [
    path.resolve('./packages/*/src/**'),
    `!${path.resolve('./packages/web-app/**')}`,
  ],
  ...yargs.array('ignoredPackages').argv,
});
