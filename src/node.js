// set to true to log events
const DEBUG = false;

function add(fn) {
    process.on('exit', () => {
        DEBUG && console.log('node: exit');
        return fn();
    });

    /**
     * on the following events,
     * the process will not end if there are
     * event-handlers attached,
     * therefore we have to call process.exit()
     */
    process.on('beforeExit', () => {
        DEBUG && console.log('node: beforeExit');
        return fn().then(() => process.exit());
    });
    // catches ctrl+c event
    process.on('SIGINT', () => {
        DEBUG && console.log('node: SIGNINT');
        return fn().then(() => process.exit());
    });
    // catches uncaught exceptions
    process.on('uncaughtException', () => {
        DEBUG && console.log('node: uncaughtException');
        return fn().then(() => process.exit());
    });
}

export default {
    add
};