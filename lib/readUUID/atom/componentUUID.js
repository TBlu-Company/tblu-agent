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
  rl.question('\n\n\nInsert your ComponentUUID: ', (answer) => {
    let res = answer.replace(/' '/g, '');
    let data = {
      name: 'ComponentUUID',
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

const findItem = (item) => new Promise((resolve, reject) => {
  if (item.toUpperCase().includes('ComponentUUID'.toUpperCase())) {
    resolve(true)
  } else {
    resolve(false);
  }
});

const readComponentUUIDParameters = () => new Promise((resolve, reject) => {
  let pall = process.argv.map(findItem);
  Promise.all(pall).then(result => {
    let indexAchou = result.indexOf(true);
    console.log(indexAchou);
    if (indexAchou >= 0) {
      // substring
      let arrayInput = process.argv[indexAchou].split('=');
      if (arrayInput[0].toUpperCase() == 'ComponentUUID'.toUpperCase()) {
        let res = arrayInput[1].replace(/' '/g, '');
        let data = {
          name: 'ComponentUUID',
          value: res
        };
        dBconfigSave(data).then((result) => {
          global.properties.setComponentUUID(res);
          resolve()
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
