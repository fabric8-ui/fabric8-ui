exports.config = {
    useAllAngular2AppRoots: true,
    getPageTimeout: 30000,
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['src/tests/**/*.spec.js'],    
    exclude: ['src/tests/**/*work-item-dynamic-fields.spec.js','src/tests/**/EXCLUDED/*.spec.js','src/tests/**/EE/*.spec.js'],
    suites: {
    smokeTest: 'src/tests/**/smokeTest.spec.js',
    fullTest:  'src/tests/**/*.spec.js'
    },
    
    jasmineNodeOpts: {
        isVerbose: true,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 60000
    },

    troubleshoot: true,

    capabilities: {
      'browserName': 'chrome',
      'maxInstances': 2,
      'shardTestFiles': true,
      'chromeOptions': {
        'args': [ '--no-sandbox']
      }
    }
};
