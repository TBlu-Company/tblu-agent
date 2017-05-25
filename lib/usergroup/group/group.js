'use strict'
const os = require('os');
const exec = require('child_process').exec;
const logger = require('../../logger/logger');

const createGroupLinux = () => new Promise((resolve, reject) => {
  let command = 'groupadd';
  command += ' -g ' + global.properties.getGID();
  command += ' ' + global.properties.getUserName();
  exec(command, (error) => {
    if (error) {
      logger.error(__filename, "createGroupLinux", "Fail", error);
      reject(error)
    } else {
      logger.debug(__filename, "createGroupLinux", "Success");
      resolve(true);
    }
  });
});
const createGroupWindows = () => new Promise((resolve, reject) => {
  let command = 'net localgroup';
  command += ' ' + global.properties.getUserName() + "Group";
  command += ' /comment:"TBlu Group" ';
  command += ' /add ';
  exec(command, (error) => {
    if (error) {
      logger.error(__filename, "createUserWindows", "Fail", error);
      reject(error)
    } else {
      logger.debug(__filename, "createUserWindows", "Success");
      resolve(true);
    }
  });
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
