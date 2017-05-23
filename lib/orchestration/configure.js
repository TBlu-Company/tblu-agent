'use strict'
/*
 * Controla o fluxo de ativades para o parametro configure
 */
const eventEmitter = require('../eventEmitter/eventEmitter');

const configure = () => {
  eventEmitter.emit('npmInstallAll');
};

eventEmitter.on('npmInstallAll-end', () => {
  console.log('teste1End');
  eventEmitter.emit('teste2');
});

eventEmitter.on('teste2-end', () => {
  console.log('teste2End');
  eventEmitter.emit('teste3');
});

module.exports = configure;
