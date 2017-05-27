'use strict'
const logger = require('../logger/logger');
const dbCrud = require('../dataBase/crud');
const rest = require('../rest/rest');
const npm = require('../npm/npm');

const updateStatus = (item, status) => new Promise((resolve, reject) => {
  logger.debug(__filename, "updateStatus", "item", item);
  logger.debug(__filename, "updateStatus", "status", status);
  let data = {
    component: item.component,
    metric: item.metric,
    account: global.properties.getCompanyUUID(),
    deploymentStatus: status
  };
  rest('updateDeploymentStatus', data).then(resutl => {
    resolve(true)
  }).catch(error => {
    reject(error)
  });
});

const insertMetric = (item) => new Promise(function(resolve, reject) {
  logger.debug(__filename, "insertMetric", "item", item);
  let query = {
    "metric": item.metric,
    "component": item.component,
  };
  let options = {
    multi: true
  };
  dbCrud.remove(global.properties.getDBmetrics(), query, options).then(result => {
    dbCrud.inset(global.properties.getDBmetrics(), item).then(result => {
      npm.install(item.npm).then(result => {
        updateStatus(item, 1).then(result => {
          resolve(item);
        }).catch((error) => {
          reject(error)
        });
      }).catch((error) => {
        reject(error)
      });
    }).catch((error) => {
      reject(error)
    });
  }).catch((error) => {
    reject(error)
  });
});

const removeMetric = (item) => new Promise(function(resolve, reject) {
  logger.debug(__filename, "insertMetric", "item", item);
  let query = {
    "metric": item.metric,
    "component": item.component,
  };
  let options = {
    multi: true
  };
  dbCrud.remove(global.properties.getDBmetrics(), query, options).then(result => {
    updateStatus(item, -2).then(result => {
      resolve(item);
    }).catch((error) => {
      reject(error)
    });
  }).catch((error) => {
    reject(error)
  });
});


const loadMetricInsert = () => new Promise((resolve, reject) => {
  let data = {
    component: global.properties.getComponentUUID(),
    account: global.properties.getCompanyUUID(),
  };
  if (typeof global.properties.getDataLastInsert() != 'undefined') {
    data['insertDate'] = global.properties.getDataLastInsert();
  }
  logger.debug(__filename, "loadMetricInsert", "Post Args", JSON.stringify(data));
  rest('getMetricInsert', data).then(resutl => {
    logger.debug(__filename, "loadMetricInsert", "rest", JSON.stringify(resutl));
    let actions = resutl.map(insertMetric);
    let results = Promise.all(actions);
    results.then(retorno => {
      logger.debug(__filename, "loadMetricInsert", "Promise All", retorno);
      let query = {
        name: "DateLastInsert"
      };
      let update = {
        name: "DateLastInsert",
        value: new Date().getTime()
      };
      let options = {
        upsert: true
      };
      dbCrud.update(global.properties.getDBconfig(), query, update, options).then(result => {
        global.properties.setDataLastInsert(update.value);
        // Retorna o Array de Itens para fazer o insert na Cron
        resolve(retorno);
      }).catch((error) => {
        reject(error)
      });
    }).catch((error) => {
      reject(error)
    });
  }).catch((error) => {
    reject(error)
  });
});

const loadMetricRemove = () => new Promise((resolve, reject) => {
  let data = {
    component: global.properties.getComponentUUID(),
    account: global.properties.getCompanyUUID(),
  };
  if (typeof global.properties.getDataLastRemove() != 'undefined') {
    data['disableDate'] = global.properties.getDataLastRemove();
  }
  logger.debug(__filename, "loadMetricRemove", "Post Args", JSON.stringify(data));
  rest('getMetricDisable', data).then(resutl => {
    logger.debug(__filename, "loadMetricRemove", "rest", JSON.stringify(resutl));
    let actions = resutl.map(removeMetric);
    let results = Promise.all(actions);
    results.then(retorno => {
      logger.debug(__filename, "loadMetricRemove", "Promise All", retorno);
      let query = {
        name: "DateLastRemove"
      };
      let update = {
        name: "DateLastRemove",
        value: new Date().getTime()
      };
      let options = {
        upsert: true
      };
      dbCrud.update(global.properties.getDBconfig(), query, update, options).then(result => {
        global.properties.setDataLastRemove(update.value);
        // Retorna o Array de Itens para fazer o stop na Cron
        resolve(retorno);
      }).catch((error) => {
        reject(error)
      });
    }).catch((error) => {
      reject(error)
    });
  }).catch((error) => {
    reject(error)
  });
});

module.exports = {
  loadMetricInsert,
  loadMetricRemove,
  updateStatus
};
