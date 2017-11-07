const loadDBUpdateCronTime = () => new Promise((resolve, reject) => {
  global.properties.getDBconfig().findOne({
    name: 'UpdateCronTime'
  }).exec((err, doc) => {
    if (err) {
      reject(err);
    } else {
      if (doc == null) {
        let data = {
          name: 'UpdateCronTime',
          value: '*/10 * * * *'
        };
        global.properties.setUpdateCronTime(data.value);
        global.properties.getDBconfig().insert(data, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      } else {
        global.properties.setUpdateCronTime(doc.value);
        resolve(true);
      }
    }
  });
});

const loadDBSendDBCronTime = () => new Promise((resolve, reject) => {
  global.properties.getDBconfig().findOne({
    name: 'SendDBCronTime'
  }).exec((err, doc) => {
    if (err) {
      reject(err);
    } else {
      if (doc == null) {
        let data = {
          name: 'SendDBCronTime',
          value: '*/2 * * * *'
        };
        global.properties.setSendDBCronTime(data.value);
        global.properties.getDBconfig().insert(data, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      } else {
        global.properties.setSendDBCronTime(doc.value);
        resolve(true);
      }
    }
  });
});

const loadDBSendDataOnExecute = () => new Promise((resolve, reject) => {
  global.properties.getDBconfig().findOne({
    name: 'SendDataOnExecute'
  }).exec((err, doc) => {
    if (err) {
      reject(err);
    } else {
      if (doc == null) {
        let data = {
          name: 'SendDataOnExecute',
          value: true
        };
        global.properties.setSendDataOnExecute(data.value);
        global.properties.getDBconfig().insert(data, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      } else {
        global.properties.setSendDataOnExecute(doc.value);
        resolve(true);
      }
    }
  });
});
const loadDBSendLimit = () => new Promise((resolve, reject) => {
  global.properties.getDBconfig().findOne({
    name: 'SendLimit'
  }).exec((err, doc) => {
    if (err) {
      reject(err);
    } else {
      if (doc == null) {
        let data = {
          name: 'SendLimit',
          value: 5
        };
        global.properties.setSendLimit(data.value);
        global.properties.getDBconfig().insert(data, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      } else {
        global.properties.setSendLimit(doc.value);
        resolve(true);
      }
    }
  });
});


const loadDBLoggerLevel = () => new Promise((resolve, reject) => {
  global.properties.getDBconfig().findOne({
    name: 'loggerLevel'
  }).exec((err, doc) => {
    if (err) {
      reject(err);
    } else {
      if (doc == null) {
        let data = {
          name: 'loggerLevel',
          value: 'info'
        };
        global.properties.setLoggerLevel(data.value);
        global.properties.getDBconfig().insert(data, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      } else {
        global.properties.setLoggerLevel(doc.value);
        if (doc.value.toLowerCase() === 'debug') {
          let logger = require('../logger/logger');
          logger.reCreat(__filename, 'loadDBLoggerLevel');
        }
        resolve(true);
      }
    }
  });
});

// dataLastInsert e remove não inserem nada caso o documento estaja nulo
const loadDBLastInsert = () => new Promise((resolve, reject) => {
  global.properties.getDBconfig().findOne({
    name: 'DateLastInsert'
  }).exec((err, doc) => {
    if (err) {
      reject(err);
    } else {
      if (doc == null) {
        resolve(true);
      } else {
        global.properties.setDataLastInsert(doc.value);
        resolve(true);
      }
    }
  });
});

const loadDBLastRemove = () => new Promise((resolve, reject) => {
  global.properties.getDBconfig().findOne({
    name: 'DateLastRemove'
  }).exec((err, doc) => {
    if (err) {
      reject(err);
    } else {
      if (doc == null) {
        resolve(true);
      } else {
        global.properties.setDataLastRemove(doc.value);
        resolve(true);
      }
    }
  });
});

module.exports = {
  loadDBUpdateCronTime,
  loadDBSendDataOnExecute,
  loadDBSendLimit,
  loadDBLastInsert,
  loadDBLastRemove,
  loadDBLoggerLevel,
  loadDBSendDBCronTime
};
