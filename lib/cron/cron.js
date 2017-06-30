'use strict'

const logger = require('../logger/logger');
const schedule = require('node-schedule');
const crudDB = require('../dataBase/crud')
const executeItemCron = require('./atom/executeItemCron')
const eventEmitter = require('events');
class EmitterClass extends eventEmitter {}
const cronEmitter = new EmitterClass();
const cronIntes = {};

// Sample Item
// item = {
//   "component": "ffd2ea84-c09f-4835-9285-ea8393c89036",
//   "metric": "a9ee05b3-b78f-4f5b-b05d-5f5fbf71c384",
//   "npm": "tblu-a-so-linux",
//   "moduleFunction": "mLinuxCPUInfo",
//   "noExecuteOnInstall": false,
//   "periodicity": "10 23 * * *",
//   "parameters": {},
//   "_id": "tsBBlFIOwYAjlKsn"
// }

cronEmitter.on('executeItemCron', (item) => {
  logger.debug(__filename, "executeItemCron", "item", item);
  executeItemCron(cronEmitter, item);
});

cronEmitter.on('includeItemCron', (item, newItem) => {
  logger.debug(__filename, "includeItemCron", "item", item);
  logger.debug(__filename, "includeItemCron", "newItem", newItem);
  if (newItem && !item.noExecuteOnInstall) {
    cronEmitter.emit('executeItemCron', item);
  }
  let t = Math.floor((Math.random() * 59) + 1) + ' ' + item.periodicity;
  let jobName = item.component + '_' + item.metric;
  cronIntes[jobName] = schedule.scheduleJob(t, function() {
    cronEmitter.emit('executeItemCron', item);
  });
});

cronEmitter.on('removeItemCron', (item) => {
  logger.debug(__filename, "removeItemCron", "item", item);
  logger.debug(__filename, "removeItemCron", "Jobs Size", Object.keys(cronIntes).length);
  let jobName = item.component + '_' + item.metric;
  let job = cronIntes[jobName];
  if (typeof job != 'undefined') {
    logger.debug(__filename, "removeItemCron", "Stop Job", jobName);
    job.cancel();
    delete cronIntes[jobName];
  };
  logger.debug(__filename, "removeItemCron", "Jobs Size", Object.keys(cronIntes).length);
});

cronEmitter.on('loadCronSend', () => {
  logger.debug(__filename, "loadCronSend", "init");
  let cronSendItem = {
    component: global.properties.getComponentUUID(),
    metric: "cronSendItem",
    npm: "internal",
    moduleFunction: "cronSendItem",
    noExecuteOnInstall: false,
    periodicity: global.properties.getSendDBCronTime(),
  }
  cronEmitter.emit('includeItemCron', cronSendItem, true);
  cronEmitter.emit('loadCronSend-end');
});

cronEmitter.on('loadCronUpdate', () => {
  logger.debug(__filename, "loadCronUpdate", "init");
  let cronUpdateItem = {
    component: global.properties.getComponentUUID(),
    metric: "cronUpdateItem",
    npm: "internal",
    moduleFunction: "cronUpdateItem",
    noExecuteOnInstall: false,
    periodicity: global.properties.getUpdateCronTime(),
  }
  cronEmitter.emit('includeItemCron', cronUpdateItem, false);
  cronEmitter.emit('loadCronUpdate-end');
});

cronEmitter.on('loadCronDBAllItens', () => {
  logger.debug(__filename, "loadCronDBAllItens", "init");
  crudDB.find(global.properties.getDBmetrics(), {}).then((result) => {
    result.map((item) => {
      cronEmitter.emit('includeItemCron', item, item.newItem);
    });
  }).catch((error) => {
    cronEmitter.emit('error', error);
  });
  cronEmitter.emit('loadCronDBAllItens-end');
});

cronEmitter.on('startAll', () => {
  logger.info(__filename, "Iniciando as Crons", "init");
  cronEmitter.emit('loadCronSend');
  cronEmitter.emit('loadCronUpdate');
  cronEmitter.emit('loadCronDBAllItens');
});

cronEmitter.on('stopAll', () => {
  logger.debug(__filename, "stopAll", "init");
  let controle = Object.keys(cronIntes).length;
  logger.debug(__filename, "stopAll", "cron size", controle);
  for (let key in cronIntes) {
    logger.debug(__filename, "stopCron", "cron", key);
    cronIntes[key].cancel();
    delete cronIntes[key];
    controle -= 1;
    if (controle <= 0) {
      cronEmitter.emit('exit');
    }
  };
});

// Default
cronEmitter.on('error', (error) => {
  logger.error(__filename, "error", "error", error);
  process.exit(0)
});

cronEmitter.on('exit', () => {
  logger.info(__filename, "exit", "cronIntes", Object.keys(cronIntes).length);
  logger.info(__filename, "exit", "exit");
  process.exit(0)
});

process.on('SIGINT', () => {
  logger.info(__filename, "SIGINT", "Desligando o sistema ");
  cronEmitter.emit('stopAll');
});

module.exports = cronEmitter;
