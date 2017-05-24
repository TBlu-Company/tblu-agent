'use strict'
const mkdirp = require('mkdirp');
const logger = require('../logger/logger');

const createDir = (dirname) => new Promise((resolve, reject) => {
  mkdirp(dirname, function(err) {
    logger.debug(__filename, "createDir", "CreatDir: " + dirname);
    if (err) {
      logger.error(__filename, "createDir", "CreatDir: " + dirname, err);
      reject(err);
    } else {
      resolve()
    }
  });
});

// Cria list de diretorios
const mkdirApp = () => new Promise((resolve, reject) => {
  Promise.all([
    createDir(global.properties.getAppDir() + '/data'),
    createDir(global.properties.getAppDir() + '/log')
  ]).then(result => resolve(result)).catch(error => reject(error));
});

module.exports = {
  mkdirApp
};
