'use strict'
const os = require('os');

const createUserLinux => new Promise((resolve, reject) => {
  resolve(true)
});
const createUserWindows => new Promise((resolve, reject) => {
  resolve(true)
});
const createUser = () => new Promise((resolve, reject) => {
  if (os.platform() == 'linux') {
    createUserLinux().then(result => resolve(result)).catch(err => reject(err));
  } else if (os.platform() == 'win32') {
    createUserWindows().then(result => resolve(result)).catch(err => reject(err));;
  } else {
    reject(new Error('Invalid SO'))
  }
});

module.exports = createUser;
