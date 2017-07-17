'use strict'
const exec = require('child_process').exec;
const os = require('os');
const testOracleHomeEnv = require('./atom/testOracleHomeEnv')
const _ = require('lodash')
const logger = require('../logger/logger');

const regex = /(?:(\d+)\.)?(?:(\d+)\.)?(?:(\d+)\.)?(?:(\d+)\.)?(?:(\d+))/g;


function versionCompare(v1, v2, options) {
  let lexicographical = options && options.lexicographical,
    zeroExtend = options && options.zeroExtend,
    v1parts = v1.split('.'),
    v2parts = v2.split('.');

  function isValidPart(x) {
    return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
  }

  if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
    return NaN;
  }

  if (zeroExtend) {
    while (v1parts.length < v2parts.length) v1parts.push("0");
    while (v2parts.length < v1parts.length) v2parts.push("0");
  }

  if (!lexicographical) {
    v1parts = v1parts.map(Number);
    v2parts = v2parts.map(Number);
  }

  for (let i = 0; i < v1parts.length; ++i) {
    if (v2parts.length == i) {
      return 1;
    }

    if (v1parts[i] == v2parts[i]) {
      continue;
    } else if (v1parts[i] > v2parts[i]) {
      return 1;
    } else {
      return -1;
    }
  }

  if (v1parts.length != v2parts.length) {
    return -1;
  }

  return 0;
}


const findMelhorVersao = (arrayVersao) => new Promise((resolve, reject) => {
  if (arrayVersao.length == 0) {
    if (arrayVersao.length == 1) {
      resolve([arrayVersao[0].caminho, arrayVersao[0].caminho + '/lib'])
    } else {
      let melhor = arrayVersao[0];
      for (let i = 1; i < arrayVersao.length; i++) {
        if (versionCompare(melhor.versao, arrayVersao[i].versao) < 0) {
          melhor = arrayVersao[i];
        };
      };
      logger.debug(__filename, 'findMelhorVersao', 'melhor', melhor);
      resolve([melhor.caminho, melhor.caminho + '/lib'])
    }
  } else {
    resolve(undefined)
  }
})


const pversion = (line, coluna) => new Promise((resolve, reject) => {
  let reg = regex.exec(line);
  if (reg != null) {
    let t = {
      caminho: coluna,
      versao: reg[0]
    }
    logger.debug(__filename, 'pversion', 't', t);
    resolve(t)
  } else {
    resolve(undefined)
  }
});

const pcoluna = (coluna) => new Promise((resolve, reject) => {
  let command = 'strings ' + coluna + '/bin/oracle | grep NLSRT';
  exec(command, (error, stdout) => {
    if (error) {
      resolve(undefined)
    } else {
      let lines = stdout.split(os.EOL);
      logger.debug(__filename, 'pcoluna', 'lines', lines);
      let pall = lines.map(e => {
        return pversion(e, coluna);
      })
      Promise.all(pall).then(result => {
        let cresult = _.compact(result);
        if (cresult.length > 1) {
          resolve(cresult);
        } else {
          resolve(undefined)
        }
      }).catch(reason => {
        reject(reason);
      });
    };

  });
});

const plinha = (linha) => new Promise((resolve, reject) => {
  if (linha.charAt(0) != "#") {
    let coluna = linha.split(':');
    if (coluna.length > 1) {
      resolve(pcoluna(coluna[1]));
    } else {
      resolve(undefined)
    }
  } else {
    resolve(undefined)
  };
})

const getOracleHomeLinux = () => new Promise((resolve, reject) => {
  testOracleHomeEnv().then((result) => {
    // console.log(result);
    resolve(result);
  }).catch(() => {
    let command = 'cat /etc/oratab';
    exec(command, (error, stdout) => {
      if (error) {
        resolve(undefined)
      } else {
        let lines = stdout.split(os.EOL);
        logger.debug(__filename, 'getOracleHomeLinux', 'lines', lines);
        let pall = lines.map(e => {
          return plinha(e);
        })
        Promise.all(pall).then(result => {
          let cresult = _.compact(result);
          logger.debug(__filename, 'getOracleHomeLinux', 'cresult', cresult);
          if (cresult.length >= 1) {
            findMelhorVersao(cresult).then(result => {
              resolve(result)
            })
          } else {
            resolve(undefined)
          }
        }).catch(reason => {
          reject(reason);
        });
      }
    });
  });
});

const getOracleHomeWindows = () => new Promise((resolve, reject) => {
  resolve('Windows not supported!');
  // resolve(true);
});

const oracleHome = () => new Promise((resolve, reject) => {
  if (os.platform() == 'linux') {
    getOracleHomeLinux().then(result => {
      if (typeof result != 'undefined') {
        global.properties.setOracleHome(result[0]);
        global.properties.setLDLibraryPath(result[1]);
        resolve(true);
      } else {
        resolve(false);
      };
    }).catch(err => reject(err));
  } else if (os.platform() == 'win32') {
    getOracleHomeWindows().then(result => resolve(result)).catch(err => reject(err));
  } else {
    reject(new Error('Invalid SO'));
  }
  // console.log('changePermission by Pass')
  // resolve(true);
});

module.exports = oracleHome;
