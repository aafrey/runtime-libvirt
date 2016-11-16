'use strict'
var fs = require('fs');
var libvirt = require('libvirt');
var hyper = new libvirt.Hypervisor('qemu:///system');

module.exports = function (args, cb) {
  console.log("Deploy a runtime.js VM with Libvirt.");

  var xml = fs.readFileSync(args.domain);

  hyper.connect( err => {
    if (!err) {
      console.log('Connected to Qemu');

      if (args.domain) {
        hyper.createDomain(xml, (err, domain) => {
          if (!err) {
            console.log("Domain created...");
          }
        });
      }
    }
    //hyper.disconnect( err => {
      //if (!err) {
        //console.log("Disconnected from Qemu")
      //}
    //})
  });
}
