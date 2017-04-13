import { transformFileSync } from 'babel-core';
import path from 'path';
import fsp from 'fs-promise';
import { argv } from 'yargs';
import { getPackageDirs, getPackageFiles, makeConfig } from '../libs/utils';

const run = async (
  {
    packagesDir,
    babelConfig,
    ignoredPackages,
    srcDir,
    buildDir,
  },
) => {
  const packages = await getPackageDirs({ packagesDir, ignoredPackages });

  return Promise.all(
    packages.map(async pkg => {
      const pkgSrcDir = path.resolve(pkg, srcDir);
      const pkgBuildDir = path.resolve(pkg, buildDir);
      const files = getPackageFiles({ pkg, srcDir });

      await fsp.ensureDir(pkgBuildDir);
      await fsp.emptyDir(pkgBuildDir);

      return Promise.all(
        files.map(file => {
          const relativeToSrcPath = path.relative(pkgSrcDir, file);
          const destPath = path.resolve(pkgBuildDir, relativeToSrcPath);
          const transformed = transformFileSync(file, babelConfig).code;
          return fsp.outputFile(destPath, transformed);
        }),
      );
    }),
  );
};

run(makeConfig(argv));
