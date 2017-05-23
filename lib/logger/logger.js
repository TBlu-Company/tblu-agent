'use strict';
const localBasedir = global.properties.getAppDir();
const fs = require('fs');

const simpleLog = {
  log(log1, log2, log3) {
    console.log(log1, log2, log3 || '');
  }
};
let logger;
if (!fs.existsSync(localBasedir + '/log')) {
  logger = simpleLog
} else {
  try {
    const winston = require('winston');
    logger = new winston.Logger({
      //level: 'info',
      level: 'debug',
      //level: 'error',
      transports: [
        //new(winston.transports.Console)(),
        new(winston.transports.File)({
          name: 'info-file',
          filename: localBasedir + '/log/filelog-info.log',
          level: 'info'
        }),
        new(winston.transports.File)({
          name: 'debug-file',
          filename: localBasedir + '/log/filelog-debug.log',
          level: 'debug'
        }),
        new(winston.transports.File)({
          name: 'error-file',
          filename: localBasedir + '/log/filelog-error.log',
          level: 'error'
        })
      ]
    });
  } catch (e) {
    logger = simpleLog
  }
}


const formatMessage = (level, path, method, text, object) => {
  logger.log(level, "[" + path + "] [" + method + "] " + text, object);
};

const debug = (path, method, text, object) => {
  formatMessage('debug', path, method, text, object);
}

const info = (path, method, text, object) => {
  formatMessage('info', path, method, text, object);
}

const tracer = (path, method, text, object) => {
  formatMessage('debug', path, method, text, object);
}

const error = (path, method, text, object) => {
  // TODO: Melhorar a formatação do objeto Error
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
  formatMessage('error', path, method, text, object);
}

const myLog = {
  debug,
  info,
  tracer,
  error,
};

module.exports = myLog;
