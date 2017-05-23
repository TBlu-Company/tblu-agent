'use strict'
const exec = require('child_process').exec;
const logger = require('../logger/logger');

const installAll = () => new Promise((resolve, reject) => {
  let args = [];
  logger.info(__filename, "installAll", "Start");
  logger.info(__filename, "installAll", "appDir", global.properties.getAppDir());
  exec('npm install', {
    cwd: global.properties.getAppDir(),
  }, (error, stdout, stderr) => {
    if (error) {
      logger.error(__filename, "installAll", "Fail", error);
      reject(error)
    } else {
      logger.debug(__filename, "installAll", "Sucess");
      resolve();
    }
  });
})

module.exports = installAll;
