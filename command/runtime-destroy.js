'use strict'

var libvirt = require('libvirt');
var hyper = new libvirt.Hypervisor('qemu:///system');

module.exports = function (args, cb) {
  console.log(args._[0]);
  var domainName = args._[0];

  hyper.connect( err => {
    if (!err) {
      console.log('Connected to Qemu')
    }
    hyper.lookupDomainByName(domainName, (err, domain) => {
      if (!err) {
        domain.destroy( (err) => {
          if (!err) {
            console.log(`${domainName} is shutting down...`)
          }
        });
      }
    });
  });
}
