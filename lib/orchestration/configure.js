'use strict'
/*
 * Controla o fluxo de ativades para o parametro configure
 */
const eventEmitter = require('../eventEmitter/eventEmitter');

const configure = () => {
  eventEmitter.emit('npmInstallAll');
};

eventEmitter.on('npmInstallAll-end', () => {
  eventEmitter.emit('mkdirApp');
});

eventEmitter.on('teste2-end', () => {
  console.log('teste2End');
  eventEmitter.emit('teste3');
});

module.exports = configure;
