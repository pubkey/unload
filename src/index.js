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

    return exports;
})({
    node: require('./node.js'),
    browser: require('./browser.js')
});
