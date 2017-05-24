'use strict'
/*
 * Cria todos os eventos do sistema
 */

/*
Importes
*/
const logger = require('../logger/logger');
const helper = require('../helper/help');
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
  let mkdir = require('../mkdir/mkdir');
  mkdir.mkdirApp().then(() => {
    ctrlEmitter.emit('mkdirApp-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('helper', () => {
  helper();
});

module.exports = ctrlEmitter;
