'use strict'

var fs = require('fs');
var libvirt = require('libvirt');
var hyper = new libvirt.Hypervisor(process.env.RUNTIME_REMOTE);

var randomstring = require("randomstring");


var re = new RegExp('{{name}}');

var scaleUp = (name, configFile, scaleTo) => {
  for (let i = 1; i <= scaleTo; i++) {
    let scaleID = randomstring.generate(7);
    let xmlString = configFile.replace(re, `${name}-${scaleID}`);
    let xmlBuf = Buffer.from(xmlString);
    hyper.createDomain(xmlBuf, (err, domain) => {
      !err ? console.log('Domain created...') : console.log(err);
    });
  }
};

var bootNewDomain = (name, configFile) => {
  let xmlString = configFile.replace(re, name);
  let xmlBuf = Buffer.from(xmlString);
  hyper.createDomain(xmlBuf, (err, domain) => {
    !err ? console.log('Domain created...') : console.log(err);
  });
};

var bootDomain = (name) => {
  hyper.lookupDomainByName(name, (err, domain) => {
    domain.start( (err, result) => {
      !err ? console.log(`${name} started: ${result}`) : console.log(err);
    });
  });
};

module.exports = function (args, cb) {
  console.log("Deploy a runtime.js VM with Libvirt.");

  hyper.connect( err => {
    if (!err) {
      console.log('Connected to Qemu');
      if (args.domain) {
        var xml = fs.readFileSync(args.domain, 'utf8');
        !!args.scale ? scaleUp(args.name, xml, args.scale) : bootNewDomain(args.name, xml);
      }

      if (!!args.d) {
        bootDomain(args.name);
      }
    }
  });
};
