'use strict'
const os = require('os');

const createGroupLinux = () => new Promise((resolve, reject) => {
  resolve(true)
});
const createGroupWindows = () => new Promise((resolve, reject) => {
  resolve(true)
});
const createGroup = () => new Promise((resolve, reject) => {
  if (os.platform() == 'linux') {
    createGroupLinux().then(result => resolve(result)).catch(err => reject(err));
  } else if (os.platform() == 'win32') {
    createGroupWindows().then(result => resolve(result)).catch(err => reject(err));;
  } else {
    reject(new Error('Invalid SO'))
  }
});

module.exports = createGroup;
