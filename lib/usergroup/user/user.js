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
    return createUserLinux();
  } else if (os.platform() == 'win32') {
    return createUserWindows();
  } else {
    reject(new Error('Invalid SO'))
  }
});

module.exports = createUser;
