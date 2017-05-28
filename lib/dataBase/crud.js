'use strict'
const insert = (db, doc) => new Promise((resolve, reject) => {
  db.insert(doc, (err, newDoc) => {
    if (err) {
      logger.error(__filename, "insert", "Error insert - doc", doc);
      logger.error(__filename, "insert", "Error insert - err", err);
      reject(err);
    } else {
      resolve(newDoc);
    }
  });
});

const find = (db, query) => new Promise((resolve, reject) => {
  db.find(query, (err, doc) => {
    if (err) {
      logger.error(__filename, "find", "Error find - err", err);
      reject(err);
    } else {
      resolve(doc);
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
      resolve(data);
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

const count = (db, query) => new Promise((resolve, reject) => {
  db.count(query, (err, data) => {
    if (err) {
      logger.error(__filename, "count", "Error count - query", query);
      logger.error(__filename, "count", "Error count - err", err);
      reject(err);
    } else {
      resolve(data);
    }
  });
});

module.exports = {
  insert,
  update,
  remove,
  find,
  count
};
