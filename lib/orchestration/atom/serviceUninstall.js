'use strict';
const os = require('os');
const eventEmitter = require('../../eventEmitter/eventEmitter');
const defaultServiceConfig = require('../../services/config');
const logger = require('../../logger/logger');
let Service;
/*
 * Controla o fluxo de ativades para o parametro service
 * OBS: nunca podem fazer importe de modulos NPM - Somente mandar eventos para o emiter
 */

eventEmitter.on('uninstall', () => {
  let svc = new Service(defaultServiceConfig);
  svc.on('uninstall', function() {
    logger.info(__filename, 'createService', 'Uninstall complete');
    logger.info(__filename, 'createService', 'The service exists:', svc.exists());
    eventEmitter.emit('exit');
  });
  svc.on('stop', function() {
    svc.uninstall();
  });
  svc.stop();
});

const linuxUninstall = () => {
  Service = require('node-service-linux').Service;
  eventEmitter.emit('uninstall');
};

const win32Uninstall = () => {
  Service = require('node-windows').Service;
  eventEmitter.emit('uninstall');
};

const uninstall = () => {
  switch (os.platform()) {
    case 'linux':
      linuxUninstall();
      break;
    case 'win32':
      win32Uninstall();
      break;
    default:
      eventEmitter.emit('error', new Error('OS not supported'));
  }
};

module.exports = uninstall;
