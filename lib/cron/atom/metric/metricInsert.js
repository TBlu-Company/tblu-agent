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
