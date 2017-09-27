'use strict';
const os = require('os');
const exec = require('child_process').exec;
const testUserLinux = () => new Promise((resolve, reject) => {
  let command = 'getent passwd ' + global.properties.getUserName();
  exec(command, (error, stdout) => {
    if (error) {
      if (error.code === 2) {
        resolve(false);
      } else {
        reject(error);
      }
    } else {
      let array = stdout.split(':');
      global.properties.setUID(array[2]);
      global.properties.setGID(array[3]);
      resolve(true);
    }
  });
});

const testUserWindows = () => new Promise((resolve, reject) => {
  let command = 'net user ' + global.properties.getUserName();
  exec(command, (error) => {
    if (error) {
      if (error.code === 2) {
        resolve(false);
      } else {
        reject(error);
      }
    } else {
      resolve(true);
    }
  });
});

const testUser = () => new Promise((resolve, reject) => {
  if (os.platform() === 'linux') {
    testUserLinux().then(result => resolve(result)).catch(err => reject(err));
  } else if (os.platform() === 'win32') {
    testUserWindows().then(result => resolve(result)).catch(err => reject(err));
  } else {
    reject(new Error('Invalid SO'));
  }
});

module.exports = testUser;
