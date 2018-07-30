function add(fn) {
    window.addEventListener('beforeunload', fn, false);

    /**
     * TODO add fallback for safari-mobile
     * @link https://stackoverflow.com/a/26193516/3443137
     */
}

export default {
    add
};