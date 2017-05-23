'use strict'
let loggerLevel = 'debug';
let appDir = undefined;

const setLoggerLevel = (x) => {
  loggerLevel = x;
};

const getLoggerLevel = () => {
  return loggerLevel;
};

const setAppDir = (x) => {
  appDir = x;
};

const getAppDir = () => {
  return appDir;
};

module.exports = {
  setLoggerLevel,
  getLoggerLevel,
  setAppDir,
  getAppDir
};
