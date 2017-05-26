'use strict'
const pjson = require('../../package.json');
let loggerLevel = 'debug';
let appDir = undefined;
let dBmetrics = undefined;
let dBconfig = undefined;
let dBgather = undefined;
let userName = 'tblu';
let gid = 700;
let uid = 700;
let dbAutocompactionInterval = 10000;
let companyUUID = undefined;
let componentUUID = undefined;
let oracleHome = undefined;
let ldLibraryPath = undefined;
let dataLastInsert = undefined;
let dataLastRemove = undefined;
let updateCronTime = undefined;
let sendLimit = undefined;
let sendDataOnExecute = undefined;
const agentVersion = pjson.version;

const setDBAutocompactionInterval = (x) => {
  dbAutocompactionInterval = x;
};

const getDBAutocompactionInterval = () => {
  return dbAutocompactionInterval;
};

const setCompanyUUID = (x) => {
  companyUUID = x;
};

const getCompanyUUID = () => {
  return companyUUID;
};

const setComponentUUID = (x) => {
  companyUUID = x;
};

const getComponentUUID = () => {
  return companyUUID;
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

const setUserName = (x) => {
  userName = x;
};

const getUserName = () => {
  return userName;
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

const setOracleHome = (x) => {
  oracleHome = x;
};

const getOracleHome = () => {
  return oracleHome;
};

const setLDLibraryPath = (x) => {
  ldLibraryPath = x;
};

const getLDLibraryPath = () => {
  return ldLibraryPath;
};

const setDataLastInsert = (x) => {
  dataLastInsert = x;
};

const getDataLastInsert = () => {
  return dataLastInsert;
};

const setDataLastRemove = (x) => {
  dataLastRemove = x;
};

const getDataLastRemove = () => {
  return dataLastRemove;
};

const setUpdateCronTime = (x) => {
  updateCronTime = x;
};

const getUpdateCronTime = () => {
  return updateCronTime;
};

const setSendLimit = (x) => {
  sendLimit = x;
};

const getSendLimit = () => {
  return sendLimit;
};

const setSendDataOnExecute = (x) => {
  sendDataOnExecute = x;
};

const getSendDataOnExecute = () => {
  return sendDataOnExecute;
};


module.exports = {
  setDataLastInsert,
  getDataLastInsert,
  setDataLastRemove,
  getDataLastRemove,
  setUpdateCronTime,
  getUpdateCronTime,
  setSendLimit,
  getSendLimit,
  setSendDataOnExecute,
  getSendDataOnExecute,
  setOracleHome,
  getOracleHome,
  setLDLibraryPath,
  getLDLibraryPath,
  getCompanyUUID,
  setCompanyUUID,
  getComponentUUID,
  setComponentUUID,
  setDBAutocompactionInterval,
  getDBAutocompactionInterval,
  getAgentVersion,
  setDBmetrics,
  getDBmetrics,
  setDBconfig,
  getDBconfig,
  setDBgather,
  getDBgather,
  setUserName,
  getUserName,
  setGID,
  getGID,
  setUID,
  getUID,
  setLoggerLevel,
  getLoggerLevel,
  setAppDir,
  getAppDir,
};
