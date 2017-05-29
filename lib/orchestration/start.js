'use strict'
/*
 * Controla o fluxo de ativades para o parametro configure
 * OBS: nunca podem fazer importe de modulos NPM - Somente mandar eventos para o emiter
 */
const eventEmitter = require('../eventEmitter/eventEmitter');

const appStart = () => {
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
  eventEmitter.emit('loadDBUpdateCronTime');
});

eventEmitter.on('loadDBUpdateCronTime-end', () => {
  eventEmitter.emit('loadDBSendDBCronTime');
});

eventEmitter.on('loadDBSendDBCronTime-end', () => {
  eventEmitter.emit('loadDBSendDataOnExecute');
});

eventEmitter.on('loadDBSendDataOnExecute-end', () => {
  eventEmitter.emit('loadDBSendLimit');
});

eventEmitter.on('loadDBSendLimit-end', () => {
  eventEmitter.emit('loadDBLoggerLevel');
});

eventEmitter.on('loadDBLoggerLevel-end', () => {
  eventEmitter.emit('loadDBDataLastInsert');
});

eventEmitter.on('loadDBDataLastInsert-end', () => {
  eventEmitter.emit('loadDBDataLastRemove');
});

eventEmitter.on('loadDBDataLastRemove-end', () => {
  eventEmitter.emit('loadMetricInsert');
});

eventEmitter.on('loadMetricInsert-end', () => {
  eventEmitter.emit('loadMetricRemove');
});

eventEmitter.on('loadMetricRemove-end', () => {
  eventEmitter.emit('cronStartAll');
});

module.exports = appStart;
