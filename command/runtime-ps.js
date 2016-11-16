'use strict'

var libvirt = require('libvirt');
var hyper = new libvirt.Hypervisor('qemu:///system');

module.exports = function (args, cb) {
  hyper.connect( err => {
    if (!err) {
      console.log("Connected to Qemu");

      if (args.a) {
        console.log("listing all runtime.js VM's...");
        hyper.listDefinedDomains( (err, domain) => {
          console.log(domain);
        });
      } else {
        console.log("listing all runtime.js VM's currently running...");
        hyper.listActiveDomains( (err, domain) => {
          for (var i = 0; i < domain.length; i++) {
            console.log(domain[i]);
          }
        });
      }
    }
    hyper.disconnect( err => {
      if (!err) {
        console.log("Disconnected from Qemu");
      } else {
        console.log(err);
      }
    });
  });
}
