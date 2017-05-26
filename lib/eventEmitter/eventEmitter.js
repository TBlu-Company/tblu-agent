'use strict'
/*
 * Cria todos os eventos do sistema
 */

/*
Importes
*/
const logger = require('../logger/logger');
const helper = require('../helper/help');
const mkdir = require('../mkdir/mkdir');
const dataBase = require('../dataBase/dataBase');
const readUUID = require('../readUUID/readUUID');
const superUserValidation = require('../validaSuperUser/validaSuperUser');
const usergroup = require('../usergroup/usergroup');
const changePermission = require('../changePermission/changePermission');
const oracleHome = require('../oracleHome/oracleHome');
const services = require('../services/services');
const dbLoadProperties = require('../dataBase/loadProperties');


/*
Construtor do evento
*/
const eventEmitter = require('events');
class EmitterClass extends eventEmitter {}
const ctrlEmitter = new EmitterClass();

ctrlEmitter.on('error', (error) => {
  logger.error(__filename, "ctrlEmitter", "error", error);
  process.exit(0)
});

ctrlEmitter.on('exit', () => {
  logger.info(__filename, "ctrlEmitter", "exit");
  process.exit(0)
});

ctrlEmitter.on('helper', () => {
  helper();
});

ctrlEmitter.on('mkdirApp', () => {
  mkdir.mkdirApp().then(() => {
    ctrlEmitter.emit('mkdirApp-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('carregaDB', () => {
  logger.debug(__filename, "ctrlEmitter", "carregaDB");
  dataBase().then(() => {
    ctrlEmitter.emit('carregaDB-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('companyUUID', () => {
  logger.debug(__filename, "ctrlEmitter", "companyUUID");
  readUUID.readCompanyUUID().then(() => {
    ctrlEmitter.emit('companyUUID-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('componentUUID', () => {
  logger.debug(__filename, "ctrlEmitter", "componentUUID");
  readUUID.readComponentUUID().then(() => {
    ctrlEmitter.emit('componentUUID-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('superUserValidation', () => {
  superUserValidation().then(() => {
    ctrlEmitter.emit('superUserValidation-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('createUserGroup', () => {
  usergroup.userGroup().then(() => {
    ctrlEmitter.emit('createUserGroup-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('findOracleHome', () => {
  oracleHome().then(() => {
    ctrlEmitter.emit('findOracleHome-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  })
});

ctrlEmitter.on('changePermission', () => {
  changePermission().then(() => {
    ctrlEmitter.emit('changePermission-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('installService', () => {
  services.install().then(() => {
    ctrlEmitter.emit('installService-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('LoadDBUpdateCronTime', () => {
  console.log('LoadDBUpdateCronTime');
  ctrlEmitter.emit('LoadDBUpdateCronTime-end');
});

ctrlEmitter.on('LoadDBSendDataOnExecute', () => {
  console.log('LoadDBSendDataOnExecute');
  ctrlEmitter.emit('LoadDBSendDataOnExecute-end');
});

ctrlEmitter.on('LoadDBSendLimit', () => {
  logger.debug(__filename, "ctrlEmitter", "LoadDBSendLimit");
  dbLoadProperties.LoadDBSendLimit().then(() => {
    ctrlEmitter.emit('LoadDBSendLimit-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('LoadDBLastInsert', () => {
  console.log('LoadDBLastInsert');
  ctrlEmitter.emit('LoadDBLastInsert-end');
});

ctrlEmitter.on('LoadDBLastRemove', () => {
  console.log('LoadDBLastRemove');
  ctrlEmitter.emit('LoadDBLastRemove-end');
});

ctrlEmitter.on('LoadMetricInsert', () => {
  console.log('LoadMetricInsert');
  ctrlEmitter.emit('LoadMetricInsert-end');
});

ctrlEmitter.on('LoadMetricRemove', () => {
  console.log('LoadMetricRemove');
  ctrlEmitter.emit('LoadMetricRemove-end');
});

ctrlEmitter.on('StartCron', () => {
  console.log('StartCron');
  ctrlEmitter.emit('StartCron-end');
});

module.exports = ctrlEmitter;
