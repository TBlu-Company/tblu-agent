'use strict'
const schedule = require('node-schedule');
const logger = require('../logger/logger.js');

let dBconfig = null;
let dirname = null;
let dBmetrics = null;
let dBgather = null;

// Array das crons para poder dar stop em um processo
const arrayCrons = [];

// Inicio Passo 4
// Iniciar a Crom


const setGlobal = (dBconfigG, dirnameG, dBmetricsG, dBgatherG) => {
    dBconfig = dBconfigG;
    dirname = dirnameG;
    dBmetrics = dBmetricsG;
    dBgather = dBgatherG;
};


// const startCron = () => new Promise((resolve, reject) => {});

const saveInDB = (item, status, coleta) => {
    let gather = {};
    let error = {};
    if (status) {
        gather = coleta;
    } else {
        error = coleta;
    };
    let doc = {
        component: item.component,
        metric: item.metric,
        gatherDate: new Date().getTime(),
        executeStatus: status,
        gather: gather,
        gatherError: error
    };
    logger.debug(__filename, "saveInDB", "saveDB doc", JSON.stringify(doc));
    dBgather.insert(doc);
};

const startCronItem = (item) => new Promise((resolve, reject) => {
    logger.debug(__filename, "startCronItem", "Init", item.component + '_' + item.metric);
    logger.debug(__filename, "startCronItem", "Init - Add Array Jobs Size", Object.keys(arrayCrons).length);
    let job = arrayCrons[item.component + '_' + item.metric];
    if (typeof job != 'undefined') {
        logger.debug(__filename, "startCronItem", "Stop Job", item.component + '_' + item.metric);
        job.cancel();
    };
    try {
        let mod = require(item.npm);
        logger.debug(__filename, "startCronItem", "Add Job", item.component + '_' + item.metric);
        arrayCrons[item.component + '_' + item.metric] = schedule.scheduleJob(item.periodicity, function() {
            logger.debug(__filename, "startCronItem", "Running", item.component + '_' + item.metric);
            mod.run(item).then(result => {
                try {
                    let temp = JSON.parse(JSON.stringify(result));
                    saveInDB(item, true, temp);
                } catch (e) {
                    logger.error(__filename, "startCronItem", "Error ao processar retorno da metrica: " + item.component + '_' + item.metric, e);
                }

            }).catch(error => {
                try {
                    let temp = JSON.parse(JSON.stringify(error));
                    saveInDB(item, false, temp);
                } catch (e) {
                    logger.error(__filename, "startCronItem", "Error ao processar retorno da metrica: " + item.component + '_' + item.metric, e);
                }
            });
        });
        logger.debug(__filename, "startCronItem", "End - Add Array Jobs Size", Object.keys(arrayCrons).length);
        resolve(0);
    } catch (e) {
        logger.error(__filename, "startCronItem", "It was not possible to execute metric", JSON.stringify(item));
        logger.error(__filename, "startCronItem", "It was not possible to execute metric", e);
        reject(e);
    }
});

const stopCromItem = (item) => new Promise((resolve, reject) => {
    logger.debug(__filename, "stopCromItem", "Init", item.component + '_' + item.metric);
    logger.debug(__filename, "stopCromItem", "Init - Array Jobs Size", Object.keys(arrayCrons).length);
    let job = arrayCrons[item.component + '_' + item.metric];
    if (typeof job != 'undefined') {
        logger.debug(__filename, "stopCromItem", "Stop Job", item.component + '_' + item.metric);
        job.cancel();
        delete arrayCrons[item.component + '_' + item.metric];
    };
    logger.debug(__filename, "stopCromItem", "End - Array Jobs Size", Object.keys(arrayCrons).length);
    resolve(0);
});



const startCron = () => new Promise((resolve, reject) => {
    logger.debug(__filename, "startCron", "Init");
    logger.info(__filename, "startCron", "------ Start Cron ------");

    // Hash Map
    dBconfig.findOne({
        name: 'UpdateCronTime'
    }).exec(function(err, doc) {
        if (err || doc == null) {
            logger.error(__filename, "UpdateCronTime", "Cant read UpdateCronTime");
        } else {
            arrayCrons['UpdateCronTime'] = schedule.scheduleJob(doc.value, function() {
                logger.debug(__filename, "UpdateCronTime", "Init");
                logger.debug(__filename, "UpdateCronTime", "Array Jobs Size", Object.keys(arrayCrons).length);
                const update = require('./update.js');
                update.readUpdates();
            });
        };
    });


    dBconfig.findOne({
        name: 'SendDBCronTime'
    }).exec(function(err, doc) {
        if (err || doc == null) {
            logger.error(__filename, "UpdateCronTime", "Cant read SendDBCronTime");
        } else {
            arrayCrons['SendDBCronTime'] = schedule.scheduleJob(doc.value, function() {
                logger.debug(__filename, "SendDBCronTime", "Init");
                const sendDB = require('./sendDB.js');
                sendDB.sendDB();
            });
        };
    });

    // Load Itens in DB
    dBmetrics.find({}, function(err, docs) {
        docs.map(startCronItem);
    });
    logger.info(__filename, "startCron", "------ Running Cron ------");
    resolve(0);
});

const stopCron = () => new Promise((resolve, reject) => {
    logger.debug(__filename, "stopCron", "Init");
    logger.info(__filename, "stopCron", "------ Stop Cron ------");
    logger.debug(__filename, "stopCron", "Array Jobs Size", Object.keys(arrayCrons).length);
    for (let key in arrayCrons) {
        logger.debug(__filename, "stopCron", "key", key);
        arrayCrons[key].cancel();
        delete arrayCrons[key];
    };
    logger.debug(__filename, "stopCron", "Array Jobs Size", Object.keys(arrayCrons).length);
    logger.info(__filename, "stopCron", "------ System End ------");
    resolve(0);
});
// Fim Passo 4

module.exports = {
    setGlobal,
    startCron,
    stopCron,
    startCronItem,
    stopCromItem
}
