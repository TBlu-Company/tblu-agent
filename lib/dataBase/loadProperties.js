const Datastore = require('nedb');

const loadDBUpdateCronTime = () => new Promise((resolve, reject) => {
  global.properties.getDBconfig().findOne({
    name: 'UpdateCronTime'
  }).exec((err, doc) => {
    if (err) {
      reject(err);
    } else {
      if (doc == null) {
        let x = Math.floor((Math.random() * 59) + 1);
        let t = x + ' */10 * * * *';
        let data = {
          name: 'UpdateCronTime',
          value: t
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
      };
    };
  });
});

const loadSendDBCronTime = () => new Promise((resolve, reject) => {
  global.properties.getDBconfig().findOne({
    name: 'SendDBCronTime'
  }).exec((err, doc) => {
    if (err) {
      reject(err);
    } else {
      if (doc == null) {
        let x = Math.floor((Math.random() * 59) + 1);
        let t = x + ' */2 * * * *';
        let data = {
          name: 'SendDBCronTime',
          value: t
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
      };
    };
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
      };
    };
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
          value: 50
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
      };
    };
  });
});

//dataLastInsert e remove não inserem nada caso o documento estaja nulo
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
      };
    };
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
      };
    };
  });
});

module.exports = {
  loadDBUpdateCronTime,
  loadDBSendDataOnExecute,
  loadDBSendLimit,
  loadDBLastInsert,
  loadDBLastRemove,
  loadSendDBCronTime,
};
