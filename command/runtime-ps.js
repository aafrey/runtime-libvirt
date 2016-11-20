'use strict'

var libvirt = require('libvirt');
var hyper = new libvirt.Hypervisor('qemu:///system');

var domainName = (val) => {
  for (var i = 0; i < val.length; i++) {
    hyper.lookupDomainById( val[i], (err, domain) => {
      domain.getName( (err, name) => {
        console.log(name);
      });
    });
  }
}

module.exports = function (args, cb) {
  hyper.connect( err => {
    if (!err) {
      console.log("----------------------------------------------------");

      if (args.a) {
        console.log("listing all defined runtime.js VM's...");

        hyper.listDefinedDomains( (err, domains) => {
          for (var i = 0; i < domains.length; i++) {
            console.log(domains[i]);
          }
        });
      } else {

        console.log("listing all runtime.js VM's currently running...");

        var domainIds = new Promise( (resolve, reject) => {
          hyper.listActiveDomains( (err, domains) => {
            resolve(domains);
          });
        });

        domainIds.then( val => { domainName(val); });

      };
      console.log("----------------------------------------------------");
    };
  });
}
