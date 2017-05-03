let Service = require('node-windows').Service;

// Create a new service object
let svc = new Service({
    name: 'Tblu',
    script: require('path').join(__dirname, '../../index.js')
});

// Listen for the "stop" event so we know when it's time to uninstall.
svc.on('stop', function() {
    svc.uninstall();
    console.log('Uninstall complete.');
});

// TODO: Achar uma forma mais elegante de trabalhar essas exceptions
process.on('uncaughtException', function(err) {
    let fileWriter = require('fs');
    fileWriter.appendFile(__dirname + "/../../log/error.log", err, function(failure) {
        if (failure) console.log(failure);
    })
    console.log('Error: ' + err);
});

// Stop the service.
svc.stop();
