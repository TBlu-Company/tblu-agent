'use strict'
const logger = require('../../logger/logger');
const crudDB = require('../../dataBase/crud');
const transmission = require('../../transmission/transmission');

const saveInDB = (item, status, coleta) => {
  let gather = {};
  let error = {};
  if (status) {
    gather = coleta;
  } else {
    error = coleta;
  };
  let doc = {
    component: item.component,
    metric: item.metric,
    gatherDate: new Date().getTime(),
    executeStatus: status,
    gather: gather,
    gatherError: error
  };
  logger.debug(__filename, "saveInDB", "init", JSON.stringify(doc));
  transmission.transmissionItem(doc).then((result) => {
    logger.debug(__filename, "transmissionItem", "Done", JSON.stringify(doc));
  }).catch((error) => {
    crudDB.insert(global.properties.getDBgather(), doc).then((result) => {
      logger.debug(__filename, "saveInDB", "doc", JSON.stringify(doc));
    }).catch((error) => {
      logger.error(__filename, "saveInDB", "Error", error);
    });
  })
};

module.exports = saveInDB;
