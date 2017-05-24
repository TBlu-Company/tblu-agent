'use strict'
const path = require('path');
global.properties = require('./lib/global/properties');
global.properties.setAppDir(path.dirname(__filename));
const npmInstallAll = require('./lib/npm/npm-installAll')

const start = () => {
  npmInstallAll().then(() => {
    const help = require('./lib/helper/help');
    if (process.argv.length < 3) {
      appStart();
    } else {
      switch (process.argv[2]) {
        case 'start':
          // Deve ficar dentro do switch para não carregar 2 listen
          const appStart = require('./lib/orchestration/start');
          appStart();
          break;
        case 'configure':
          // Deve ficar dentro do switch para não carregar 2 listen
          const appConfigure = require('./lib/orchestration/configure');
          appConfigure();
          break;
        case 'service':
          // Deve ficar dentro do switch para não carregar 2 listen
          const appService = require('./lib/orchestration/service');
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
