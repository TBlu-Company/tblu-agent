const path = require('path');
const bin = path.join(__dirname);
const exec = require('child_process').exec;

  const elevate = (cmd,options,callback) => {
    var p = params(options,callback);
    exec('"'+path.join(bin,'elevate','elevate.cmd')+'" '+cmd,p.options,p.callback);
  },

  const params = (options, callback) => {
    callback = callback || function(){};
    options = options || {};
    if (typeof options === 'function'){
      callback = options;
      options = {};
    }
    if (typeof options !== 'object'){
      throw 'Invalid options parameter.';
    }
    return {options:options,callback:callback};
  }

module.exports = elevate;
