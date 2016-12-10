var request = require('request-promise-native');
var unload = require('../../src/index.js');

var mode = args[0];

var stopListening = unload(function(e) {
    return request('http://localhost:23230/');
});

console.log('mode: ' + mode);
switch (mode) {
    case 'execption':
        setTimeout(function() {
            throw new Error('Ouch, my knee!');
        }, 200);
        break;
    case 'exit':
        setTimeout(function() {
            process.exit();
        }, 200);
        break;
    case 'runout':
        setTimeout(function() {
            console.log('I run out');
        }, 200);
        break;
    case 'stopBefore':
        setTimeout(function() {
            stopListening();
        }, 200);
        setTimeout(function() {
            console.log('I run out');
        }, 300);
        break;
}

if (mode != 'runout' && mode!='stopBefore') {
    setTimeout(function liveLong() {
        console.log('liveLong: end');
    }, 1000 * 5);
}
