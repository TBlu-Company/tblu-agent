'use strict'
const fs = require('fs');
const os = require('os');

const testOracleHomeEnv = () => new Promise((resolve, reject) => {
  let result = [];
  let count = Object.keys(process.env).length;
  for (let key in process.env) {
    count -= 1;
    if (key.toString().toUpperCase() == "ORACLE_HOME") {
      result[0] = process.env[key];
    };
    if (key.toString().toUpperCase() == "LD_LIBRARY_PATH") {
      result[1] = process.env[key];
    };
    if (count == 0) {
      if (result.length > 1) {
        resolve(result)
      } else if (result.length > 0) {
        if (typeof result[0] == "undefined") {
          reject();
        } else {
          result[1] = result[0] + "/lib";
          resolve(result)
        }
      } else {
        reject();
      }
    }
  }

});
const getOracleHome = () => new Promise((resolve, reject) => {
  testOracleHomeEnv().then((result) => {
    resolve(result);
  }).catch(() => {
    fs.readFile('/etc/oratab', 'utf8', function(err, data) {
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
  })
});

module.exports = {
  getOracleHome,
};
