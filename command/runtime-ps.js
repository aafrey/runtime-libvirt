'use strict'

module.exports = function (args, cb) {
  if (args.a) {
    console.log("list all runtime.js VM's");
  } else {
    console.log("list all runtime.js VM's currently running");
  }
}
