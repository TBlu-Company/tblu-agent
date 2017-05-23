/*
 * Cria todos os eventos do sistema
 */

const EventEmitter = require('events');
class EmitterClass extends EventEmitter {}

const ctrlEmitter = new EmitterClass();

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
