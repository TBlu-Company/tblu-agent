'use strict'
/*
 * Cria todos os eventos do sistema
 */

/*
Importes
*/
const logger = require('../logger/logger');
const helper = require('../helper/help');
const mkdir = require('../mkdir/mkdir');
const dataBase = require('../dataBase/dataBase');
const readUUID = require('../readUUID/readUUID');
const superUserValidation = require('../validaSuperUser/validaSuperUser');
const usergroup = require('../usergroup/usergroup');
const changePermission = require('../changePermission/changePermission');
const oracleHome = require('../oracleHome/oracleHome');
const services = require('../services/services');
const dbloadProperties = require('../dataBase/loadProperties');
const cron = require('../cron/cron');
const metric = require('../metric/metric');


/*
Construtor do evento
*/
const eventEmitter = require('events');
class EmitterClass extends eventEmitter {}
const ctrlEmitter = new EmitterClass();

ctrlEmitter.on('error', (error) => {
  logger.error(__filename, "ctrlEmitter", "error", error);
  process.exit(0)
});

ctrlEmitter.on('exit', () => {
  logger.info(__filename, "ctrlEmitter", "exit");
  process.exit(0)
});

ctrlEmitter.on('helper', () => {
  helper();
});

ctrlEmitter.on('mkdirApp', () => {
  mkdir.mkdirApp().then(() => {
    ctrlEmitter.emit('mkdirApp-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('carregaDB', () => {
  logger.debug(__filename, "ctrlEmitter", "carregaDB");
  dataBase().then(() => {
    ctrlEmitter.emit('carregaDB-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('companyUUID', () => {
  logger.debug(__filename, "ctrlEmitter", "companyUUID");
  readUUID.readCompanyUUID().then(() => {
    ctrlEmitter.emit('companyUUID-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('componentUUID', () => {
  logger.debug(__filename, "ctrlEmitter", "componentUUID");
  readUUID.readComponentUUID().then(() => {
    ctrlEmitter.emit('componentUUID-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('superUserValidation', () => {
  superUserValidation().then(() => {
    ctrlEmitter.emit('superUserValidation-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('createUserGroup', () => {
  usergroup.userGroup().then(() => {
    ctrlEmitter.emit('createUserGroup-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('findOracleHome', () => {
  oracleHome().then(() => {
    ctrlEmitter.emit('findOracleHome-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  })
});

ctrlEmitter.on('changePermission', () => {
  changePermission().then(() => {
    ctrlEmitter.emit('changePermission-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('installService', () => {
  services.install().then(() => {
    ctrlEmitter.emit('installService-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('loadDBUpdateCronTime', () => {
  logger.debug(__filename, "ctrlEmitter", "loadDBUpdateCronTime");
  dbloadProperties.loadDBUpdateCronTime().then(() => {
    ctrlEmitter.emit('loadDBUpdateCronTime-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('loadSendDBCronTime', () => {
  logger.debug(__filename, "ctrlEmitter", "loadSendDBCronTime");
  dbloadProperties.loadSendDBCronTime().then(() => {
    ctrlEmitter.emit('loadSendDBCronTime-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('loadDBSendDataOnExecute', () => {
  logger.debug(__filename, "ctrlEmitter", "loadDBSendDataOnExecute");
  dbloadProperties.loadDBSendDataOnExecute().then(() => {
    ctrlEmitter.emit('loadDBSendDataOnExecute-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('loadDBSendLimit', () => {
  logger.debug(__filename, "ctrlEmitter", "loadDBSendLimit");
  dbloadProperties.loadDBSendLimit().then(() => {
    ctrlEmitter.emit('loadDBSendLimit-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('loadDBDataLastInsert', () => {
  logger.debug(__filename, "ctrlEmitter", "loadDBDataLastInsert");
  dbloadProperties.loadDBLastInsert().then(() => {
    ctrlEmitter.emit('loadDBDataLastInsert-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('loadDBDataLastRemove', () => {
  logger.debug(__filename, "ctrlEmitter", "loadDBDataLastRemove");
  dbloadProperties.loadDBLastRemove().then(() => {
    ctrlEmitter.emit('loadDBDataLastRemove-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('loadMetricInsert', () => {
  logger.debug(__filename, "ctrlEmitter", "loadMetricInsert");
  metric.loadMetricInsert().then(() => {
    ctrlEmitter.emit('loadMetricInsert-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('loadMetricRemove', () => {
  logger.debug(__filename, "ctrlEmitter", "loadMetricRemove");
  metric.loadMetricRemove().then(() => {
    ctrlEmitter.emit('loadMetricRemove-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});

ctrlEmitter.on('cronStartAll', () => {
  logger.debug(__filename, "ctrlEmitter", "cronStartAll");
  cron.startAll().then(() => {
    ctrlEmitter.emit('cronStartAll-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});
ctrlEmitter.on('cronStopAll', () => {
  ctrlEmitter.emit('cronStopAll-end');
  cron.stopAll().then(() => {
    ctrlEmitter.emit('cronStartAll-end');
  }).catch((error) => {
    ctrlEmitter.emit('error', error);
  });
});


module.exports = ctrlEmitter;
