const { readFileSync } = require('fs');
const { _extensions } = require('module');

_extensions['.graphql'] = (module, path) => (module.exports = readFileSync(path, { encoding: 'utf-8' }));
