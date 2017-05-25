'use strict'
/*
 * Controla o fluxo de ativades para o parametro service
 * OBS: nunca podem fazer importe de modulos NPM - Somente mandar eventos para o emiter
 */
const eventEmitter = require('../eventEmitter/eventEmitter');

const service = () => {
  switch (process.argv[3]) {
    case 'install':
      const serviceInstall = require('./atom/serviceInstall');
      serviceInstall();
      break;
    case 'uninstall':
      const serviceUninstall = require('./atom/serviceUninstall');
      serviceUninstall();
      break;
    default:
      eventEmitter.emit('helper');
  };
};

module.exports = service;
