const configuration = {
    basePath: '',
    frameworks: [
        'mocha',
        'browserify'
    ],
    files: [
        '../test_tmp/browser.test.js'
    ],
    // reporters: ['progress'],
    port: 9876,
    colors: true,
    autoWatch: false,

    // Karma plugins loaded
    plugins: [
        'karma-mocha',
        'karma-browserify',
        'karma-chrome-launcher'
    ],

    // Source files that you wanna generate coverage for.
    // Do not include tests or libraries (these files will be instrumented by Istanbul)
    preprocessors: {
        '../test_tmp/*.test.js': ['browserify']
    },

    client: {
        mocha: {
            bail: false,
            timeout: 12000
        },
        captureConsole: true
    },
    browsers: ['ChromeNoSandbox'],
    browserDisconnectTimeout: 24000,
    processKillTimeout: 24000,
    customLaunchers: {
        ChromeNoSandbox: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    },
    singleRun: true
};

module.exports = function (config) {
    config.set(configuration);
};