import path from 'path';
import fs from 'fs';
import Module from 'module';
import { parse } from 'babylon';

const supportedAxiomPackages = [
  '@brandwatch/axiom-automation-testing',
  '@brandwatch/axiom-charts',
  '@brandwatch/axiom-components',
  '@brandwatch/axiom-composites',
  '@brandwatch/axiom-formatting',
  '@brandwatch/axiom-localization',
  '@brandwatch/axiom-materials',
  '@brandwatch/axiom-utils',
];

const pkg = require(path.join(process.cwd(), 'package.json')); // TODO this is not very solid

const usedAxiomPackages = Object.keys(pkg.dependencies)
  .filter(dep => supportedAxiomPackages.includes(dep));

function load(memo, packageName) {
  const _axiomPath = path.dirname(
    Module._resolveFilename(packageName, Object.assign({}, new Module, {
      'paths': Module._nodeModulePaths(process.cwd()),
    }))
  );
  const axiomPath = path.join(_axiomPath, '../src');
  const indexFile = fs.readFileSync(`${axiomPath}/index.js`, 'utf8');

  Object.assign(memo, parse(indexFile, { sourceType: 'module' })
    .program
    .body
    .reduce((exprts, exprt) => Object.assign({}, exprts,
      exprt.specifiers.reduce((specs, spec) => Object.assign({}, specs, {
        [spec.exported.name]: path.join(`${packageName}/dist`, exprt.source.value),
      }), {}),
    ), {}));

  return memo;
}

const exportsList = usedAxiomPackages.reduce(load, {});

export default (name) => {
  if (exportsList[name]) {
    return exportsList[name];
  }

  throw new Error(`Axiom export: ${name} was not found.`);
};
