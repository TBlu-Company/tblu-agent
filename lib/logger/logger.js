'use strict';
const fs = require('fs');
let logger = undefined;

const simpleLog = {
  log(log1, log2, log3) {
    console.log(log1, log2, log3 || '');
  }
};

const creatLogger = (level, log, object) => {
  let localBasedir = global.properties.getAppDir();
  if (!fs.existsSync(localBasedir + '/log')) {
    logger = simpleLog
  } else {
    try {
      const winston = require('winston');
      let logLevel = global.properties.getLoggerLevel();
      let transports = [
        new(winston.transports.File)({
          name: 'info-file',
          filename: localBasedir + '/log/filelog-info.log',
          level: 'info'
        }),
        new(winston.transports.File)({
          name: 'error-file',
          filename: localBasedir + '/log/filelog-error.log',
          level: 'error'
        })
      ];
      if (global.properties.getLoggerLevel() == 'debug') {
        transports.push(
          new(winston.transports.File)({
            name: 'debug-file',
            filename: localBasedir + '/log/filelog-debug.log',
            level: 'debug'
          })
        );
      };
      logger = new winston.Logger({
        level: logLevel,
        transports: transports,
      });
      logger.debug(__filename, "creatLogger", "winston logLevel:", logLevel);
    } catch (e) {
      logger = simpleLog
    }
  };
  logger.log(level, log, object);
};

const sendLog = (level, log, object) => {
  if (typeof logger == 'undefined') {
    creatLogger(level, log, object);
  } else {
    logger.log(level, log, object);
  }
};

const formatMessage = (level, path, method, text, object) => {
  sendLog(level, "[" + path + "] [" + method + "] " + text, object);
};

const debug = (path, method, text, object) => {
  if (global.properties.getLoggerLevel() == 'debug') {
    formatMessage('debug', path, method, text, object);
  };
}

const info = (path, method, text, object) => {
  formatMessage('info', path, method, text, object);
}

const error = (path, method, text, object) => {
  // TODO: Melhorar a formatação do objeto Error
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
  formatMessage('error', path, method, text, object);
}

const myLog = {
  debug,
  info,
  error,
};

module.exports = myLog;
