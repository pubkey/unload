const AsyncTestUtil = require('async-test-util');
const request = require('request-promise-native');
const unload = require('../../');

process.argv.shift();
process.argv.shift();

const mode = process.argv.shift();

const addUnloadFunction = (wait = 0) => {
    const stopListening = unload.add(async () => {
        await AsyncTestUtil.wait(wait);
        console.log('run exit-function');
        return request('http://localhost:23230/');
    });
    return stopListening;
};


console.log('mode: ' + mode);
switch (mode) {
    case 'exception':
        addUnloadFunction();
        setTimeout(function () {
            console.log('throw exception');
            throw new Error('Ouch, my knee!');
        }, 200);
        setTimeout(function liveLong() {
            console.log('liveLong: end');
        }, 1000 * 5);
        break;
    case 'exit':
        addUnloadFunction();
        setTimeout(function () {
            process.exit();
        }, 200);
        setTimeout(function liveLong() {
            console.log('liveLong: end');
        }, 1000 * 5);
        break;
    case 'runout':
        addUnloadFunction();
        setTimeout(function () {
            console.log('I run out');
        }, 200);
        break;
    case 'stopBefore':
        const stopListening = addUnloadFunction();
        setTimeout(function () {
            stopListening.remove();
        }, 200);
        setTimeout(function () {
            console.log('I run out');
        }, 300);
        break;
    case 'runAll':
        addUnloadFunction();
        unload.runAll();
        setTimeout(function () {
            console.log('I run out');
        }, 300);
        break;
    case 'runAlltwice':
        addUnloadFunction();
        unload.runAll();
        unload.runAll();
        setTimeout(function () {
            console.log('I run out');
        }, 300);
        break;
    case 'removeAll':
        addUnloadFunction();
        unload.removeAll();
        setTimeout(function () {
            console.log('I run out');
        }, 300);
        break;
}
