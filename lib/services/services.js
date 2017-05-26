'use strict'
const npm = require('../npm/npm')

const npmNodeServiceInstall = (service, customOption) => new Promise((resolve, reject) => {
  let svc = new service(customOption);
  svc.on('install', function() {
    resolve('install');
  });
  svc.on('alreadyinstalled', function() {
    resolve('install');
  });
  svc.install();
})

const npmNodeServiceConfig = () => new Promise((resolve, reject) => {
  let customOption = {};
  if (os.platform() == 'linux') {
    customOption = {
      user: global.properties.getUserName(),
      group: global.properties.getUserName(),
      env: [{
        name: "HOME",
        value: global.properties.getAppDir(),
      }, {
        name: "LANG",
        value: 'en_US.UTF-8'
      }, {
        name: "LANGUAGE",
        value: 'en'
      }, {
        name: "LC_ALL",
        value: 'C'
      }]
    };
    if (typeof global.properties.getOracleHome() != 'undefined') {
      customOption.env.push({
        name: "ORACLE_HOME",
        value: global.properties.getOracleHome()
      });
    };
    if (typeof global.properties.getLDLibraryPath() != 'undefined') {
      customOption.env.push({
        name: "LD_LIBRARY_PATH",
        value: global.properties.getLDLibraryPath()
      });
    };
    resolve(customOption);
  } else if (os.platform() == 'win32') {

    resolve(customOption);
  } else {
    reject(new Error('Invalid SO'))
  }
});
const npmNodeService = () => new Promise((resolve, reject) => {
  if (os.platform() == 'linux') {
    npm.install('node-linux').then(result => {
      resolve(require('node-linux').Service);
    }).catch(err => reject(err));
  } else if (os.platform() == 'win32') {
    npm.install('node-windows').then(result => {
      resolve(require('node-windows').Service);
    }).catch(err => reject(err));
  } else {
    reject(new Error('Invalid SO'))
  }
});

const install = () => new Promise((resolve, reject) => {
  npmNodeService().then(result => {
    service = result;
    npmNodeServiceConfig.then(result => {

    }).catch(err => reject(err));
  }).catch(err => reject(err));
});
module.exports = {
  install
};
