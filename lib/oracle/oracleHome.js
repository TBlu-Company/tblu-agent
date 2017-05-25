'use strict'
const fs = require('fs');
const os = require('os');
const testOracleHomeEnv = require('./atom/testOracleHomeEnv')

const getOracleHome = () => new Promise((resolve, reject) => {
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

module.exports = getOracleHome;
