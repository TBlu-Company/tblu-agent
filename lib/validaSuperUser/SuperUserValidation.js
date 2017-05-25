'use strict'

const os = require('os');
const SuperUserValidation = () => new Promise((resolve, reject) => {
  resolve();
  // if (os.platform() == 'linux') {
  //   // linuxCheck().then((result) => resolve(result)).catch(err => reject(err));
  //   resolve();
  // } else if (os.platform() == 'win32') {
  //   win32Check().then(result => resolve(result)).catch(err => reject(err));
  // } else {
  //   reject(new Error('Invalid SO'))
  // }
});

const linuxCheck = () => new Promise((resolve, reject) => {
  resolve();
  // if (process.getuid && process.getuid() === 0) {
  //   resolve(true);
  // } else {
  //   reject(new Error('Usuário não é root'));
  // }
});

module.exports = SuperUserValidation;
