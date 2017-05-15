let Service = require('node-linux').Service;

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
  console.log('Error: ' + err);
  let fileWriter = require('fs');
  fileWriter.appendFile(__dirname + "/../../../log/error.log", err, function(failure) {
    if (failure) console.log(failure);
  });
});

// Stop the service.
svc.stop();
