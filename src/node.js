export function addNode(fn) {
    process.on('exit', () => {
        return fn();
    });

    /**
     * on the following events,
     * the process will not end if there are
     * event-handlers attached,
     * therefore we have to call process.exit()
     */
    process.on('beforeExit', () => {
        return fn().then(() => process.exit());
    });
    // catches ctrl+c event
    process.on('SIGINT', () => {
        return fn().then(() => process.exit());
    });
    // catches uncaught exceptions
    process.on('uncaughtException', err => {
        return fn()
            .then(() => {
                console.trace(err);
                process.exit(101);
            });
    });
}
