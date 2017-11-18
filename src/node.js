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
