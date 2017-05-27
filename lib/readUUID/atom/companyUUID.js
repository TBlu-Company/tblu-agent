'use strict'
const logger = require('../../logger/logger');
const readline = require('readline');
const save = require('../../dataBase/saveDbConfig.js');
const findItem = require('./findItem');

const readCompanyUUIDInput = () => new Promise((resolve, reject) => {
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('\n\n\nInsert your CompanyUUID: ', (answer) => {
    let res = answer.replace(/' '/g, '').replace(/'\t'/g, '');
    let data = {
      name: 'CompanyUUID',
      value: res
    };
    rl.close();
    save(data).then((result) => {
      global.properties.setCompanyUUID(res);
      resolve();
    }).catch((error) => {
      reject(error);
    });

  });

})

const readCompanyUUIDParameters = () => new Promise((resolve, reject) => {
  let pall = process.argv.map((e) => {
    return findItem(e, 'CompanyUUID');
  });
  Promise.all(pall).then(result => {
    let indexAchou = result.indexOf(true);
    if (indexAchou >= 0) {
      // substring
      let arrayInput = process.argv[indexAchou].split('=');
      if (arrayInput[0].toUpperCase() == 'CompanyUUID'.toUpperCase()) {
        let res = arrayInput[1].replace(/' '/g, '');
        let data = {
          name: 'CompanyUUID',
          value: res
        };
        save(data).then((result) => {
          global.properties.setComponentUUID(res);
          resolve();
        }).catch((error) => {
          reject(error);
        });
      } else {
        readCompanyUUIDInput().then((result) => {
          resolve();
        }).catch((error) => {
          reject(error);
        });
      }
    } else {
      readCompanyUUIDInput().then((result) => {
        resolve();
      }).catch((error) => {
        reject(error);
      });
    }
  });
})

const readCompanyUUID = () => new Promise((resolve, reject) => {
  logger.debug(__filename, "readCompanyUUID", "Init");
  global.properties.getDBconfig().findOne({
    name: 'CompanyUUID'
  }).exec(function(err, doc) {
    if (err) {
      logger.error(__filename, "readCompanyUUID", "Error Read CompanyUUID", err);
      reject(err);
    } else {
      if (doc == null) {
        readCompanyUUIDParameters().then((result) => {
          resolve();
        }).catch((error) => {
          reject(error);
        });
      } else {
        global.properties.setCompanyUUID(doc.value);
        resolve();
      }
    }
  });
});

module.exports = readCompanyUUID;
