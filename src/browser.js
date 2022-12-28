/* global WorkerGlobalScope */

export function addBrowser(fn) {
    if (typeof WorkerGlobalScope === 'function' && self instanceof WorkerGlobalScope) {
        /**
         * Because killing a worker does directly stop the excution
         * of the code, our only chance is to overwrite the close function
         * which could work some times.
         * @link https://stackoverflow.com/q/72903255/3443137
         */
        const oldClose = self.close.bind(self);
        self.close = () => {
            fn();
            return oldClose();
        };
    } else {

        /**
         * if we are on react-native, there is no window.addEventListener
         * @link https://github.com/pubkey/unload/issues/6
         */
        if (typeof window.addEventListener !== 'function') {
            return;
        }

        /**
         * for normal browser-windows, we use the beforeunload-event
         */
        window.addEventListener('beforeunload', () => {
            fn();
        }, true);

        /**
         * for iframes, we have to use the unload-event
         * @link https://stackoverflow.com/q/47533670/3443137
         */
        window.addEventListener('unload', () => {
            fn();
        }, true);
    }

    /**
     * TODO add fallback for safari-mobile
     * @link https://stackoverflow.com/a/26193516/3443137
     */
}
