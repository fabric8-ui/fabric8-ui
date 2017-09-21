let SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
    useAllAngular2AppRoots: true,
    getPageTimeout: 30000,
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
        defaultTimeoutInterval: 60000,
        print: function () {
        }
    },

    troubleshoot: true,

    capabilities: {
      'browserName': 'chrome',
      'maxInstances': 2,
      'shardTestFiles': true,
      'loggingPrefs': {
      'driver': 'WARNING',
      'server': 'WARNING',
      'browser': 'INFO'
      },
      'chromeOptions': {
      'args': [ '--no-sandbox', '--window-workspace=1']
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
