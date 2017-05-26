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
  eventEmitter.emit('LoadDBUpdateCronTime');
});

eventEmitter.on('LoadDBUpdateCronTime-end', () => {
  eventEmitter.emit('LoadDBSendDataOnExecute');
});

eventEmitter.on('LoadDBSendDataOnExecute-end', () => {
  eventEmitter.emit('LoadDBSendLimit');
});

eventEmitter.on('LoadDBSendLimit-end', () => {
  eventEmitter.emit('LoadDBLastInsert');
});

eventEmitter.on('LoadDBLastInsert-end', () => {
  eventEmitter.emit('LoadDBLastRemove');
});

eventEmitter.on('LoadDBLastRemove-end', () => {
  eventEmitter.emit('LoadMetricInsert');
});

eventEmitter.on('LoadMetricInsert-end', () => {
  eventEmitter.emit('LoadMetricRemove');
});

eventEmitter.on('LoadMetricRemove-end', () => {
  eventEmitter.emit('StartCron');
});

eventEmitter.on('StartCron-end', () => {
  eventEmitter.emit('exit');
});


module.exports = appStart;
