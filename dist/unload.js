(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
module.exports = (function() {
    var exports = {};

    exports.add = function(fn) {
        var ret = {};
        if (
            typeof window === 'object' &&
            window.addEventListener &&
            typeof window.addEventListener === 'function'
        ) {
            window.addEventListener('beforeunload', fn, false);
            ret.beforeunload = fn;
        }

        /**
         * TODO add fallback for safari-mobile
         * @link http://stackoverflow.com/questions/3239834/window-onbeforeunload-not-working-on-the-ipad
         */

        return ret;
    };

    exports.remove = function(fn, listeners) {
        Object.keys(listeners).forEach(function(key) {
            var fn = listeners[key];
            switch (key) {
                case 'beforeunload':
                    window.removeEventListener('beforeunload',
                        fn,
                        false
                    );
                    break;
            }
        });
    };
    return exports;
})();

},{}],3:[function(require,module,exports){
var unload = require('./index.js');
window['unload'] = unload;

},{"./index.js":4}],4:[function(require,module,exports){
module.exports = (function(
    envs
) {
    var exports = {};
    var unloaded = false;
    var debug = false;
    var count = 0;
    var cache = {};

    exports.debug = function() {
        debug = true;
    };

    /**
     * start listening with the handler
     * @param  {Function({})} fn the handler which takes the unload-event as attr
     * @return {Function} stopListening : a function which is used to stop listening
     */
    exports.add = function(fn) {
        count++;

        // wrap fn to ensure it executes once
        var fnWrapped = function(arg1, arg2, arg3) {
            if (unloaded) return;
            unloaded = true;
            return fn(arg1, arg2, arg3);
        };

        var hasListeners = {};
        Object.keys(envs).forEach(function(envKey) {
            hasListeners[envKey] = envs[envKey].add(fnWrapped);
        });
        var retFn = function stopListening() {
            Object.keys(hasListeners).forEach(function(envKey) {
                envs[envKey].remove(fnWrapped, hasListeners[envKey]);
            });

            debug && console.log('unload.stopListening()');
            debug && console.dir(cache[count]);
        };
        retFn.run = function() {
            fnWrapped();
        };

        cache[count] = {
            fn: fn,
            remove: retFn,
            listeners: hasListeners
        };

        debug && console.log('unload.add()');
        debug && console.dir(cache[count]);

        return retFn;
    };

    exports.runAll = function() {
        if (unloaded) return;
        unloaded = true;
        Object.keys(cache).forEach(function(key) {
            cache[key].fn();
        });
    };

    exports.removeAll = function() {
        Object.keys(cache).forEach(function(key) {
            cache[key].remove();
        });
    };

    // used for testing purposes
    exports._getCache = function(){
        return cache;
    };

    // used for testing purposes
    exports._resetUnloaded = function(){
        unloaded = false;
    };

    return exports;
})({
    node: require('./node.js'),
    browser: require('./browser.js')
});

},{"./browser.js":2,"./node.js":5}],5:[function(require,module,exports){
(function (process){
module.exports = (function() {
    var exports = {};

    exports.add = function(fn) {
        var ret = {};
        if (
            typeof process === 'object' &&
            process.on &&
            typeof process.on === 'function'
        ) {
            ret.beforeExit = function(e) {
                var maybePromise = fn(e);
                Promise.resolve(maybePromise)
                    .then(function() {
                        process.exit();
                    });
            };
            process.on('beforeExit', ret.beforeExit);

            ret.exit = function(e) {
                var maybePromise = fn(e);
                Promise.resolve(maybePromise);
            };
            process.on('exit', ret.exit);


            //catches ctrl+c event
            ret.SIGINT = function(e) {
                var maybePromise = fn(e);
                Promise.resolve(maybePromise)
                    .then(function() {
                        process.exit();
                    });
            };
            process.on('SIGINT', ret.SIGINT);

            //catches uncaught exceptions
            ret.uncaughtException = function(e) {
                var maybePromise = fn(e);
                Promise.resolve(maybePromise)
                    .then(function() {
                        process.exit();
                    });
            };
            process.on('uncaughtException', ret.uncaughtException);
        }
        return ret;
    };

    exports.remove = function(fn, listeners) {
        Object.keys(listeners).forEach(function(key) {
            var fn = listeners[key];
            switch (key) {
                case 'beforeExit':
                case 'SIGINT':
                case 'uncaughtException':
                case 'exit':
                    process.removeListener(key, fn);
                    break;
            }
        });
    };


    return exports;
})();

}).call(this,require('_process'))
},{"_process":1}]},{},[3]);