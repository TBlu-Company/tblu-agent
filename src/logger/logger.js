'use strict';
const winston = require('winston');
winston.level = 'debug';
const formatMessage = (level, path, method, text, object) => {
    winston.log(level, "[" + path + "] [" + method + "] " + text, object);
};

const debug = (path, method, text, object) => {
    formatMessage('debug', path, method, text, object);
}

const info = (path, method, text, object) => {
    formatMessage('info', path, method, text, object);
}

const tracer = (path, method, text, object) => {
    formatMessage('debug', path, method, text, object);
}

const error = (path, method, text, object) => {
    formatMessage('error', path, method, text, object);
}

const myLog = {
    debug,
    info,
    tracer,
    error,
};

module.exports = myLog;
