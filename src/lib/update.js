'use strict'
const npm = require("npm-programmatic");
const logger = require('../logger/logger.js');
const rest = require('../rest/rest.js');
const cron = require('./cron.js');

// Inicio Passo 3
let dBconfig = null;
let dirname = null;
let dBmetrics = null;

const setGlobal = (dBconfigG, dirnameG, dBmetricsG) => {
  dBconfig = dBconfigG;
  dirname = dirnameG;
  dBmetrics = dBmetricsG;
};

// Ler Update
const updateStatus = (item, status) => new Promise((resolve, reject) => {
  logger.debug(__filename, "updateStatus", "Init");
  dBconfig.findOne({
    name: 'AccountUID'
  }).exec(function(err, doc) {
    if (err || doc == null) {
      logger.error(__filename, "updateStatus", "Cant read AccountUID");
      reject(err);
    } else {
      let accountUID = doc.value;
      let bdata = {
        component: item.component,
        metric: item.metric,
        account: accountUID,
        deploymentStatus: status
      };
      rest('updateDeploymentStatus', bdata).then(resutl => {
        resolve(0)
      }).catch(error => {
        reject(error)
      });
    };
  });
});

const insertMetric = (item) => new Promise(function(resolve, reject) {
  logger.debug(__filename, "insertMetric", "Init");
  dBmetrics.remove({
    "metric": item.metric,
    "component": item.component,
  }, {
    multi: true
  }, function(err, numRemoved) {
    if (err) {
      logger.error(__filename, "insertMetric", "Error ao remover duplicadas", err);
      reject(err);
    } else {
      dBmetrics.insert(item, function(err, newDoc) {
        if (err) {
          logger.error(__filename, "insertMetric", "Error ao inserir metric", err);
          reject(err);
        } else {
          logger.debug(__filename, "insertMetric", "Metrica inserida", newDoc);
          resolve(0);
        }
      });
    }
  });
});

const disableMetric = (item) => new Promise(function(resolve, reject) {
  logger.debug(__filename, "disableMetric", "Init");
  dBmetrics.remove({
    "metric": item.metric,
    "component": item.component,
  }, {
    multi: true
  }, function(err, numRemoved) {
    if (err) {
      logger.error(__filename, "insertMetric", "Error ao remover duplicadas", err);
      reject(err);
    } else {
      logger.debug(__filename, "disableMetric", "Disable", item);
      resolve(0);
    }
  });
});

const installNPM = (item) => new Promise((resolve, reject) => {
  logger.debug(__filename, "installNPM", "Init");
  try {
    let test = require.resolve(item.npm);
    logger.debug(__filename, "installNPM", "module exist:", item.npm);
    resolve(0);
  } catch (e) {
    npm.install(item.npm, {
      cwd: item.dirname || dirname,
      global: false,
      save: true,
      output: false
    }).then(function() {
      logger.debug(__filename, "installNPM", "module installed:", item.npm);
      resolve(0)
    }).catch(function(err) {
      logger.debug(__filename, "installNPM", "It was not possible to install the module:", item.npm);
      reject('Erro install : ' + item.npm);
    });
  };
});




const processInsert = (item) => new Promise((resolve, reject) => {
  logger.debug(__filename, "processInsert", "Init");
  insertMetric(item).then(() => {
    return installNPM(item);
  }).then(() => {
    return updateStatus(item, 1);
  }).then(() => {
    return cron.startCronItem(item);
  }).then(() => {
    resolve(0);
  }).catch(error => {
    reject(error)
  });
});

const processDisable = (item) => new Promise((resolve, reject) => {
  logger.debug(__filename, "processDisable", "Init");
  disableMetric(item).then(() => {
    return updateStatus(item, -2);
  }).then(() => {
    return cron.stopCromItem(item);
  }).then(() => {
    resolve(0);
  }).catch(error => {
    reject(error)
  });
});


