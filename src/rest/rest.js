'use strict';
const defaultC = require('../default/config.js');
const request = require('request');
const logger = require('../logger/logger.js');


const post = (method, body) => new Promise((resolve, reject) => {
    logger.debug(__filename, "rest method ", method)
    try {

        var options = {
            method: 'POST',
            json: true,
            body: body
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
                let retorno = {};
                if (typeof response != 'undefined') {
                    retorno['statusCode'] = response.statusCode;
                } else {
                    retorno['statusCode'] = 0;
                };
                retorno['data'] = body;
                reject(retorno);
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
