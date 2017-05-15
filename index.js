'use strict'
// Load Caminho
const path = require('path');
const filename = path.basename(__filename);
const dirname = path.dirname(__filename);
global.basedir = dirname;
// Load Libs


const Datastore = require('nedb')

// Load Includes
const logger = require('./src/logger/logger.js');
const update = require('./src/lib/update.js');
const cron = require('./src/lib/cron.js');
const sendDB = require('./src/lib/sendDB.js');
const createDir = require('./src/lib/createDir.js');
const loadDataBase = require('./src/lib/loadDataBase.js');
const readInput = require('./src/lib/readInput.js');



// Variables
let dBmetrics = null;
let dBconfig = null;
let dBgather = null;
let gid = null;
let uid = null;



const setGlobal = () => new Promise((resolve, reject) => {
  update.setGlobal(dBconfig, dirname, dBmetrics);
  cron.setGlobal(dBconfig, dirname, dBmetrics, dBgather);
  sendDB.setGlobal(dBconfig, dBgather);
  resolve(0);
});

// Fim Passo 1
// Inicio Passo 2
// Ler AccountUID e ComponentUID

const readSendDBLimit = () => new Promise((resolve, reject) => {
  logger.debug(__filename, "readSendDBLimit", "Init");
  dBconfig.findOne({
    name: 'SendDBLimit'
  }).exec(function(err, doc) {
    if (err) {
      logger.error(__filename, "readSendDBLimit", "Error Read SendDBLimit", err);
    } else {
      if (doc == null) {
        let data = {
          name: 'SendDBLimit',
          value: 50
        };
        dBconfig.insert(data);
        resolve(0);

      } else {
        resolve(0);
      };
    };
  });
});

const readSendDBCronTime = () => new Promise((resolve, reject) => {
  logger.debug(__filename, "readSendDBCronTime", "Init");
  dBconfig.findOne({
    name: 'SendDBCronTime'
  }).exec(function(err, doc) {
    if (err) {
      logger.error(__filename, "readSendDBCronTime", "Error Read SendDBCronTime", err);
    } else {
      if (doc == null) {
        let x = Math.floor((Math.random() * 59) + 1);
        let t = x + ' */2 * * * *';
        let data = {
          name: 'SendDBCronTime',
          value: t
        };
        dBconfig.insert(data);
        resolve(0);

      } else {
        resolve(0);
      };
    };
  });
});

const readUpdateCronTime = () => new Promise((resolve, reject) => {
  logger.debug(__filename, "readUpdateCronTime", "Init");
  dBconfig.findOne({
    name: 'UpdateCronTime'
  }).exec(function(err, doc) {
    if (err) {
      logger.error(__filename, "readUpdateCronTime", "Error Read UpdateCronTime", err);
    } else {
      if (doc == null) {
        let x = Math.floor((Math.random() * 59) + 1);
        let t = x + ' */10 * * * *';
        let data = {
          name: 'UpdateCronTime',
          value: t
        };
        dBconfig.insert(data);
        resolve(0);

      } else {
        resolve(0);
      };
    };
  });
});


const initProcess = () => new Promise((resolve, reject) => {
  createDir(dirname).then(() => {
    loadDataBase(dirname).then((result) => {
      dBconfig = result[0];
      dBmetrics = result[1];
      dBgather = result[2];
    }).then(() => {
      return readInput.readAccountUID(dBconfig)
    }).then(() => {
      return readInput.readComponentUUID(dBconfig);
    }).then(() => {
      resolve(0);
    });
  })
})

const readLimits = () => new Promise((resolve, reject) => {
  logger.debug(__filename, "readLimits", "Init");
  readSendDBLimit().then(() => {
    return readSendDBCronTime();
  }).then(() => {
    return readUpdateCronTime();
  }).then(() => {
    resolve(0);
  }).catch((error) => reject(error));
});

// Fim Passo 2

// Inicio Geral
initProcess().then(() => {
  return readLimits()
}).then(() => {
  return setGlobal()
}).then(() => {
  // Inicio Passo 4
  return cron.startCron();
}).catch((error) => {
  logger.error(__filename, "Geral", "Error: ", error);
  cron.stopCron();
  process.exit(1);
});

process.on('SIGINT', function() {
  logger.info(__filename, "SIGINT", "Desligando o sistema ");
  cron.stopCron().then(result => {
    process.exit();
  });
});
// Fim Geral
