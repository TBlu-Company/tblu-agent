'use strict'

const logger = require('../logger/logger');

const eventEmitter = require('events');
class EmitterClass extends eventEmitter {}
const ctrlEmitter = new EmitterClass();

ctrlEmitter.on('error', (error) => {
  logger.error(__filename, "ctrlEmitter", "error", error);
  process.exit(0)
});

ctrlEmitter.on('exit', () => {
  logger.info(__filename, "ctrlEmitter", "exit");
  process.exit(0)
});

ctrlEmitter.on('loadMetricInsert', () => {
  console.log('loadMetricInsert');
  ctrlEmitter.emit('loadMetricInsert-end');
});

ctrlEmitter.on('loadMetricRemove', () => {
  console.log('loadMetricRemove');
  ctrlEmitter.emit('loadMetricRemove-end');
});

ctrlEmitter.on('StartCron', () => {
  console.log('StartCron');
  ctrlEmitter.emit('StartCron-end');
});


module.exports = ctrlEmitter;
