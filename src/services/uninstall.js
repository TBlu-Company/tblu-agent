'use-strict'
const os = require('os');

let uninstall = function() {
    if (os.platform() == 'win32') {
        let linux = require('./windows/service-uninstall.js');
    } else {
        let linux = require('./linux/service-uninstall.js');
    }
};
uninstall();
