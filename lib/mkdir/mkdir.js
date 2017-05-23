'use strict'
const mkdirp = require('mkdirp');
const logger = require('../logger/logger');

const createDir = (dirname) => {
  return mkdirp(dirname, function(err) {
    logger.debug(__filename, "createDir", "CreatDir: " + dirname);
    if (err) {
      logger.error(__filename, "createDir", "CreatDir: " + dirname, err);
      return Promise.reject(new Error("fail"))
    } else {
      return Promise.resolve(0);
    }
  });
};

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
