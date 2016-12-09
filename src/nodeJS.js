module.exports = (function() {
    var exports = {};

    exports.add = function(fn) {
        var ret = [];
        if (
            typeof process === 'object' &&
            process.on &&
            typeof process.on === 'function'
        ) {
            process.on('beforeExit', function(e) {
                var maybePromise = fn(e);
                Promise.resolve(maybePromise)
                    .then(function() {
                        process.exit();
                    });
            });
            ret.push('beforeExit');

            //catches ctrl+c event
            process.on('SIGINT', function(e) {
                var maybePromise = fn(e);
                Promise.resolve(maybePromise)
                    .then(function() {
                        process.exit();
                    });
            });
            ret.push('SIGINT');

            //catches uncaught exceptions
            process.on('uncaughtException', function(e) {
                var maybePromise = fn(e);
                Promise.resolve(maybePromise)
                    .then(function() {
                        process.exit();
                    });
            });
            ret.push('uncaughtException');
        }

        return ret;
    };

    exports.remove = function(fn, listenerKeys) {
        listenerKeys.forEach(function(key) {
            switch (key) {
                case 'beforeExit':
                case 'SIGINT':
                case 'uncaughtException':
                    process.removeListener(key, fn);
                    break;
            }
        });
    };


    return exports;

})();
