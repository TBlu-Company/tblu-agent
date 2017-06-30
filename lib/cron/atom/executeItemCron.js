'use strict'
const logger = require('../../logger/logger');
const saveInDB = require('./saveInDB')
const metric = require('../../metric/metric');
const transmission = require('../../transmission/transmission');
const npm = require('../../npm/npm');
const dbCrud = require('../../dataBase/crud');

const cronSendItem = () => {
  transmission.transmissionAll().then((result) => {
    logger.debug(__filename, "cronSendItem", "done");
  }).catch((error) => {
    logger.error(__filename, "cronSendItem", "Transmission Error", error);
  });
};

const cronUpdateItem = (cron) => {
  logger.debug(__filename, "cronUpdateItem", "init");
  metric.loadMetricInsert().then((resultInsert) => {
    if (resultInsert.length > 0) {
      resultInsert.map((item) => {
        cron.emit('includeItemCron', item, true);
      });
    };
    metric.loadMetricRemove().then((resultRemove) => {
      if (resultRemove.length > 0) {
        resultRemove.map((item) => {
          cron.emit('removeItemCron', item);
        });
      };
      logger.debug(__filename, "cronUpdateItem", "done");
    }).catch((error) => {
      logger.error(__filename, "cronUpdateItem", "Error loadMetricRemove", error);
    });
  }).catch((error) => {
    logger.error(__filename, "cronUpdateItem", "Error loadMetricInsert", error);
  });

};
const tbluAgentVersion = (item) => {
  saveInDB(item, true, {
    tbluAgentVersion: global.properties.getAgentVersion()
  });
};

const executeItemInternal = (cron, item) => {
  switch (item.moduleFunction) {
    case 'cronSendItem':
      cronSendItem();
      break;
    case 'cronUpdateItem':
      cronUpdateItem(cron);
      break;
    case 'tbluAgentVersion':
      tbluAgentVersion(item);
      break;
  }
};

const executeItemNPM = (cron, item) => {
  try {
    let mod = require(item.npm);
    mod.run(item, global.properties.getDBtemp()).then(result => {
      try {
        saveInDB(item, true, JSON.parse(JSON.stringify(result)));
      } catch (e) {
        logger.error(__filename, "executeItemNPM", "Error on execute item: " + item.component + '_' + item.metric, e);
      }

    }).catch((error) => {
      try {
        logger.error(__filename, "executeItemNPM", "Item Result Error: " + item.component + '_' + item.metric, error);
        let temp = {};
        if (error instanceof Error) {
          temp['name'] = error.name;
          temp['message'] = error.message;
          temp['fileName'] = error.fileName;
          temp['lineNumber'] = error.lineNumber;
          temp['stack'] = error.stack;
        } else {
          temp = error;
        }
        saveInDB(item, false, JSON.parse(JSON.stringify(temp)));
      } catch (e) {
        logger.error(__filename, "executeItemNPM", "Item Result Error: " + item.component + '_' + item.metric, e);
      }
    });
  } catch (e) {
    if (typeof e.message != 'undefined') {
      if (e.message.includes('Cannot find module')) {
        npm.install(item.npm).then((result) => {
          executeItemNPM(cron, item);
        }).catch((error) => {
          logger.error(__filename, "executeItemNPM", "item", JSON.stringify(item));
          logger.error(__filename, "executeItemNPM", "Error", e);
        });
      } else {
        logger.error(__filename, "executeItemNPM", "item", JSON.stringify(item));
        logger.error(__filename, "executeItemNPM", "Error", e);
      };
    } else {
      logger.error(__filename, "executeItemNPM", "item", JSON.stringify(item));
      logger.error(__filename, "executeItemNPM", "Error", e);
    };
  };
};

const executeItemCron = (cron, item) => {
  if (item.newItem) {
    let query = {
      _id: item._id
    };
    let update = {
      $set: {
        newItem: false,
      }
    };
    let options = {};
    dbCrud.update(global.properties.getDBmetrics(), query, update, options).then(result => {
      logger.debug(__filename, "executeItemCron", JSON.stringify(result));
    });
  };
  if (item.npm == 'internal') {
    executeItemInternal(cron, item);
  } else {
    executeItemNPM(cron, item);
  }
};

module.exports = executeItemCron;
