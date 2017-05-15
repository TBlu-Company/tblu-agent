'use strict'
const path = require('path');
const filename = path.basename(__filename);
const mkdirp = require('mkdirp');
const logger = require('../logger/logger.js');

const createDir = (dirname) => {
  return mkdirp(dirname, function(err) {
    logger.debug(__filename, "createDir", "CreatDir: " + dirname);
    if (err) {
      logger.error(__filename, "createDir", "Error CreatDir: " + dirname, err);
      return Promise.reject(new Error("fail"))
    } else {
      return Promise.resolve(0);
    }
  });
};

// Cria list de diretorios
const createDirList = (dirname) => new Promise((resolve, reject) => {
  const listP = [createDir(dirname + '/data'), createDir(dirname + '/log')]
  Promise.all(listP).then(result => resolve(result)).catch(error => reject(error));
});

module.exports = createDirList;
