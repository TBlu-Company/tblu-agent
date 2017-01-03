'use strict';
const defaultC = require('../default/config.js');
const Client = require('node-rest-client').Client;
const logger = require('../logger/logger.js');


const options_proxy = {
    proxy: {
        //host: "proxy.foo.com",
        //port: 8000,
        //user: "proxyuser",
        //password: "123",
        //tunnel: true
    },
    connection: {
        secureOptions: require('constants').SSL_OP_NO_TLSv1_2,
        ciphers: 'ECDHE-RSA-AES256-SHA:AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
        honorCipherOrder: true,
        rejectUnauthorized: false

    },
    mimetypes: {
        json: ["application/json", "application/json;charset=utf-8"],
        xml: ["application/xml", "application/xml;charset=utf-8"]
    },
    requestConfig: {
        timeout: 1000, //request timeout in milliseconds
        noDelay: true, //Enable/disable the Nagle algorithm
        keepAlive: true, //Enable/disable keep-alive functionalityidle socket.
        keepAliveDelay: 1000 //and optionally set the initial delay before the first keepalive probe is sent
    },
    responseConfig: {
        timeout: 10000 //response timeout - 10 seconds
    }
};

const client = new Client(options_proxy);
client.registerMethod("getcomponentUID", defaultC.get_url_api_component_UID(), "POST");
client.registerMethod("getMetricInsert", defaultC.get_url_api_metric_insert(), "POST");
client.registerMethod("getMetricDisable", defaultC.get_url_api_metric_exclude(), "POST");
client.registerMethod("updateDeploymentStatus", defaultC.get_url_api_update_deployment_status(), "POST");
client.registerMethod("addGather", defaultC.get_url_api_add_gather(), "PUT");

client.on('error', function(err) {
    logger.error(__filename, 'client.on', 'something went wrong on the request - data: ', args);
    logger.error(__filename, 'client.on', 'something went wrong on the request - data: ', err);
});

const post = (method, args) => new Promise((resolve, reject) => {
    client.methods[method](args, (data, response) => {
        if (200 === response.statusCode) {
            resolve(data);
        } else {
            reject({
                statusCode: response.statusCode,
                data: data
            });
        };
    });
});

module.exports = post;
