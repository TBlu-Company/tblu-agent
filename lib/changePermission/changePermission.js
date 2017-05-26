'use strict'
const os = require('os');
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const logger = require('../logger/logger');

const changePermissionLinux = () => new Promise((resolve, reject) => {
  if (global.properties.getAppDir().length <= 1) {
    reject(new Error('Diretorio da app não pode ser /'))
  } else {
    let command = 'chown ';
    command += global.properties.getUID();
    command += ':' + global.properties.getGID();
    command += ' -R ' + global.properties.getAppDir();
    exec(command, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve(true);
      }
    });
  }
});
const changePermissionWindows = () => new Promise((resolve, reject) => {
  if (global.properties.getAppDir().length <= 3) {
    reject(new Error('Diretorio da app não pode ser /'))
  } else {
    let command = 'icacls';
    command += ' ' + global.properties.getAppDir();
    command += ' /q /t /c';
    command += ' /grant ' + global.properties.getUserName() + ':F ';
    exec(command, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve(true);
      }
    });

    // let command = 'icacls.exe';
    // let args = [];
    // args.push(global.properties.getAppDir());
    // args.push(' /q ');
    // args.push(' /T ');
    // args.push(' /C ');
    // args.push(' /grant ' + global.properties.getUserName() + ":F ");
    // let icacls = spawn(command, args);
    //
    // icacls.stdout.on('data', (data) => {
    //   console.log(`stdout: ${data}`);
    // });
    //
    // icacls.on('close', (code) => {
    //   logger.debug(__filename, "changePermissionWindows", 'code', code);
    //   if (code !== 0) {
    //     reject(code)
    //   } else {
    //     resolve(true);
    //   }
    // });
    // icacls.on('error', (error) => {
    //   reject(error)
    // });
  }
});

const changePermission = () => new Promise((resolve, reject) => {
  if (os.platform() == 'linux') {
    changePermissionLinux().then(result => resolve(result)).catch(err => reject(err));
  } else if (os.platform() == 'win32') {
    changePermissionWindows().then(result => resolve(result)).catch(err => reject(err));
  } else {
    reject(new Error('Invalid SO'))
  }
});

module.exports = changePermission;
