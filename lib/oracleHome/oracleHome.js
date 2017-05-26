'use strict'
const fs = require('fs');
const os = require('os');
const testOracleHomeEnv = require('./atom/testOracleHomeEnv')

const getOracleHomeLinux = () => new Promise((resolve, reject) => {
  testOracleHomeEnv().then((result) => {
    resolve(result);
  }).catch(() => {
    fs.readFile('/etc/oratab', 'utf8', (err, data) => {
      if (err) {
        resolve(undefined)
      } else {
        let lines = data.split(os.EOL);
        for (let i = 0; i < lines.length - 1; i++) {
          if (lines[i].replace(/ /g, '').replace(/\t/g, '').charAt(0) != "#") {
            let linha = lines[i].split(':');
            if (linha[2].toString().toUpperCase() == "Y") {
              let array = [];
              array.push(linha[1]);
              array.push(linha[1] + "/lib");
              resolve(array);
            }
          }
          if (i == lines.length - 2) {
            resolve(undefined)
          }
        }
      };
    });
  });
});

const getOracleHomeWindows = () => new Promise((resolve, reject) => {
  reject(new Error('Windows not supported!'))
  // resolve(true);
});

const oracleHome = () => new Promise((resolve, reject) => {
  if (os.platform() == 'linux') {
    getOracleHomeLinux().then(result => resolve(result)).catch(err => reject(err));
  } else if (os.platform() == 'win32') {
    getOracleHomeWindows().then(result => resolve(result)).catch(err => reject(err));
  } else {
    reject(new Error('Invalid SO'));
  }
  // console.log('changePermission by Pass')
  // resolve(true);
});

module.exports = oracleHome;
