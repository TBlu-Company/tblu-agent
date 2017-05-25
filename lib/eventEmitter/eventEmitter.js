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
  console.log('findOracleHome');
  ctrlEmitter.emit('findOracleHome-end');
});

ctrlEmitter.on('changePermission', () => {
  console.log('changePermission');
  ctrlEmitter.emit('changePermission-end');
});

ctrlEmitter.on('installService', () => {
  console.log('installService');
  ctrlEmitter.emit('installService-end');
});
module.exports = ctrlEmitter;
