'use strict'

var fs = require('fs');
var libvirt = require('libvirt');
var randomstring = require("randomstring");
var hyper = new libvirt.Hypervisor(process.env.RUNTIME_REMOTE);

var vmName = new RegExp('{{name}}');
var initrd = new RegExp('{{initrd}}');

var scaleUp = (name, ramdisk, configFile, scaleTo) => {
  for (let i = 1; i <= scaleTo; i++) {
    let scaleID = randomstring.generate(7);
    let xmlString = configFile.replace(vmName, `${name}-${scaleID}`);
    let xmlString2 = xmlString.replace(initrd, `${ramdisk}`);
    let xmlBuf = Buffer.from(xmlString2);
    hyper.createDomain(xmlBuf, (err, domain) => {
      !err ? console.log('Domain created...') : console.log(err);
    });
  }
};

var bootNewDomain = (name, ramdisk, configFile) => {
  let xmlString = configFile.replace(vmName, name);
  let xmlString2 = xmlString.replace(initrd, `${ramdisk}`);
  let xmlBuf = Buffer.from(xmlString2);
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
        !!args.scale ? scaleUp(args.name, args._[0], xml, args.scale) : bootNewDomain(args.name, args._[0], xml);
      }

      if (!!args.d) {
        bootDomain(args.name);
      }
    }
  });
};
