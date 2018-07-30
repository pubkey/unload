const assert = require('assert');
const exec = require('child_process').exec;
const request = require('request-promise-native');
const AsyncTestUtil = require('async-test-util');

const pingCount = require('./helper/getPingCount.node.js');
const unload = require('../');

describe('nodejs.test.js', function () {
    let startCounter = 0;

    describe('init', function () {
        it('w8 until pingServer started', async () => {
            let ok = false;
            while (!ok) {
                await AsyncTestUtil.wait(200);
                try {
                    await pingCount();
                    ok = true;
                } catch (err) { }
            }
            assert.ok(ok);
        });
        it('get start-counter', async () => {
            await pingCount();
        });
    });
    describe('internal', () => {
        it('add / remove', () => {
            const fn = () => { };
            const ret = unload.add(fn);
            ret.remove();
            const ret2 = unload.add(fn);
            ret2.run();
            unload.removeAll();
        });
        it('.runAll()', async () => {
            let did = false;
            const fn = function () {
                setTimeout(function () {
                    did = true;
                }, 100);
            };
            unload.add(fn);
            unload.runAll();
            await AsyncTestUtil.wait(200);
            assert.ok(did);
            unload.removeAll();
        });
        it('.getSize()', () => {
            const s = unload.getSize();
            assert.deepEqual(s, 0);
            unload.add(() => { });
            const s2 = unload.getSize();
            assert.deepEqual(s2, 1);
            unload.removeAll();
            const s3 = unload.getSize();
            assert.deepEqual(s3, 0);
        });
    });
    describe('basic', function () {
        it('exception', function (done) {
            exec('node ./test/helper/node.js exception', function () {
                pingCount().then(function (c) {
                    assert.equal(startCounter + 1, c);
                    startCounter = c;
                    done();
                });
            });
        });
        it('runout', function (done) {
            exec('node ./test/helper/node.js runout', function () {
                pingCount().then(function (c) {
                    assert.equal(startCounter + 1, c);
                    startCounter = c;
                    done();
                });
            });
        });
        it('stopBefore', function (done) {
            exec('node ./test/helper/node.js stopBefore', function () {
                pingCount().then(function (c) {
                    assert.equal(startCounter, c);
                    done();
                });
            });
        });
        it('exit', function (done) {
            exec('node ./test/helper/node.js exit', function () {
                pingCount().then(function (c) {
                    assert.equal(startCounter, c);
                    done();
                });
            });
        });
        it('force run', function (done) {
            const stopListening = unload.add(function () {
                return request('http://localhost:23230/');
            });
            stopListening.run();
            setTimeout(function () {
                pingCount().then(function (c) {
                    assert.equal(startCounter + 1, c);
                    startCounter = c;
                    done();
                });
            }, 300);
        });
    });

    describe('runAll', () => {
        it('should run all', function (done) {
            exec('node ./test/helper/node.js runAll', function () {
                pingCount().then(function (c) {
                    assert.equal(startCounter + 1, c);
                    startCounter = c;
                    done();
                });
            });
        });
        it('should run all twice only once', function (done) {
            exec('node ./test/helper/node.js runAlltwice', function () {
                pingCount().then(function (c) {
                    assert.equal(startCounter + 1, c);
                    startCounter = c;
                    done();
                });
            });
        });
    });
    describe('removeAll', function () {
        it('should remove all', function (done) {
            exec('node ./test/helper/node.js removeAll', function () {
                pingCount().then(function (c) {
                    assert.equal(startCounter, c);
                    done();
                });
            });
        });
    });
});
