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

const readCompanyUUIDInput = () => new Promise((resolve, reject) => {
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('\n\n\nInsert your CompanyUUID: ', (answer) => {
    let res = answer.replace(/' '/g, '');
    let data = {
      name: 'CompanyUUID',
      value: res
    };
    rl.close();
    dBconfigSave(data).then((result) => {
      global.properties.setCompanyUUID(res);
      resolve()
    }).catch((error) => {
      reject(error)
    });

  });

})
const readCompanyUUIDParameters = () => new Promise((resolve, reject) => {
  readCompanyUUIDInput().then((result) => {
    resolve();
  }).catch((error) => {
    reject(error)
  });

})
const readCompanyUUID = () => new Promise((resolve, reject) => {
  logger.debug(__filename, "readCompanyUUID", "Init");
  global.properties.getDBconfig().findOne({
    name: 'CompanyUUID'
  }).exec(function(err, doc) {
    if (err) {
      logger.error(__filename, "readCompanyUUID", "Error Read CompanyUID", err);
      reject(err);
    } else {
      if (doc == null) {
        readCompanyUUIDParameters().then((result) => {
          resolve();
        }).catch((error) => {
          reject(error)
        });
      } else {
        global.properties.setCompanyUUID(doc.value);
        resolve();
      }
    }
  });
});

module.exports = readCompanyUUID;
