'use strict'
const help = require('./lib/helper/help');
const configure = require('./lib/orchestration/configure');
const service = require('./lib/orchestration/service');
const start = require('./lib/orchestration/start');

function atividade() {
  if (process.argv.length < 3) {
    console.log('start');
  } else {
    switch (process.argv[2]) {
      case 'start':
        start();
        break;
      case 'configure':
        configure();
        break;
      case 'service':
        service();
        break;
      case 'help':
        help();
        break;
      default:
        help();
    };
  };
};

atividade();
