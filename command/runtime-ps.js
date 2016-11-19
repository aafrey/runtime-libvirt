'use strict'

var libvirt = require('libvirt');
var hyper = new libvirt.Hypervisor('qemu:///system');

module.exports = function (args, cb) {
  hyper.connect( err => {
    if (!err) {

      console.log("Connected to Qemu");

      if (args.a) {
        console.log("listing all runtime.js VM's...");

        var domainIds = new Promise( (resolve, reject) => {
          hyper.listDefinedDomains( (err, domains) => {
            resolve(domains);
          });
        });

        domainIds.then( val => {
          for (var j = 0; j < val.length; j++) {
            hyper.lookupDomainById(parseInt(val[j]), (err, domain) => {
              domain.getName( (err, name) => {
                console.log(name);
              });
            });
          };
        });
      } else {
        
        console.log("listing all runtime.js VM's currently running...");

        var domainIds = new Promise( (resolve, reject) => {
          hyper.listActiveDomains( (err, domains) => {
            resolve(domains);
          });
        });

        domainIds.then( val => {
          for (var j = 0; j < val.length; j++) {
            hyper.lookupDomainById(parseInt(val[j]), (err, domain) => {
              domain.getName( (err, name) => {
                console.log(name);
              });
            });
          };
        });
      };
    };
  });
}
