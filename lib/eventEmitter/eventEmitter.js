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


ctrlEmitter.on('mkdirApp', () => {
  mkdir.mkdirApp().then(() => {
    ctrlEmitter.emit('mkdirApp-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('carregaDB', () => {
  logger.debug(__filename, "EventEmitter", "carregaDB");
  ctrlEmitter.emit('carregaDB-end');
});

ctrlEmitter.on('companyUUID', () => {
  logger.debug(__filename, "EventEmitter", "companyUUID");
  ctrlEmitter.emit('companyUUID-end');
});

ctrlEmitter.on('companyUUID', () => {
  logger.debug(__filename, "EventEmitter", "companyUUID");
  ctrlEmitter.emit('companyUUID-end');
});

ctrlEmitter.on('helper', () => {
  helper();
});

module.exports = ctrlEmitter;
