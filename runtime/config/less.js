const helpers = require('./helpers');
const path = require('path');

const modules = [
  {
    name: 'bootstrap'
  }, {
    name: 'font-awesome',
    module: 'font-awesome',
    path: 'font-awesome',
    sass: 'less'
  }, {
    name: 'patternfly',
    module: 'patternfly'
  }
];

modules.forEach(val => {
  val.module = val.module || val.name + '-less';
  val.path = val.path || path.join(val.module, 'assets');
  val.modulePath = val.modulePath || path.join('node_modules', val.path);
  val.sass = val.sass || path.join('stylesheets');
  val.sassPath = path.join(helpers.root(), val.modulePath, val.sass);
});

exports.modules = modules;
