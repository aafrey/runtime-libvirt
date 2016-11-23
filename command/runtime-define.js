'use strict'

const libvirt = require('libvirt');
const hyper = libvirt.Hypervisor(process.env.RUNTIME_REMOTE);
const fs = require('fs');

const re = new RegExp('{{name}}');

module.exports = function (args, cb) {
  hyper.connect( err => {
    if (!err) {
      if (args.domain) {
        let xmlString = fs.readFileSync(args.domain, 'utf8').replace(re, args.name);
        let xmlBuf= Buffer.from(xmlString);
        hyper.defineDomain(xmlBuf, (err) => {
          console.log(`Domain ${args.name} has been defined`);
        });
      }
    }
  });
}
