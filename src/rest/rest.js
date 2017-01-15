'use strict';
const defaultC = require('../default/config.js');
const request = require('request');
const logger = require('../logger/logger.js');

//
// const options_proxy = {
//     proxy: {
//         //host: "proxy.foo.com",
//         //port: 8000,
//         //user: "proxyuser",
//         //password: "123",
//         //tunnel: true
//     },
//     connection: {
//         secureOptions: require('constants').SSL_OP_NO_TLSv1_2,
//         //     ciphers: 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256',
//         //     honorCipherOrder: true,
//         //
//     },
//     mimetypes: {
//         json: ["application/json", "application/json;charset=utf-8"],
//         xml: ["application/xml", "application/xml;charset=utf-8"]
//     },
//     requestConfig: {
//         timeout: 1000, //request timeout in milliseconds
//         noDelay: true, //Enable/disable the Nagle algorithm
//         keepAlive: true, //Enable/disable keep-alive functionalityidle socket.
//         keepAliveDelay: 1000 //and optionally set the initial delay before the first keepalive probe is sent
//     },
//     responseConfig: {
//         timeout: 10000 //response timeout - 10 seconds
//     }
// };
//
// const client = new Client(options_proxy);
// client.registerMethod("getcomponentUID", defaultC.get_url_api_component_UID(), "POST");
// client.registerMethod("getMetricInsert", defaultC.get_url_api_metric_insert(), "POST");
// client.registerMethod("getMetricDisable", defaultC.get_url_api_metric_exclude(), "POST");
// client.registerMethod("updateDeploymentStatus", defaultC.get_url_api_update_deployment_status(), "POST");
// client.registerMethod("addGather", defaultC.get_url_api_add_gather(), "PUT");
//
// // client.on('error', function(err) {
// //     logger.error(__filename, 'client.on', 'something went wrong on the request - data: ', args);
// //     logger.error(__filename, 'client.on', 'something went wrong on the request - data: ', err);
// // });

const post = (method, args) => new Promise((resolve, reject) => {
    logger.debug(__filename, "rest method ", method)
    try {

        var options = {
            method: 'POST',
            json: true,
            body: args.data
        };
        switch (method) {
            case 'getcomponentUID':
                options['url'] = defaultC.get_url_api_component_UID();
                break;
            case 'getMetricInsert':
                options['url'] = defaultC.get_url_api_metric_insert();
                break;
            case 'getMetricDisable':
                options['url'] = defaultC.get_url_api_metric_exclude();
                break;
            case 'updateDeploymentStatus':
                options['url'] = defaultC.get_url_api_update_deployment_status();
                break;
            case 'updateDeploymentStatus':
                options['url'] = defaultC.get_url_api_update_deployment_status();
                break;
            case 'addGather':
                options['url'] = defaultC.get_url_api_add_gather();
                options['method'] = "PUT";
                break;
        }



        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                logger.debug(__filename, 'post', 'body: ', body);
                resolve(body);
            } else {
                reject({
                    statusCode: response.statusCode,
                    data: body
                });
            }
        };
        logger.debug(__filename, 'post', 'options: ', options);
        request(options, callback);
    } catch (e) {
        logger.error(__filename, 'post', 'something went wrong on the request: ', e);
        reject(e);
    };
});

module.exports = post;
