var assert = require('assert');
var pingCount = require('./helper/getPingCount.node.js');
var exec = require('child_process').exec;

var request = require('request-promise-native');
var unload = require('../src/index.js');


describe('nodejs.test.js', function() {
    var startCounter = 0;
    describe('init', function() {
        it('w8 until pingServer started', function(done) {
            var check = function() {
                pingCount()
                    .then(function() {
                        done();
                    })
                    .catch(function() {
                        return check();
                    });
            };
            check();
        });
        it('get start-counter', function(done) {
            pingCount().then(function(c) {
                startCounter = c;
                done();
            });
        });
    });

    describe('basic', function() {
        it('exception', function(done) {
            exec('node ./test/helper/node.js exception', function() {
                pingCount().then(function(c) {
                    assert.equal(startCounter + 1, c);
                    startCounter = c;
                    done();
                });
            });
        });
        it('runout', function(done) {
            exec('node ./test/helper/node.js runout', function() {
                pingCount().then(function(c) {
                    assert.equal(startCounter + 1, c);
                    startCounter = c;
                    done();
                });
            });
        });
        it('stopBefore', function(done) {
            exec('node ./test/helper/node.js stopBefore', function() {
                pingCount().then(function(c) {
                    assert.equal(startCounter, c);
                    done();
                });
            });
        });
        it('exit', function(done) {
            exec('node ./test/helper/node.js exit', function() {
                pingCount().then(function(c) {
                    assert.equal(startCounter, c);
                    done();
                });
            });
        });
        it('force run', function(done) {
            var stopListening = unload.add(function() {
                return request('http://localhost:23230/');
            });
            stopListening.run();
            setTimeout(function() {
                pingCount().then(function(c) {
                    assert.equal(startCounter + 1, c);
                    startCounter = c;
                    done();
                });
            }, 300);
        });
    });

    describe('runAll', function() {
        it('should run all', function(done) {
            exec('node ./test/helper/node.js runAll', function() {
                pingCount().then(function(c) {
                    assert.equal(startCounter + 1, c);
                    startCounter = c;
                    done();
                });
            });
        });
        it('should run all twice only once', function(done) {
            exec('node ./test/helper/node.js runAlltwice', function() {
                pingCount().then(function(c) {
                    assert.equal(startCounter + 1, c);
                    startCounter = c;
                    done();
                });
            });
        });
    });
    describe('removeAll', function() {
        it('should remove all', function(done) {
            exec('node ./test/helper/node.js removeAll', function() {
                pingCount().then(function(c) {
                    assert.equal(startCounter, c);
                    done();
                });
            });
        });
    });
});
