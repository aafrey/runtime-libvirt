'use strict'

var fs = require('fs');
var libvirt = require('libvirt');
var randomstring = require("randomstring");
var hyper = new libvirt.Hypervisor(process.env.RUNTIME_REMOTE);

var vmName = new RegExp('{{name}}');
var initrd = new RegExp('{{initrd}}');

var processConfig = (name, ramdisk, configFile, scaleID) => {
  let xmlString = configFile.replace(vmName, `${name}`)
    .replace(initrd, `${ramdisk}`);
  let xmlBuffer = Buffer.from(xmlString);
  return xmlBuffer;
}

var bootNewDomain = (name, ramdisk, configFile) => {
  let xmlBuffer = processConfig(name, ramdisk, configFile);
  hyper.createDomain(xmlBuffer, (err, domain) => {
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

function doAction(flag, options) {
  var actions = {
    'bootNewDomain': bootNewDomain(optionsArray[0], optionsArray[1], optionsArray[2]);,
    'bootDomain':    bootDomain(options);
  }
  return actions[flag]();
}

module.exports = function (args, cb) {

  hyper.connect( err => {
    if (!err) {
      console.log('Connected to Qemu');
      var xml = fs.readFileSync(args.domain, 'utf8');
      !!args.d ? bootDomain(args.name) : bootNewDomain(args.name, args._[0], xml);
    }
  });
};
