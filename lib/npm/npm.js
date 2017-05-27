'use strict'
const installAll = require('./npm-installAll')
const logger = require('../logger/logger.js');

const exec = require('child_process').exec;

const install = (pacote) => new Promise((resolve, reject) => {
  try {
    let test = require.resolve(pacote);
    logger.debug(__filename, "install", "module exist:", pacote);
    resolve(true);
  } catch (e) {
    logger.debug(__filename, "install", "module module:", pacote);
    let cmdString = "npm install " + pacote + " --save "
    exec(cmdString, {
      cwd: global.properties.getAppDir(),
      env: process.env,
    }, (error) => {
      if (error) {
        logger.error(__filename, "install", "Fail", error);
        reject(error)
      } else {
        logger.debug(__filename, "install", "Success");
        resolve();
      }
    });
  };
});


module.exports = {
  installAll,
  install
};
