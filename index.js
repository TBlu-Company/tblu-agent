'use strict'
const path = require('path');
global.properties = require('./lib/global/properties');
global.properties.setAppDir(path.dirname(__filename));
const help = require('./lib/helper/help');
const appConfigure = require('./lib/orchestration/configure');
const appService = require('./lib/orchestration/service');
const appStart = require('./lib/orchestration/start');
const npmInstallAll = require('./lib/npm/npm-installAll')

const start = () => {
  npmInstallAll().then(() => {
    if (process.argv.length < 3) {
      appStart();
    } else {
      switch (process.argv[2]) {
        case 'start':
          appStart();
          break;
        case 'configure':
          appConfigure();
          break;
        case 'service':
          appService();
          break;
        case 'help':
          help();
          break;
        default:
          help();
      };
    };
  });
};

start();
