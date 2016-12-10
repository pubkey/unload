var mocha = require('mocha');
var assert = require('assert');
var pingCount = require('../helper/getPingcount.node.js');

describe('nodejs.test.js', function() {
    var startCounter = 0;
    describe('init', function() {
        it('get start-counter', function(done) {
            pingCount.then(function(c) {
                startCounter = c;
                done();
            });
        });

    });

});
