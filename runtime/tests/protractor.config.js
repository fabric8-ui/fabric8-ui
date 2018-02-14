let SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
    useAllAngular2AppRoots: true,
    getPageTimeout: 30000,
    directConnect: process.env.DIRECT_CONNECT === 'true',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['./../src/tests/**/*.spec.js'],
    exclude: ['./../src/tests/**/*test-template.spec.js','./../src/tests/**/*work-item-dynamic-fields.spec.js','./../src/tests/**/EXCLUDED/*.spec.js'],
    suites: {
        smokeTest: './../src/tests/**/smokeTest.spec.js',
        fullTest:  './../src/tests/**/*.spec.js'
    },
    jasmineNodeOpts: {
        isVerbose: true,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 300000,
        print: function () {
        }
    },
    troubleshoot: true,
    maxSessions: 5,
    capabilities: {
        'browserName': 'chrome',
        'shardTestFiles': true,
        'maxInstances': 5,
        'loggingPrefs': {
            'driver': 'WARNING',
            'server': 'WARNING',
            'browser': 'INFO'
        },
        'chromeOptions': {
            'args': process.env.HEADLESS_MODE === 'true'? ['--no-sandbox', '--headless'] : ['--no-sandbox']
        }
    },

    onPrepare: function () {
        jasmine.getEnv().addReporter(new SpecReporter({
        spec: {
            displayStacktrace: true,
            displayDuration: true,
        },
        summary: {
            displayDuration: true
        }
        }));
    }
};
