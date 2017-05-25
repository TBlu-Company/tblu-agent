'use strict'
const installAll = require('./npm-installAll')
const npm = require("npm-programmatic");
const logger = require('../logger/logger.js');

const install = (pacote) => new Promise((resolve, reject) => {
  logger.debug(__filename, "installNPM", "Init");
  try {
    let test = require.resolve(pacote);
    logger.debug(__filename, "installNPM", "module exist:", pacote);
    resolve(true);
  } catch (e) {
    npm.install(pacote, {
      cwd: global.properties.getAppDir(),
      env: process.env,
      global: false,
      save: true,
      output: false
    }).then(function() {
      logger.debug(__filename, "installNPM", "module installed:", pacote);
      resolve(true)
    }).catch((err) => {
      logger.error(__filename, "installNPM", "It was not possible to install the module:", pacote);
      logger.error(__filename, "installNPM", "It was not possible to install the module:", err);
      reject('Erro install : ' + pacote);
    });
  };
});


module.exports = {
  installAll,
  install
};
