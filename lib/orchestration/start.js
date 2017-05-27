'use strict'
/*
 * Controla o fluxo de ativades para o parametro configure
 * OBS: nunca podem fazer importe de modulos NPM - Somente mandar eventos para o emiter
 */
const eventEmitter = require('../eventEmitter/eventEmitter');
const cronEmitter = require('../cron/cron');

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
  eventEmitter.emit('loadSendDBCronTime');
});

eventEmitter.on('loadSendDBCronTime-end', () => {
  eventEmitter.emit('loadDBSendDataOnExecute');
});

eventEmitter.on('loadDBSendDataOnExecute-end', () => {
  eventEmitter.emit('loadDBSendLimit');
});

eventEmitter.on('loadDBSendLimit-end', () => {
  eventEmitter.emit('loadDBDataLastInsert');
});

eventEmitter.on('loadDBDataLastInsert-end', () => {
  eventEmitter.emit('loadDBDataLastRemove');
});

eventEmitter.on('loadDBDataLastRemove-end', () => {
  cronEmitter.emit('loadMetricInsert');
});

cronEmitter.on('loadMetricInsert-end', () => {
  cronEmitter.emit('loadMetricRemove');
});

cronEmitter.on('loadMetricRemove-end', () => {
  cronEmitter.emit('StartCron');
});

cronEmitter.on('StartCron-end', () => {
  cronEmitter.emit('exit');
});


module.exports = appStart;
