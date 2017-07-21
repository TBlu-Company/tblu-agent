'use strict'
const mkdirp = require('mkdirp');

const createDir = (dirname) => new Promise((resolve, reject) => {
  mkdirp(dirname, function(err) {
    if (err) {
      console.log(__filename, "Fail", "CreatDir: " + dirname, err);
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
