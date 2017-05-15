'use strict'
const path = require('path');
const platform = require('os').platform();
const dirname = path.dirname(__filename).replace('/src/services', '');
global.basedir = dirname;

const _ = require('lodash');

const update = require('../lib/update.js');
const linuxUser = require('../lib/linuxUser.js');
const logger = require('../logger/logger.js');
const createDir = require('../lib/createDir.js');
const loadDataBase = require('../lib/loadDataBase.js');
const readInput = require('../lib/readInput.js');
const oracleHome = require('../lib/oracleHome.js');

let dBconfig = null;
let dBmetrics = null;
let dBgather = null;
let gid = null;
let uid = null;

const defaultServiceConfig = {
  name: 'TBlu Agent',
  description: 'Agent collector for TBlu',
  script: require('path').join(__dirname, '../../index.js'),
  wait: 2,
  grow: .5
};

const initProcess = () => new Promise((resolve, reject) => {
  createDir(dirname).then(() => {
    loadDataBase(dirname).then((result) => {
      dBconfig = result[0];
      dBmetrics = result[1];
      dBgather = result[2];
    }).then(() => {
      return readInput.readAccountUID(dBconfig)
    }).then(() => {
      return readInput.readComponentUUID(dBconfig);
    }).then(() => {
      resolve(0);
    });
  })
})

function nodeUnsupported() {
  logger.error(__filename, "nodeUnsupported", "TBlu Agent is only supported on Linux or Windows");
};

const createUserLinux = () => new Promise((resolve, reject) => {
  linuxUser.addGroup({
    name: 'tblu',
    gid: 700
  }).then((gid1) => {
    gid = gid1;
    linuxUser.addUser({
      name: 'tblu',
      gid: 700,
      uid: 700,
      dirname: dirname
    }).then((uid1) => {
      uid = uid1;
      resolve(true);
    }).catch((err) => {
      reject(err)
    });
  }).catch((err) => {
    reject(err)
  });
});

const createService = (service, customOption) => new Promise((resolve, reject) => {
  let merge = _.merge(defaultServiceConfig, customOption);
  let svc = new service(merge);
  svc.on('uninstall', function() {
    svc.stop();
    logger.info(__filename, "createService", "Uninstall complete");
    logger.info(__filename, "createService", "The service exists:", svc.exists());
    process.exit(0)
  });
  svc.on('install', function() {
    logger.info(__filename, "createService", "Install complete");
    process.exit(0)
  });
  svc.on('alreadyinstalled', function() {
    logger.info(__filename, "createService", "Install complete");
    process.exit(0)
  });
  svc.on('start', function() {
    logger.info(__filename, "createService", "Start Service Agent");
    process.exit(0)
  });
  resolve(svc);
});


function installService(service, customOption) {
  initProcess().then((result2) => {
    createService(service, customOption).then((svc) => {
      svc.install();
    });
  });
}

function uninstallService(service, customOption) {
  createService(service, customOption).then((svc) => {
    svc.uninstall();
  });
}

function processarService(atividade, service, customOption) {
  switch (atividade) {
    case 'install':
      installService(service, customOption);
      break;
    case 'uninstall':
      uninstallService(service, customOption);
      break;
    default:
      helper()
  };
};

function nodeLinux(atividade) {
  update.installNPM({
    npm: 'node-linux',
    dirname: dirname
  }).then((result) => {
    createUserLinux().then((result) => {
      let service = require('node-linux').Service;
      let customOption = {
        user: "tblu",
        group: "tblu",
        env: [{
          name: "HOME",
          value: dirname
        }, {
          name: "LANG",
          value: 'en_US.UTF-8'
        }, {
          name: "LANGUAGE",
          value: 'en'
        }, {
          name: "LC_ALL",
          value: 'C'
        }]
      };
      oracleHome.getOracleHome().then((result) => {
        if (typeof result != 'undefined') {
          customOption.env.push({
            name: "ORACLE_HOME",
            value: result[0]
          });
          customOption.env.push({
            name: "LD_LIBRARY_PATH",
            value: result[1]
          });
        };
        processarService(atividade, service, customOption);
      }).catch((err) => {
        logger.error(__filename, "nodeLinux", "oracleHome", err);
      });
    }).catch((err) => {
      logger.error(__filename, "nodeLinux", "createUserLinux", err);
    });
  }).catch((err) => {
    logger.error(__filename, "nodeLinux", "installNPM", err);
  });
};

function nodeWindows(atividade) {
  update.installNPM({
    npm: 'node-windows',
    dirname: dirname
  }).then((result) => {
    let service = require('node-windows').Service;
    let customOption = {};
    processarService(atividade, service, customOption);
  }).catch((err) => {
    logger.error(__filename, "nodeWindows", "NOK:", dirname);
  });
};

function helper() {
  console.error("Parametro invalido!")
  console.error("")
  console.error("Usar:")
  console.error("\tinstall  \t\tPara instalar")
  console.error("\tuninstall\t\tPara desinstalar")
};

function processarArg(atividade) {
  switch (platform) {
    case 'linux':
      nodeLinux(atividade);
      break;
    case 'win32':
      nodeWindows(atividade);
      break;
    default:
      nodeUnsupported();
  };
}

function atividade() {
  if (process.argv.length < 3) {
    helper()
  } else {
    switch (process.argv[2]) {
      case 'install':
        processarArg(process.argv[2]);
        break;
      case 'uninstall':
        processarArg(process.argv[2]);
        break;
      default:
        helper()
    };
  };
};


atividade();
