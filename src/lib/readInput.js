'use strict'
const path = require('path');
const filename = path.basename(__filename);
const readline = require('readline');
const logger = require('../logger/logger.js');

const readAccountUID = (dBconfig) => new Promise((resolve, reject) => {
  logger.debug(__filename, "readAccountUID", "Init");
  dBconfig.findOne({
    name: 'AccountUID'
  }).exec(function(err, doc) {
    if (err) {
      logger.error(__filename, "readAccountUID", "Error Read AccountUID", err);
    } else {
      if (doc == null) {
        let rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        rl.question('\n\n\nInsert your AccountUID: ', (answer) => {
          let res = answer.replace(/' '/g, '');
          let data = {
            name: 'AccountUID',
            value: res
          };
          dBconfig.insert(data);
          rl.close();
          resolve(0);
        });
      } else {
        resolve(0);
      };
    };
  });
});

const readComponentUUID = (dBconfig) => new Promise((resolve, reject) => {
  logger.debug(__filename, "readComponentUUID", "Init");
  dBconfig.findOne({
    name: 'ComponentUID'
  }).exec(function(err, doc) {
    if (err) {
      logger.error(__filename, "readAccountUID", "Error Read ComponentUID", err);
    } else {
      if (doc == null) {
        let rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        rl.question('\n\n\nInsert your ComponentUID: ', (answer) => {
          let res = answer.replace(/' '/g, '');
          let data = {
            name: 'ComponentUID',
            value: res
          };
          dBconfig.insert(data);
          rl.close();
          resolve(0);
        });
      } else {
        resolve(0);
      };
    };
  });
});

module.exports = {
  readAccountUID,
  readComponentUUID
};
