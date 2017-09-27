'use strict'
const installAll = require('./npm-installAll')
const logger = require('../logger/logger.js');

const exec = require('child_process').exec;

const install = (pacote) => new Promise((resolve, reject) => {
  try {
    logger.debug(__filename, "install", "module module:", pacote);
    if (pacote.toLowerCase() == 'internal') {
      logger.debug(__filename, "install", "resolve", true);
      resolve(true);
    } else {
      let test = require.resolve(pacote);
      logger.debug(__filename, "update", "module exist:", pacote);
      let cmdString = "npm update " + pacote + " --save "
      exec(cmdString, {
        cwd: global.properties.getAppDir(),
        env: process.env,
      }, (error) => {
        if (error) {
          logger.error(__filename, "update", "Fail", error);
          reject(error)
        } else {
          logger.debug(__filename, "update", "Success");
          resolve(true);
        }
      });
    }
  } catch (e) {
    logger.debug(__filename, "install", "catch - module module:", pacote);
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
        resolve(true);
      }
    });
  };
});


module.exports = {
  installAll,
  install
};
