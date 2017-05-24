'use strict'
const logger = require('../../logger/logger');
const readline = require('readline');

const dBconfigSave = (doc) => new Promise((resolve, reject) => {
  global.properties.getDBconfig().insert(doc, (err, newDoc) => {
    if (err) {
      logger.error(__filename, "dBconfigSave", "Error save doc", err);
      reject(err);
    } else {
      resolve();
    }
  });
});

const readComponentUUIDInput = () => new Promise((resolve, reject) => {
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
    rl.close();
    dBconfigSave(data).then((result) => {
      global.properties.setComponentUUID(res);
      resolve()
    }).catch((error) => {
      reject(error)
    });

  });

})
const readComponentUUIDParameters = () => new Promise((resolve, reject) => {
  readComponentUUIDInput().then((result) => {
    resolve();
  }).catch((error) => {
    reject(error)
  });

})
const readComponentUUID = () => new Promise((resolve, reject) => {
  logger.debug(__filename, "readComponentUUID", "Init");
  global.properties.getDBconfig().findOne({
    name: 'ComponentUID'
  }).exec(function(err, doc) {
    if (err) {
      logger.error(__filename, "readAccountUID", "Error Read ComponentUID", err);
      reject(err);
    } else {
      if (doc == null) {
        readComponentUUIDParameters().then((result) => {
          resolve();
        }).catch((error) => {
          reject(error)
        });
      } else {
        global.properties.setComponentUUID(doc.value);
        resolve();
      }
    }
  });
});


module.exports = readComponentUUID;
