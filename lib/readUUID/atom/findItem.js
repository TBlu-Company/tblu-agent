'use strict';
const findItem = (item, texto) => new Promise((resolve, reject) => {
  if (item.toUpperCase().includes(texto.toUpperCase())) {
    resolve(true);
  } else {
    resolve(false);
  }
});
module.exports = findItem;
