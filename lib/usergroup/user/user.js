'use strict'
const os = require('os');

const createUserLinux => new Promise((resolve, reject) => {
  resolve(true)
});
const createUserWindows => new Promise((resolve, reject) => {
  resolve(true)
});
const createUser = () => new Promise((resolve, reject) => {

  switch (os.platform()) {
    case 'linux':
      return createUserLinux();
      break;
    case 'win32':
      return createUserWindows();
      break;
    default:
      reject(new Error('Invalid SO'))
  }
});

module.exports = createUser;
