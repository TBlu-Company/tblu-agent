'use strict'
const help = require('./lib/helper/help');
const configure = require('./lib/orchestration/configure')

function atividade() {
  if (process.argv.length < 3) {
    console.log('start');
  } else {
    switch (process.argv[2]) {
      case 'start':
        console.log('start');
        break;
      case 'configure':
        configure();
        break;
      case 'service':
        console.log('service');
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
