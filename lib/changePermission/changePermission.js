'use strict'
const os = require('os');
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;

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
    let command = 'icacls.exe';
    let args = [];
    args.push(global.properties.getAppDir());
    args.push('/grant');
    args.push(global.properties.getUserName() + "Group" + ":F");
    args.push('/t');
    args.push('/c');
    let icacls = spawn(command, args, {
      stdio: 'ignore'
    });
    icacls.on('close', (code) => {
      if (code !== 0) {
        reject(code)
      } else {
        resolve(true);
      }
    });
    icacls.on('error', (error) => {
      reject(error)
    });
  }
});

const changePermission = () => new Promise((resolve, reject) => {
  // if (os.platform() == 'linux') {
  //   changePermissionLinux().then(result => resolve(result)).catch(err => reject(err));
  // } else if (os.platform() == 'win32') {
  //   changePermissionWindows().then(result => resolve(result)).catch(err => reject(err));
  // } else {
  //   reject(new Error('Invalid SO'))
  // }
  console.log('changePermission by Pass')
  resolve(true);
});

module.exports = changePermission;
