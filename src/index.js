import { addBrowser } from './browser.js';
import { addNode } from './node.js';

/**
 * Use the code directly to prevent import problems
 * with the detect-node package.
 * @link https://github.com/iliakan/detect-node/blob/master/index.js
 */
const isNode = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';

const USE_METHOD = isNode ? addNode : addBrowser;
const LISTENERS = new Set();

let startedListening = false;
function startListening() {
    if (startedListening) {
        return;
    }
    startedListening = true;
    USE_METHOD(runAll);
}

export function add(fn) {
    startListening();
    if (typeof fn !== 'function') {
        throw new Error('Listener is no function');
    }
    LISTENERS.add(fn);

    const addReturn = {
        remove: () => LISTENERS.delete(fn),
        run: () => {
            LISTENERS.delete(fn);
            return fn();
        }
    };
    return addReturn;
}

export function runAll() {
    const promises = [];
    LISTENERS.forEach(function (fn) {
        promises.push(fn());
        LISTENERS.delete(fn);
    });
    return Promise.all(promises);
}

export function removeAll() {
    LISTENERS.clear();
}

export function getSize() {
    return LISTENERS.size;
}
