module.exports = function(config) {
    config.set({

        frameworks: ['jasmine', 'karma-typescript'],

        files: [
            { pattern: "src/base.spec.ts" },
            { pattern: "src/app/**/*.+(ts|html)" },
        ],

        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-typescript',
            'karma-coverage',
            'karma-mocha',
            'karma-mocha-reporter'
        ],

        exclude: [
            'src/app/shared/wit-api.provider.ts', // this class produces some errors when compiled in test mode
            'src/app/services/login.service.ts', // this requires some dependency from runtime, so exclude it
            'src/tests/*', // excluding files for functional test and page objects
            'tests/*' // excluding files for functional test and page objects
        ],

        preprocessors: {
            "**/*.ts": ["karma-typescript"]
        },

        karmaTypescriptConfig: {
            bundlerOptions: {
                entrypoints: /\.spec\.ts$/,
                transforms: [
                    require("karma-typescript-angular2-transform"),
                    require("karma-typescript-es6-transform")()
                ],
                //not excluding ngx-widgets from the bundling causes syntax errors in the final bundle(?!).
                exclude: ['ngx-widgets']
            },
            compilerOptions: {
                lib: ["ES2015", "DOM"]
            },
            exclude: [
                'dist',
                'node_modules',
                'runtime', // explicitly exclude the runtime here
                'src/app/shared/wit-api.provider.ts', // this class produces some errors when compiled in test mode
                'src/app/services/login.service.ts', // this requires some dependency from runtime, so exclude it
                'src/tests/*', // excluding files for functional test and page objects
                'tests/*' // excluding files for functional test and page objects
            ]
        },
        reporters: ['mocha', 'coverage'],
        coverageReporter: {
            reporters: [{type: 'json', dir: './coverage'}]
        },
        // See https://github.com/karma-runner/karma-chrome-launcher/issues/158#issuecomment-339265457
        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
          ChromeHeadlessNoSandbox: {
            base: 'ChromeHeadless',
            flags: ['--no-sandbox']
          }
        },
        singleRun: true

    });
};


// ADD to check logs
// logLevel: config.LOG_DEBUG
