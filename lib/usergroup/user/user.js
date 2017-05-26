'use strict'
const os = require('os');
const exec = require('child_process').exec;
const logger = require('../../logger/logger');

const createUserLinux = () => new Promise((resolve, reject) => {
  let command = 'useradd';
  command += ' -g ' + global.properties.getGID();
  command += ' -u ' + global.properties.getUID();
  command += ' -d ' + global.properties.getAppDir();
  command += ' -s ' + '/bin/false';
  command += ' -M ';
  command += ' -N ';
  command += ' ' + global.properties.getUserName();
  exec(command, (error) => {
    if (error) {
      logger.error(__filename, "createUserLinux", "Fail", error);
      reject(error)
    } else {
      logger.debug(__filename, "createUserLinux", "Success");
      resolve(true);
    }
  });
});
const createUserWindows = () => new Promise((resolve, reject) => {
  let command = 'net user';
  command += ' ' + global.properties.getUserName();
  command += ' /fullname:"TBlu Agent User"';
  command += ' /add ';
  exec(command, (error) => {
    if (error) {
      logger.error(__filename, "createUserWindows", "Fail", error);
      reject(error)
    } else {
      let command = 'net localgroup ' + global.properties.getUserName() + "Group" + ' ' + global.properties.getUserName() + ' /add';
      exec(command, (error) => {
        if (error) {
          reject(error)
        } else {
          logger.debug(__filename, "createUserWindows", "Success");
          resolve(true);
        }
      });
    }
  });
});
const createUser = () => new Promise((resolve, reject) => {
  if (os.platform() == 'linux') {
    createUserLinux().then(result => resolve(result)).catch(err => reject(err));
  } else if (os.platform() == 'win32') {
    createUserWindows().then(result => resolve(result)).catch(err => reject(err));
  } else {
    reject(new Error('Invalid SO'))
  }
});

module.exports = createUser;
