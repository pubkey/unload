const unload = require('../../');

/**
 * because shitware microsof-edge stucks the worker
 * when initialisation is done,
 * we have to set a interval here.
 */
setInterval(function () { }, 10 * 1000);


self.addEventListener('message', function (e) {
    const data = e.data;
    switch (data.cmd) {
        case 'start':
            console.log('Worker started');
            unload.add(() => {
                console.log('worker: run unload function');
            });
            console.log('Worker added function');
            self.postMessage('WORKER DONE');
            break;
        case 'stop':
            console.log('Worker stopped');
            break;
    }
}, false);


