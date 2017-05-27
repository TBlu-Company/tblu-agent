const logger = require('../../../logger/logger');
const dbCrud = require('../../../dataBase/crud');

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
    let actions = resutl.map(processInsert);
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
      dbCrud.update(query, update, options).then(result => {
        global.properties.setDataLastInsert(update.value);
        resolve(retorno);
      }).catch(error => reject(error));
    }).catch(error => reject(error));
  });
});

module.exports = loadMetricInsert;
