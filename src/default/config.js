'use strict';
const url_api = "http://localhost";
const url_api_component_UID = url_api + "/components/get_UID";
const url_api_metric_insert = url_api + "/component_metric/list_insert";
const url_api_metric_exclude = url_api + "/component_metric/list_disable";
const url_api_update_deployment_status = url_api + "/component_metric/update_deployment_status";
const url_api_add_gather = url_api + "/component_metric/add_gather";


const MyModule = (function() {
    function get_url_api_component_UID() {
        return (url_api_component_UID)
    }

    function get_url_api() {
        return (url_api)
    }

    function get_url_api_metric_insert() {
        return (url_api_metric_insert)
    }

    function get_url_api_metric_exclude() {
        return (url_api_metric_exclude)
    }

    function get_url_api_update_deployment_status() {
        return (url_api_update_deployment_status)
    }

    function get_url_api_add_gather() {
        return (url_api_add_gather)
    }

    return {
        get_url_api: get_url_api,
        get_url_api_component_UID: get_url_api_component_UID,
        get_url_api_metric_insert: get_url_api_metric_insert,
        get_url_api_metric_exclude: get_url_api_metric_exclude,
        get_url_api_update_deployment_status: get_url_api_update_deployment_status,
        get_url_api_add_gather: get_url_api_add_gather
    };
})();


module.exports = MyModule;
