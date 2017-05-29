'use strict'
const npm = require('../npm/npm')
const os = require('os');
const _ = require('lodash');
const defaultServiceConfig = require('./config');
const logger = require('../logger/logger');

const npmNodeServiceInstall = (service, customOption) => new Promise((resolve, reject) => {
  let merge = _.merge(defaultServiceConfig, customOption);
  let svc = new service(merge);
  logger.debug(__filename, "npmNodeServiceInstall", "merge", merge);

  svc.on('start', function() {
    resolve('install');
  });

  svc.on('enable', function() {
    svc.start();
  });

  svc.on('install', function() {
    logger.debug(__filename, "npmNodeServiceInstall", "install");
    try {
      svc.enable();
    } catch (e) {
      logger.debug(__filename, "npmNodeServiceInstall", "enable", e);
      svc.start();
    };
  });
  svc.on('alreadyinstalled', function() {
    svc.start();
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
    npm.install('node-service-linux').then(result => {
      resolve(require('node-service-linux').Service);
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
  npmNodeService().then(result1 => {
    npmNodeServiceConfig().then(result2 => {
      npmNodeServiceInstall(result1, result2).then(result => resolve(result)).catch(err => reject(err));
    }).catch(err => reject(err));
  }).catch(err => reject(err));
});
module.exports = {
  install
};
