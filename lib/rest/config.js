'use strict';
const URL_API = 'https://agent.tblu.com.br';
// const url_api = "http://localhost:8000";

module.exports.get_url_api_component_UID = function () {
  return URL_API + '/components/get_UID';
};
module.exports.get_url_api = function () {
  return URL_API;
};
module.exports.get_url_api_metric_insert = function () {
  return URL_API + '/component_metric/list_insert';
};
module.exports.get_url_api_metric_exclude = function () {
  return URL_API + '/component_metric/list_disable';
};
module.exports.get_url_api_update_deployment_status = function () {
  return URL_API + '/component_metric/update_deployment_status';
};
module.exports.get_url_api_add_gather = function () {
  return URL_API + '/component_metric/gather/add';
};
