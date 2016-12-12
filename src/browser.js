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
