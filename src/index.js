module.exports = (function(
    envs
) {
    var unloaded = false;

    /**
     * start listening with the handler
     * @param  {Function({})} fn the handler which takes the unload-event as attr
     * @return {Function} stopListening : a function which is used to stop listening
     */
    var exports = function(fn) {

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
        };
    };

    return exports;

})({
    node: require('./nodeJS.js'),
    browser: require('./browser.js')
});
