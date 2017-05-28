'use strict'
const dbCrud = require('../dataBase/crud')
const logger = require('../logger/logger');
const rest = require('../rest/rest');

const transmissionSendData = (data) => new Promise((resolve, reject) => {
  rest('addGather', data).then((result) => {
    resolve(result)
  }).catch((error) => {
    reject(error);
  });
});

const transmissionItem = (gather) => new Promise((resolve, reject) => {
  if (!global.properties.getSendDataOnExecute()) {
    reject(false);
  } else {
    gather['account'] = global.properties.getCompanyUUID();
    let data = [];
    data.push(gather);
    transmissionSendData(data).then((result) => {
      resolve(result)
    }).catch((error) => {
      reject(error);
    });
  };
})


const deleteDoc = (doc) => new Promise((resolve, reject) => {
  let query = {
    _id: doc._id
  };
  let options = {};
  dbCrud.remove(global.properties.getDBgather(), query, options).then(result => {
    logger.debug(__filename, "deleteDoc", "Delete Done", doc._id);
    resolve(result);
  }).catch((error) => {
    reject(error);
  });
});

const sendDBData = (skip, limit) => new Promise((resolve, reject) => {
  logger.debug(__filename, "sendDBData", "skip", skip.toString());
  logger.debug(__filename, "sendDBData", "limit", limit.toString());
  let db = global.properties.getDBgather();
  db.find({}).skip(skip).limit(limit).exec((err, docs) => {
    if (err) {
      logger.error(__filename, "sendDBData", "Erro read data", err);
      reject(err);
    } else {
      let data = JSON.parse(JSON.stringify(docs));
      data.forEach(e => {
        e['account'] = global.properties.getCompanyUUID();
        delete e['_id'];
      });
      transmissionSendData(data).then((result) => {
        let actions = docs.map(deleteDoc);
        Promise.all(actions).then((result) => {
          logger.debug(__filename, "sendDBData", "result", result);
          resolve(true);
        }).catch((error) => {
          logger.error(__filename, "sendDBData", "Error", error);
          reject(error);
        });
      }).catch((error) => {
        reject(error);
      });
    }
  });
});

const transmissionAll = () => new Promise((resolve, reject) => {
  let sendDBLimit = global.properties.getSendLimit();
  dbCrud.count(global.properties.getDBgather(), {}).then((result) => {
    logger.debug(__filename, "transmissionAll", "Total Gather", result);
    logger.debug(__filename, "transmissionAll", "sendDBLimit", sendDBLimit);
    let loop = Math.floor(result / sendDBLimit);
    logger.debug(__filename, "transmissionAll", "loop", loop);
    let array_p = [];
    for (let i = 0; i <= loop; i++) {
      let skip = i * sendDBLimit;
      logger.debug(__filename, "transmissionAll", "skip", skip.toString());
      array_p.push(sendDBData(skip, sendDBLimit));
    };
    let pAll = Promise.all(array_p);
    pAll.then((result) => {
      logger.debug(__filename, "transmissionAll", "Promise.all - Result", result);
      let db = global.properties.getDBgather();
      db.persistence.compactDatafile();
      resolve(true);
    }).catch((error) => {
      logger.error(__filename, "transmissionAll", "Promise.all - Error", error);
      reject(error);
    });
  }).catch((error) => {
    reject(error);
  });
});
//
module.exports = {
  transmissionItem,
  transmissionAll,
};
