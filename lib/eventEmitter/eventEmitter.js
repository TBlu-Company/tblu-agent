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

/*
Construtor do evento
*/
const EventEmitter = require('events');
class EmitterClass extends EventEmitter {}
const ctrlEmitter = new EmitterClass();

ctrlEmitter.on('error', (error) => {
  logger.error(__filename, "EventEmitter", "error", error);
  process.exit(0)
});

ctrlEmitter.on('exit', () => {
  logger.info(__filename, "EventEmitter", "exit");
  process.exit(0)
});

ctrlEmitter.on('mkdirApp', () => {
  mkdir.mkdirApp().then(() => {
    ctrlEmitter.emit('mkdirApp-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('carregaDB', () => {
  logger.debug(__filename, "EventEmitter", "carregaDB");
  dataBase().then(() => {
    ctrlEmitter.emit('carregaDB-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('companyUUID', () => {
  logger.debug(__filename, "EventEmitter", "companyUUID");
  readUUID.readCompanyUUID().then(() => {
    ctrlEmitter.emit('companyUUID-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('componentUUID', () => {
  logger.debug(__filename, "EventEmitter", "componentUUID");
  readUUID.readComponentUUID().then(() => {
    ctrlEmitter.emit('componentUUID-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});


ctrlEmitter.on('helper', () => {
  helper();
});

module.exports = ctrlEmitter;
