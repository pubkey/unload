var request = require('request-promise-native');
var unload = require('../../src/index.js');

process.argv.shift();
process.argv.shift();

var mode = process.argv.shift();

var stopListening = unload.add(function() {
    return request('http://localhost:23230/');
});

console.log('mode: ' + mode);
switch (mode) {
    case 'exception':
        setTimeout(function() {
            throw new Error('Ouch, my knee!');
        }, 200);
        setTimeout(function liveLong() {
            console.log('liveLong: end');
        }, 1000 * 5);
        break;
    case 'exit':
        setTimeout(function() {
            process.exit();
        }, 200);
        setTimeout(function liveLong() {
            console.log('liveLong: end');
        }, 1000 * 5);
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
    case 'runAll':
        unload.runAll();
        setTimeout(function() {
            console.log('I run out');
        }, 300);
        break;
    case 'runAlltwice':
        unload.runAll();
        unload.runAll();
        setTimeout(function() {
            console.log('I run out');
        }, 300);
        break;
    case 'removeAll':
        unload.removeAll();
        setTimeout(function() {
            console.log('I run out');
        }, 300);
        break;
}
