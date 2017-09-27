'use stroct';
const testOracleHomeEnv = () => new Promise((resolve, reject) => {
  let result = [];
  let count = Object.keys(process.env).length;
  for (let key in process.env) {
    count -= 1;
    if (key.toString().toUpperCase() === 'ORACLE_HOME') {
      result[0] = process.env[key];
    }
    if (key.toString().toUpperCase() === 'LD_LIBRARY_PATH') {
      result[1] = process.env[key];
    }
    if (count === 0) {
      if (result.length > 1) {
        resolve(result);
      } else if (result.length > 0) {
        if (typeof result[0] === 'undefined') {
          reject(new Error(false));
        } else {
          result[1] = result[0] + '/lib';
          resolve(result);
        }
      } else {
        reject(new Error(false));
      }
    }
  }
});

module.exports = testOracleHomeEnv;
