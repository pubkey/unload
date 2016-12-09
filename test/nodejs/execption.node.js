var request = require('request-promise-native');


var unload = require('../../src/index.js');

var stopListening = unload(function(e) {
    return request('http://localhost:23230/');
});
/*
setTimeout(function() {
    throw new Error('Ouch, my knee!');
}, 1000 * 3);
*/


setTimeout(function liveLong() {
    console.log('liveLong: end');
}, 1000 * 5);
