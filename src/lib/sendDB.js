'use strict'
const logger = require('../logger/logger.js');
const rest = require('../rest/rest.js');

let dBconfig = null;
let dBgather = null;


const setGlobal = (dBconfigG, dBgatherG) => {
    dBconfig = dBconfigG;
    dBgather = dBgatherG;
};

const deleteDoc = (doc) => new Promise(function(resolve, reject) {
    dBgather.remove({
        _id: doc._id
    }, (err, numRemoved) => {
        if (err) {
            logger.error(__filename, "deleteDoc", "Cant delete data", err);
            reject(err);
        } else {
            logger.debug(__filename, "deleteDoc", "Data delete doc._id: " + doc._id, numRemoved);
            resolve(numRemoved);
        };
    });
});


const sendDBData = (skip, limit) => new Promise((resolve, reject) => {
    dBgather.find({}).skip(skip).limit(limit).exec(function(err, docs) {
        if (err) {
            logger.error(__filename, "sendDBData", "Erro read data", err);
        } else {
            if (docs != null && docs.length > 0) {
                dBconfig.findOne({
                    name: 'AccountUID'
                }).exec(function(err, doc1) {
                    if (err || doc1 == null) {
                        logger.error(__filename, "sendDBData", "Cant read AccountUID");
                        reject(err);
                    } else {
                        let data = JSON.parse(JSON.stringify(docs));
                        data.forEach(e => {
                            e['account'] = doc1.value;
                            delete e['_id'];
                        });
                        let args = {
                            data: data,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        };
                        logger.debug(__filename, "sendDBData", "Post Args", JSON.stringify(args));
                        rest('addGather', args).then(result => {
                            logger.debug(__filename, "sendDBData", "Send Docs - result", result);
                            logger.info(__filename, "sendDBData", "Send Docs", data.length);
                            let actions = docs.map(deleteDoc);
                            let results = Promise.all(actions);
                            results.then(result => {
                                logger.debug(__filename, "sendDBData", "delete - result", result);
                                resolve(0);
                            }).catch(reason => {
                                logger.debug(__filename, "sendDBData", "delete - Error", reason);
                                reject(reason);
                            })
                        }).catch(error => {
                            logger.error(__filename, "sendDBData", "Cant send data", error);
                            reject(error);
                        });
                    }
                });
            } else {
                resolve(0);
            };
        };
    });
});

const sendDB = () => new Promise((resolve, reject) => {
    logger.debug(__filename, "sendDB", "Init");
    dBconfig.findOne({
        name: 'SendDBLimit'
    }).exec(function(err, doc1) {
        if (err || doc1 == null) {
            logger.error(__filename, "sendDB", "Cant read SendDBLimit");
            reject(err);
        } else {
            dBgather.count({}, function(err, count) {
                logger.info(__filename, "sendDB", "Gather to send", count);
                let loop = Math.floor(count / doc1.value);
                let array_p = [];
                for (let i = 0; i <= loop; i++) {
                    let skip = i * doc1.value;
                    logger.debug(__filename, "sendDB", "loop - i", i);
                    logger.debug(__filename, "sendDB", "loop - skip", skip);
                    logger.debug(__filename, "sendDB", "loop - limit", doc1.value);
                    array_p.push(sendDBData(skip, doc1.value));
                };
                Promise.all(array_p).then(result => {
                    logger.debug(__filename, "sendDB", "loopDB - result:", result);
                    dBgather.persistence.compactDatafile();
                    resolve(0);
                }).catch(reason => {
                    logger.error(__filename, "sendDB", "loopDB - Error", reason);
                    reject(reason);
                });
            });
        };
    });
});

module.exports = {
    setGlobal,
    sendDB,
}
