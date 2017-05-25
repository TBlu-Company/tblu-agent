'use strict'
const os = require('os');
const exec = require('child_process').exec;
const testGroupLinux = () => new Promise((resolve, reject) => {
  let command = 'getent group ' + global.properties.getUserName();
  exec(command, (error, stdout) => {
    if (error) {
      if (error.code == 2) {
        resolve(false);
      } else {
        reject(error)
      }
    } else {
      resolve(true);
    }
  });
});
const testGroupWindows = () => new Promise((resolve, reject) => {
  let command = 'net group ' + global.properties.getUserName() + "Group";
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(error);
      if (error.code == 2) {
        let command = 'net localgroup ' + global.properties.getUserName() + "Group";
        exec(command, (error, stdout, stderr) => {
          if (error) {
            if (error.code == 2) {
              resolve(false);
            } else {
              reject(error)
            }
          } else {
            resolve(true);
          }
        });
      } else {
        reject(error)
      }
    } else {
      resolve(true);
    }
  });
});

const testGroup = () => new Promise((resolve, reject) => {
  if (os.platform() == 'linux') {
    testGroupLinux().then(result => resolve(result)).catch(err => reject(err));
  } else if (os.platform() == 'win32') {
    testGroupWindows().then(result => resolve(result)).catch(err => reject(err));
  } else {
    reject(new Error('Invalid SO'))
  }
});

module.exports = testGroup;
