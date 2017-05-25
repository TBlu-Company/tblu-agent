'use strict'

const dBconfigSave = (doc) => new Promise((resolve, reject) => {
  global.properties.getDBconfig().insert(doc, (err, newDoc) => {
    if (err) {
      logger.error(__filename, "dBconfigSave", "Error save doc", err);
      reject(err);
    } else {
      resolve(newDoc);
    }
  });
});

module.exports = dBconfigSave;
