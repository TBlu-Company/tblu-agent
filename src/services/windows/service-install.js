let Service = require('node-windows').Service;

// Create a new service object
let svc = new Service({
  name: 'Tblu',
  description: 'Collector agent for Tblu.',
  script: require('path').join(__dirname, '../../index.js'),
  wait: 2,
  grow: .5
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function() {
  console.log('Iniciando o Agent Tblu!');
  svc.start();
});

svc.on('alreadyinstalled', function() {
  console.log('Iniciando o Agent Tblu!');
  svc.start();
});

process.on('uncaughtException', function(err) {
  console.log('Error: ' + err);
  let fileWriter = require('fs');
  fileWriter.appendFile(__dirname + "/../../../log/error.log", err, function(failure) {
    if (failure) console.log(failure);
  })
});

svc.install();
