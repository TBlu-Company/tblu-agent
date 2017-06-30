'use strict'
const Datastore = require('nedb');
const logger = require('../logger/logger');

const loadDBConfig = () => new Promise((resolve, reject) => {
  let dBconfig = new Datastore(global.properties.getAppDir() + '/data/config.db');
  dBconfig.persistence.setAutocompactionInterval(global.properties.getDBAutocompactionInterval());
  logger.debug(__filename, "loadDataBase", "dBconfig");
  dBconfig.loadDatabase((err) => {
    if (err) {
      reject(err);
    } else {
      global.properties.setDBconfig(dBconfig);
      resolve();
    }
  });
})

const loadDBMetrics = () => new Promise((resolve, reject) => {
  let dBmetrics = new Datastore(global.properties.getAppDir() + '/data/metrics.db');
  logger.debug(__filename, "loadDataBase", "dBmetrics");
  // dBmetrics.removeIndex('metric');
  dBmetrics.ensureIndex({
    fieldName: 'metric'
  }, function(err) {
    // If there was an error, err is not null
  });
  // dBmetrics.removeIndex('component');
  dBmetrics.ensureIndex({
    fieldName: 'component'
  }, function(err) {
    // If there was an error, err is not null
  });
  dBmetrics.persistence.compactDatafile();
  dBmetrics.persistence.setAutocompactionInterval(global.properties.getDBAutocompactionInterval());
  dBmetrics.loadDatabase((err) => {
    if (err) {
      reject(err);
    } else {
      global.properties.setDBmetrics(dBmetrics);
      resolve();
    }
  });
})

const loadDBGather = () => new Promise((resolve, reject) => {
  let dBgather = new Datastore(global.properties.getAppDir() + '/data/gather.db');
  logger.debug(__filename, "loadDataBase", "dBgather");
  dBgather.persistence.compactDatafile();
  dBgather.persistence.setAutocompactionInterval(global.properties.getDBAutocompactionInterval());
  dBgather.loadDatabase((err) => {
    if (err) {
      reject(err);
    } else {
      global.properties.setDBgather(dBgather);
      resolve();
    }
  });
})

const loadDBTemp = () => new Promise((resolve, reject) => {
  let dbTemp = new Datastore(global.properties.getAppDir() + '/data/dbTemp.db');
  logger.debug(__filename, "loadDataBase", "dbTemp");
  dbTemp.persistence.compactDatafile();
  dbTemp.persistence.setAutocompactionInterval(global.properties.getDBAutocompactionInterval());
  dbTemp.loadDatabase((err) => {
    if (err) {
      reject(err);
    } else {
      global.properties.setDBtemp(dbTemp);
      resolve();
    }
  });
})

const loadDatabase = () => new Promise((resolve, reject) => {
  Promise.all([loadDBConfig(), loadDBMetrics(), loadDBGather(), loadDBTemp()]).then(result => resolve(result)).catch(error => reject(error));
})

module.exports = loadDatabase;
