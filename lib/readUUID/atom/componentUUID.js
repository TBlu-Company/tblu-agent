'use strict'
const logger = require('../../logger/logger');
const readline = require('readline');
const crud = require('../../dataBase/crud')
const findItem = require('./findItem');
const regexTestUUID = new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");

const readComponentUUIDInput = () => new Promise((resolve, reject) => {
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('\n\n\nInsert your ComponentUUID: ', (answer) => {
    let res = answer.match(regexTestUUID).toString();
    rl.close();
    if (regexTestUUID.test(res)) {
      let data = {
        name: 'ComponentUUID',
        value: res
      };
      crud.insert(global.properties.getDBconfig(), data).then((result) => {
        global.properties.setComponentUUID(res);
        resolve(result);
      }).catch((error) => {
        reject(error);
      });
    } else {
      console.log('\n\nInvalid UUID');
      readComponentUUIDInput().then((result) => resolve(result)).catch((error) => reject(error));
    }
  });
})

const readComponentUUIDParameters = () => new Promise((resolve, reject) => {
  let pall = process.argv.map((e) => {
    return findItem(e, 'ComponentUUID');
  });
  Promise.all(pall).then(result => {
    let indexAchou = result.indexOf(true);
    if (indexAchou >= 0) {
      // substring
      let arrayInput = process.argv[indexAchou].split('=');
      if (arrayInput[0].toUpperCase() == 'ComponentUUID'.toUpperCase()) {
        let res = arrayInput[1].replace(/' '/g, '');
        let data = {
          name: 'ComponentUUID',
          value: res
        };
        crud.insert(global.properties.getDBconfig(), data).then((result) => {
          global.properties.setComponentUUID(res);
          resolve();
        }).catch((error) => {
          reject(error);
        });
      } else {
        readComponentUUIDInput().then((result) => {
          resolve();
        }).catch((error) => {
          reject(error)
        });
      }
    } else {
      readComponentUUIDInput().then((result) => {
        resolve();
      }).catch((error) => {
        reject(error)
      });
    }
  });
})

const readComponentUUID = () => new Promise((resolve, reject) => {
  logger.debug(__filename, "readComponentUUID", "Init");
  global.properties.getDBconfig().findOne({
    name: 'ComponentUUID'
  }).exec(function(err, doc) {
    if (err) {
      logger.error(__filename, "readAccountUID", "Error Read ComponentUUID", err);
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
