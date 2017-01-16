'use strict'
// Load Caminho
const path = require('path');
const filename = path.basename(__filename);
const dirname = path.dirname(__filename);

// Load Libs
const mkdirp = require('mkdirp');
const readline = require('readline');
const Datastore = require('nedb')

// Load Includes
const logger = require('./src/logger/logger.js');
const update = require('./src/lib/update.js');
const cron = require('./src/lib/cron.js');
const sendDB = require('./src/lib/sendDB.js');

// Variables
let dBmetrics = null;
let dBconfig = null;
let dBgather = null;
let dbAutocompactionInterval = 10000;

// Inicio Passo 1
// Cria diretorio
const createDir = (dirname) => {
    return mkdirp(dirname, function(err) {
        logger.debug(__filename, "createDir", "CreatDir: " + dirname);
        if (err) {
            logger.error(__filename, "createDir", "Error CreatDir: " + dirname, err);
            return Promise.reject(new Error("fail"))
        } else {
            return Promise.resolve(0);
        }
    });
};

// Cria list de diretorios
const createDirList = () => new Promise((resolve, reject) => {
    const listP = [createDir(dirname + '/data'), createDir(dirname + '/log')]
    Promise.all(listP).then(result => resolve(result)).catch(error => reject(error));
});


const loadDataBase = () => new Promise((resolve, reject) => {
    dBconfig = new Datastore(dirname + '/data/config.db');
    dBconfig.loadDatabase();
    dBconfig.persistence.setAutocompactionInterval(dbAutocompactionInterval);
    dBmetrics = new Datastore(dirname + '/data/metrics.db');
    dBmetrics.loadDatabase();
    dBmetrics.removeIndex('metric');
    dBmetrics.ensureIndex({
        fieldName: 'metric'
    }, function(err) {
        // If there was an error, err is not null
    });
    dBmetrics.removeIndex('component');
    dBmetrics.ensureIndex({
        fieldName: 'component'
    }, function(err) {
        // If there was an error, err is not null
    });
    dBmetrics.persistence.compactDatafile();
    dBmetrics.persistence.setAutocompactionInterval(dbAutocompactionInterval);
    dBgather = new Datastore(dirname + '/data/gather.db');
    dBgather.loadDatabase();
    dBgather.persistence.compactDatafile();
    dBgather.persistence.setAutocompactionInterval(dbAutocompactionInterval);
    resolve(0);
});

const setGlobal = () => new Promise((resolve, reject) => {
    update.setGlobal(dBconfig, dirname, dBmetrics);
    cron.setGlobal(dBconfig, dirname, dBmetrics, dBgather);
    sendDB.setGlobal(dBconfig, dBgather);
    resolve(0);
});

// Fim Passo 1
// Inicio Passo 2
// Ler AccountUID e ComponentUID

const readAccountUID = () => new Promise((resolve, reject) => {
    logger.debug(__filename, "readAccountUID", "Init");
    dBconfig.findOne({
        name: 'AccountUID'
    }).exec(function(err, doc) {
        if (err) {
            logger.error(__filename, "readAccountUID", "Error Read AccountUID", err);
        } else {
            if (doc == null) {
                let rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                rl.question('\n\n\nInsert your AccountUID: ', (answer) => {
                    let data = {
                        name: 'AccountUID',
                        value: answer
                    };
                    dBconfig.insert(data);
                    rl.close();
                    resolve(0);
                });
            } else {
                resolve(0);
            };
        };
    });
});

const readComponentUUID = () => new Promise((resolve, reject) => {
    logger.debug(__filename, "readComponentUUID", "Init");
    dBconfig.findOne({
        name: 'ComponentUID'
    }).exec(function(err, doc) {
        if (err) {
            logger.error(__filename, "readAccountUID", "Error Read ComponentUID", err);
        } else {
            if (doc == null) {
                let rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                rl.question('\n\n\nInsert your ComponentUID: ', (answer) => {
                    let data = {
                        name: 'ComponentUID',
                        value: answer
                    };
                    dBconfig.insert(data);
                    rl.close();
                    resolve(0);
                });
            } else {
                resolve(0);
            };
        };
    });
});

const readSendDBLimit = () => new Promise((resolve, reject) => {
    logger.debug(__filename, "readSendDBLimit", "Init");
    dBconfig.findOne({
        name: 'SendDBLimit'
    }).exec(function(err, doc) {
        if (err) {
            logger.error(__filename, "readSendDBLimit", "Error Read SendDBLimit", err);
        } else {
            if (doc == null) {
                let data = {
                    name: 'SendDBLimit',
                    value: 50
                };
                dBconfig.insert(data);
                resolve(0);

            } else {
                resolve(0);
            };
        };
    });
});

const readSendDBCronTime = () => new Promise((resolve, reject) => {
    logger.debug(__filename, "readSendDBCronTime", "Init");
    dBconfig.findOne({
        name: 'SendDBCronTime'
    }).exec(function(err, doc) {
        if (err) {
            logger.error(__filename, "readSendDBCronTime", "Error Read SendDBCronTime", err);
        } else {
            if (doc == null) {
                let x = Math.floor((Math.random() * 59) + 1);
                let t = x + ' */2 * * * *';
                let data = {
                    name: 'SendDBCronTime',
                    value: t
                };
                dBconfig.insert(data);
                resolve(0);

            } else {
                resolve(0);
            };
        };
    });
});

const readUpdateCronTime = () => new Promise((resolve, reject) => {
    logger.debug(__filename, "readUpdateCronTime", "Init");
    dBconfig.findOne({
        name: 'UpdateCronTime'
    }).exec(function(err, doc) {
        if (err) {
            logger.error(__filename, "readUpdateCronTime", "Error Read UpdateCronTime", err);
        } else {
            if (doc == null) {
                let x = Math.floor((Math.random() * 59) + 1);
                let t = x + ' */10 * * * *';
                let data = {
                    name: 'UpdateCronTime',
                    value: t
                };
                dBconfig.insert(data);
                resolve(0);

            } else {
                resolve(0);
            };
        };
    });
});

const readUUID = () => new Promise((resolve, reject) => {
    logger.debug(__filename, "readUUID", "Init");
    readAccountUID().then(() => {
        return readComponentUUID();
    }).then(() => {
        return readSendDBLimit();
    }).then(() => {
        return readSendDBCronTime();
    }).then(() => {
        return readUpdateCronTime();
    }).then(() => {
        resolve(0);
    }).catch((error) => reject(error));
});

// Fim Passo 2

// Inicio Geral
createDirList().then(() => {
    return loadDataBase()
}).then(() => {
    return readUUID()
}).then(() => {
    return setGlobal()
    // O Update deve executar somente pela cron
    // }).then(() => {
    //     // Inicio Passo 3
    //     return update.readUpdates()
}).then(() => {
    // Inicio Passo 4
    return cron.startCron();
}).catch((error) => {
    logger.error(__filename, "Geral", "Error: ", error);
    cron.stopCron();
    process.exit(1);
});

process.on('SIGINT', function() {
    logger.info(__filename, "SIGINT", "Desligando o sistema ");
    cron.stopCron().then(result => {
        process.exit();
    });
});
// Fim Geral
