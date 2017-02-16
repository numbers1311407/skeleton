// Can import/require from node_modules, and with a little work do the same
// from bower (using the bowerify transform possibly in combination with
// browserify shims)
import _ from 'underscore';
console.log('Underscore loaded from node_modules', _);

// Because of babel+babelify we can use ES6 import/export regardless of browser
// (it's compiled to be cross browser)
import importedMod from './es6-module';
importedMod.test('loaded using import');

// ... and interchangeably use the node CJS style of `require`/`module.exports` 
// modules with ES6 import/export
let requiredES6Mod = require('./es6-module');
import importedCJSMod from'./commonjs-module';
importedCJSMod.test('loaded using import');
requiredES6Mod.default.test('loaded using require');
