'use strict'
/*
 * Controla o fluxo de ativades para o parametro configure
 * OBS: nunca podem fazer importe de modulos NPM - Somente mandar eventos para o emiter
 */
const eventEmitter = require('../eventEmitter/eventEmitter');

const configure = () => {
  eventEmitter.emit('mkdirApp');
};

eventEmitter.on('mkdirApp-end', () => {
  eventEmitter.emit('carregaDB');
});

eventEmitter.on('carregaDB-end', () => {
  eventEmitter.emit('companyUUID');
});

eventEmitter.on('companyUUID-end', () => {
  eventEmitter.emit('componentUUID');
});

eventEmitter.on('componentUUID-end', () => {
  console.log("All Done")
  eventEmitter.emit('exit');
});

module.exports = configure;
