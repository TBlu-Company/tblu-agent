'use strict';
/*
 * Controla o fluxo de ativades para o parametro service
 * OBS: nunca podem fazer importe de modulos NPM - Somente mandar eventos para o emiter
 */
const eventEmitter = require('../../eventEmitter/eventEmitter');


let serviceInstall = () => {
  eventEmitter.emit('superUserValidation');
};

eventEmitter.on('superUserValidation-end', () => {
  eventEmitter.emit('createUserGroup');
});

eventEmitter.on('createUserGroup-end', () => {
  eventEmitter.emit('findOracleHome');
});

eventEmitter.on('findOracleHome-end', () => {
  eventEmitter.emit('mkdirApp');
});

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
  eventEmitter.emit('installService');
});
eventEmitter.on('installService-end', () => {
  eventEmitter.emit('changePermission');
  // eventEmitter.emit('changePermission-end');
});

eventEmitter.on('changePermission-end', () => {
  eventEmitter.emit('exit');
});

module.exports = serviceInstall;
