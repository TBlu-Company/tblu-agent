'use strict'
const pjson = require('../../package.json');
let loggerLevel = 'debug';
let appDir = undefined;
let dBmetrics = undefined;
let dBconfig = undefined;
let dBgather = undefined;
let gid = undefined;
let uid = undefined;
let dbAutocompactionInterval = 10000;
const agentVersion = pjson.version;

const setDBAutocompactionInterval = (x) => {
  dbAutocompactionInterval = x;
};

const getDBAutocompactionInterval = () => {
  return dbAutocompactionInterval;
};

const getAgentVersion = () => {
  return agentVersion;
};

const setDBmetrics = (x) => {
  dBmetrics = x;
};

const getDBmetrics = () => {
  return dBmetrics;
};

const setDBconfig = (x) => {
  dBconfig = x;
};

const getDBconfig = () => {
  return dBconfig;
};

const setDBgather = (x) => {
  dBgather = x;
};

const getDBgather = () => {
  return dBgather;
};

const setGID = (x) => {
  gid = x;
};

const getGID = () => {
  return gid;
};

const setUID = (x) => {
  uid = x;
};

const getUID = () => {
  return uid;
};

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
  setDBAutocompactionInterval,
  getDBAutocompactionInterval,
  getAgentVersion,
  setDBmetrics,
  getDBmetrics,
  setDBconfig,
  getDBconfig,
  setDBgather,
  getDBgather,
  setGID,
  getGID,
  setUID,
  getUID,
  setLoggerLevel,
  getLoggerLevel,
  setAppDir,
  getAppDir,
};
