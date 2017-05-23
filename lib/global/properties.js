'use strict'
let appDir = undefined;

const setAppDir = (x) => {
  appDir = x;
  return;
};

const getAppDir = () => {
  return appDir;
};
module.exports = {
  setAppDir,
  getAppDir
};
