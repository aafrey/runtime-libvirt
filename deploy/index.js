var libvirt = require('libvirt');
var hypervisor = new libvirt.Hypervisor('qemu:///system');

hypervisor.connect( err =>
    if (!err) {
        console.log("connected"); }

    hyper.getDefinedDomains( (err, domains) => {
        console.log(domains); }



});


