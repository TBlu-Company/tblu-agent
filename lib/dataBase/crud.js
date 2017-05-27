'use strict'
const inset = (db, doc) => new Promise((resolve, reject) => {
  db.insert(doc, (err, newDoc) => {
    if (err) {
      logger.error(__filename, "inset", "Error inset - doc", doc);
      logger.error(__filename, "inset", "Error inset - err", err);
      reject(err);
    } else {
      resolve(newDoc);
    }
  });
});

const update = (db, query, update, options) => new Promise((resolve, reject) => {
  db.update(query, update, options, (err, data) => {
    if (err) {
      logger.error(__filename, "update", "Error update - query", query);
      logger.error(__filename, "update", "Error update - update", update);
      logger.error(__filename, "update", "Error update - options", options);
      logger.error(__filename, "update", "Error update - err", err);
      reject(err);
    } else {
      resolve(0);
    }
  });
});

const remove = (db, query, options) => new Promise((resolve, reject) => {
  db.remove(query, options, (err, data) => {
    if (err) {
      logger.error(__filename, "remove", "Error remove - query", query);
      logger.error(__filename, "remove", "Error remove - options", options);
      logger.error(__filename, "remove", "Error remove - err", err);
      reject(err);
    } else {
      resolve(0);
    }
  });
});

module.exports = {
  inset,
  update,
  remove
};
