'use strict'
const cmd = require('async-exec-cmd')

const testUser = (userObject) => new Promise((resolve, reject) => {
  let args = [];
  args.push('passwd')
  args.push(userObject.name)
  cmd('getent', args, (err, res, code, buffer) => {
    if (err) {
      if (err.message) {
        reject(err)
      } else {
        resolve(false);
      }
    } else {
      resolve(true);
    }
  });
})

const testGroup = (groupObject) => new Promise((resolve, reject) => {
  let args = [];
  args.push('group')
  args.push(groupObject.name)
  cmd('getent', args, (err, res, code, buffer) => {
    if (err) {
      if (err.message) {
        reject(err)
      } else {
        resolve(false);
      }
    } else {
      resolve(true);
    }
  });
})


const addUser = (userObject) => new Promise((resolve, reject) => {
  testUser(userObject).then((result) => {
    if (result) {
      resolve(result);
    } else {
      let args = [];
      args.push('-g ' + userObject.gid);
      args.push('-u ' + userObject.uid);
      args.push('-d');
      args.push(userObject.dirname);
      args.push('-s');
      args.push('/bin/false');
      args.push('-M');
      args.push('-N');
      args.push(userObject.name);
      cmd('useradd', args, (err, res, code, buffer) => {
        if (err) {
          reject(err)
        } else {
          resolve(true);
        }
      })
    }
  }).catch((err) => {
    reject(err);
  })
})
const addGroup = (groupObject) => new Promise((resolve, reject) => {
  testGroup(groupObject).then((result) => {
    if (result) {
      resolve(result);
    } else {
      let args = [];
      args.push('-g')
      args.push(groupObject.gid)
      args.push(groupObject.name)
      cmd('groupadd', args, (err, res, code, buffer) => {
        if (err) {
          reject(err)
        } else {
          resolve(true);
        }
      })
    }
  }).catch((err) => {
    reject(err);
  })
})

module.exports = {
  addUser,
  addGroup,
};