const readInsert = () => new Promise((resolve, reject) => {
  logger.debug(__filename, "readInsert", "Init");
  dBconfig.findOne({
    name: 'AccountUID'
  }).exec(function(err, doc1) {
    if (err || doc1 == null) {
      logger.error(__filename, "readInsert", "Cant read AccountUID");
      reject(err);
    } else {
      dBconfig.findOne({
        name: 'ComponentUID'
      }).exec(function(err, doc2) {
        if (err || doc2 == null) {
          logger.error(__filename, "readInsert", "Cant read ComponentUID");
          reject(err);
        } else {
          dBconfig.findOne({
            name: 'DateLastInsert'
          }).exec(function(err, doc3) {
            if (err) {
              logger.error(__filename, "readInsert", "Cant read DateLastInsert");
              reject(err);
            } else {
              let bdata = {
                component: doc2.value,
                account: doc1.value
              };
              if (doc3 != null) {
                bdata['insertDate'] = doc3.value;
              };
              logger.debug(__filename, "readInsert", "Post Args", JSON.stringify(bdata));
              rest('getMetricInsert', bdata).then(resutl => {
                logger.debug(__filename, "readInsert", "rest", JSON.stringify(resutl));
                let actions = resutl.map(processInsert);
                let results = Promise.all(actions);
                results.then(retorno => {
                  logger.debug(__filename, "readInsert", "Promise All", retorno);
                  let d = new Date().getTime();
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
                  dBconfig.update(query, update, options, (err, data) => {
                    if (err) {
                      reject(err);
                    } else {
                      dBmetrics.persistence.compactDatafile();
                      dBconfig.persistence.compactDatafile();
                      resolve(0);
                    }

                  });
                }).catch(error => reject(error));
              }).catch(error => {
                logger.error(__filename, "readInsert", "Not Read Insert", JSON.stringify(error.statusCode) + " - " + error.data);
                reject(error);
              });

            };
          });
        };
      });
    };
  });
});


const readDisable = () => new Promise((resolve, reject) => {
  logger.debug(__filename, "readDisable", "Init");
  dBconfig.findOne({
    name: 'AccountUID'
  }).exec(function(err, doc1) {
    if (err || doc1 == null) {
      logger.error(__filename, "readDisable", "Cant read AccountUID");
      reject(err);
    } else {
      dBconfig.findOne({
        name: 'ComponentUID'
      }).exec(function(err, doc2) {
        if (err || doc2 == null) {
          logger.error(__filename, "readDisable", "Cant read ComponentUID");
          reject(err);
        } else {
          dBconfig.findOne({
            name: 'DateLastDisable'
          }).exec(function(err, doc3) {
            if (err) {
              logger.error(__filename, "readDisable", "Cant read DateLastDisable");
              reject(err);
            } else {
              logger.debug(__filename, "readDisable", "DateLastDisable", JSON.stringify(doc3));
              let bdata = {
                component: doc2.value,
                account: doc1.value
              };
              if (doc3 != null) {
                bdata['disableDate'] = doc3.value;
              };
              logger.debug(__filename, "readDisable", "Post Args", JSON.stringify(bdata));
              rest('getMetricDisable', bdata).then(resutl => {
                logger.debug(__filename, "readDisable", "rest", JSON.stringify(resutl));
                let actions = resutl.map(processDisable);
                let results = Promise.all(actions);
                results.then(retorno => {
                  logger.debug(__filename, "readDisable", "Promise All", retorno);

                  let d = new Date().getTime();
                  let query = {
                    name: "DateLastDisable"
                  };

                  let update = {
                    name: "DateLastDisable",
                    value: d
                  };
                  let options = {
                    upsert: true
                  };
                  dBconfig.update(query, update, options, (err, data) => {
                    if (err) {
                      reject(err);
                    } else {
                      dBmetrics.persistence.compactDatafile();
                      dBconfig.persistence.compactDatafile();
                      resolve(0);
                    }

                  });

                }).catch(error => reject(error));
              }).catch(error => {
                logger.error(__filename, "readDisable", "Not Read Disable", JSON.stringify(error));
                reject(error);
              });
            };
          });
        };
      });
    };
  });
});

const readUpdates = () => new Promise((resolve, reject) => {
  logger.debug(__filename, "readUpdates", "Init");
  readInsert().then(() => {
    readDisable().then(result => resolve(result)).catch((error) => resolve(error));
  }).catch((error) => resolve(error));
});
// Fim Passo 3

module.exports = {
  setGlobal,
  readUpdates,
  installNPM
};
