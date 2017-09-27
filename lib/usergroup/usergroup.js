'use strict';
const createUser = require('./user/user');
const createGroup = require('./group/group');
const testUser = require('./test/testUser');
const testGroup = require('./test/testGroup');

const userGroup = () => new Promise((resolve, reject) => {
  testUser().then((result) => {
    if (result) {
      resolve(result);
    } else {
      testGroup().then((result) => {
        if (result) {
          createUser().then((result) => {
            resolve(result);
          }).catch((err) => {
            reject(err);
          });
        } else {
          createGroup().then((result) => {
            createUser().then((result) => {
              resolve(result);
            }).catch((err) => {
              reject(err);
            });
          }).catch((err) => {
            reject(err);
          });
        }
      }).catch((err) => {
        reject(err);
      });
    }
  }).catch((err) => {
    reject(err);
  });
});

module.exports = {
  userGroup
};
