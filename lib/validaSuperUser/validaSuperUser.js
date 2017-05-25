'use strict'

const platform = require('os').platform();
const exec = require('child_process').exec;

const SuperUserValidation = () => new Promise((resolve, reject) => {
  if (platform == 'linux') {
    linuxCheck().then((result) => resolve(result)).catch(err => reject(err));
  } else if (platform == 'win32') {
    win32Check().then(result => resolve(result)).catch(err => reject(err));
  } else {
    reject(new Error('OS not supported'))
  }
});

const linuxCheck = () => new Promise((resolve, reject) => {
  if (process.getuid && process.getuid() === 0) {
    resolve(true);
  } else {
    reject(new Error('Usuário não é root'));
  }
});

const win32Check = () => new Promise((resolve, reject) => {
  exec('NET SESSION', (err, so, se) => {
    if (se.length == 0) {
      resolve(true);
    } else {
      reject(new Error('Usuário não é root'));
    }
  });
});

module.exports = SuperUserValidation;
