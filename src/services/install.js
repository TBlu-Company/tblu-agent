'use-strict'
const os = require('os');
const npm = require('npm');

let install = function() {
    if (os.platform() == 'win32') {
        npm.load('global: true', function(err) {
            npm.commands.install(['node-windows'], function(er, data) {
                if (err) console.log(err);
                let win = require('./windows/service-start.js');
            });
            npm.on('log', function(message) {
                console.log(message);
            });
        });
    } else {
        npm.load(function(err) {
            npm.commands.install(['node-linux'], function(er, data) {
                if (err) console.log(err);
                let linux = require('./linux/service-start.js');
            });
            npm.on('log', function(message) {
                console.log(message);
            });
        });
    }
};

install();
