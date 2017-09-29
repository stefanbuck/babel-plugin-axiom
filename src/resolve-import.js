import path from 'path';
import fs from 'fs';
import Module from 'module';
import { parse } from 'babylon';

const _axiomPath = path.dirname(
  Module._resolveFilename('bw-axiom', Object.assign({}, new Module, {
    'paths': Module._nodeModulePaths(process.cwd()),
  }))
);

const axiomPath = _axiomPath.slice(0, _axiomPath.lastIndexOf('bw-axiom') + 'bw-axiom'.length);
const indexFile = fs.readFileSync(`${axiomPath}/src/index.js`, 'utf8');
const exportsList = parse(indexFile, { sourceType: 'module' })
  .program
  .body
  .reduce((exprts, exprt) => Object.assign({}, exprts,
    exprt.specifiers.reduce((specs, spec) => Object.assign({}, specs, {
      [spec.exported.name]: path.join('bw-axiom/lib', exprt.source.value),
    }), {}),
  ), {});

export default (name) => {
  if (exportsList[name]) {
    return exportsList[name];
  }

  throw new Error(`Axiom export: ${name} was not found.`);
};
