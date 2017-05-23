'use strict'
/*
 * Cria todos os eventos do sistema
 */

/*
Importes
*/
const npmModule = require('../npm/npm')
const logger = require('../logger/logger');

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

ctrlEmitter.on('npmInstallAll', () => {
  npmModule.installAll().then(() => {
    ctrlEmitter.emit('npmInstallAll-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('teste1', () => {
  console.log('teste1');
  ctrlEmitter.emit('teste1-end');
});

ctrlEmitter.on('teste2', () => {
  console.log('teste2');
  ctrlEmitter.emit('teste2-end');
});
ctrlEmitter.on('teste3', () => {
  console.log('teste3');
  ctrlEmitter.emit('teste3-end');
});

module.exports = ctrlEmitter;
