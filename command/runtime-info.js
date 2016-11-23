'use strict'
const libvirt = require('libvirt');
const hyper = libvirt.Hypervisor(process.env.RUNTIME_REMOTE);


var getVMInfo = (vm) => {
  vm.getInfo( (err, info) => {
    !err ? console.log(info) : console.log(err);
  });
}

var getOSType = (vm) => {
  vm.getOSType( (err, osType) => {
    !err ? console.log(osType) : console.log(err);
  });
}

module.exports = function (args, cb) {

  hyper.connect( err => {

    if (!err) {
      hyper.lookupDomainByName( args._[0], (err, domain) => {
        if (!err) {
          if (!!args.stats) { getVMInfo(domain); }
          if (!!args.os) { getOSType(domain); }
        }
      });
    }
  });
}
