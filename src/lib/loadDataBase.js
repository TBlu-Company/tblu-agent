'use strict'
const path = require('path');
const filename = path.basename(__filename);
const Datastore = require('nedb')
const logger = require('../logger/logger.js');

const dbAutocompactionInterval = 10000;

const loadDataBase = (dirname) => new Promise((resolve, reject) => {
  let dBconfig = new Datastore(dirname + '/data/config.db');
  logger.debug(__filename, "loadDataBase", "dBconfig");
  dBconfig.loadDatabase();
  dBconfig.persistence.setAutocompactionInterval(dbAutocompactionInterval);
  let dBmetrics = new Datastore(dirname + '/data/metrics.db');
  logger.debug(__filename, "loadDataBase", "dBmetrics");
  dBmetrics.loadDatabase();
  dBmetrics.removeIndex('metric');
  dBmetrics.ensureIndex({
    fieldName: 'metric'
  }, function(err) {
    // If there was an error, err is not null
  });
  dBmetrics.removeIndex('component');
  dBmetrics.ensureIndex({
    fieldName: 'component'
  }, function(err) {
    // If there was an error, err is not null
  });
  dBmetrics.persistence.compactDatafile();
  dBmetrics.persistence.setAutocompactionInterval(dbAutocompactionInterval);
  let dBgather = new Datastore(dirname + '/data/gather.db');
  logger.debug(__filename, "loadDataBase", "dBgather");
  dBgather.loadDatabase();
  dBgather.persistence.compactDatafile();
  dBgather.persistence.setAutocompactionInterval(dbAutocompactionInterval);
  resolve([dBconfig, dBmetrics, dBgather]);
});

module.exports = loadDataBase;
