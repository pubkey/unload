'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.add = add;
exports.runAll = runAll;
exports.removeAll = removeAll;
exports.getSize = getSize;

var _detectNode = require('detect-node');

var _detectNode2 = _interopRequireDefault(_detectNode);

var _browser = require('./browser.js');

var _browser2 = _interopRequireDefault(_browser);

var _node = require('./node.js');

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var USE_METHOD = _detectNode2['default'] ? _node2['default'] : _browser2['default'];
var LISTENERS = new Set();

var startedListening = false;
function startListening() {
    if (startedListening) return;
    startedListening = true;
    USE_METHOD.add(runAll);
}

function add(fn) {
    startListening();
    if (typeof fn !== 'function') throw new Error('The "listener" argument must be of type Function. Received type ' + (typeof fn === 'undefined' ? 'undefined' : (0, _typeof3['default'])(fn)));
    LISTENERS.add(fn);

    var addReturn = {
        remove: function remove() {
            return LISTENERS['delete'](fn);
        },
        run: function run() {
            LISTENERS['delete'](fn);
            return fn();
        }
    };
    return addReturn;
}

function runAll() {
    var promises = [];
    LISTENERS.forEach(function (fn) {
        promises.push(fn());
        LISTENERS['delete'](fn);
    });
    return Promise.all(promises);
}

function removeAll() {
    LISTENERS.clear();
}

function getSize() {
    return LISTENERS.size;
}