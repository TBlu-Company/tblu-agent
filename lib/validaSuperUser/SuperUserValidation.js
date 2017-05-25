'use strict'

const os = require('os');

const SuperUserValidation = () => {
  switch (os.platform()) {
    case 'linux':
      linuxCheck();
      break;
    case 'win32':
      win32Check();
      break;
    default:
      eventEmitter.emit('error', new Error('OS not supported'));
  };
};

const linuxCheck = () => {
  if (process.getuid && process.getuid() === 0) {
    // SU!
  } else {
    // !SU
  }
};
