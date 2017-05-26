const Datastore = require('nedb');

const LoadDBUpdateCronTime = () => new Promise((resolve, reject) => {
  resolve(true);
});
const LoadDBSendDataOnExecute = () => new Promise((resolve, reject) => {
  resolve(true);
});
const LoadDBSendLimit = () => new Promise((resolve, reject) => {
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
const LoadDBLastInsert = () => new Promise((resolve, reject) => {
  resolve(true);
});
const LoadDBLastRemove = () => new Promise((resolve, reject) => {
  resolve(true);
});

module.exports = {
  LoadDBUpdateCronTime,
  LoadDBSendDataOnExecute,
  LoadDBSendLimit,
  LoadDBLastInsert,
  LoadDBLastRemove,
};
