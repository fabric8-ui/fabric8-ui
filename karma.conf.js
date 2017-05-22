module.exports = function(config) {
    config.set({

        frameworks: ['jasmine', 'karma-typescript'],

        files: [
            { pattern: "src/base.spec.ts" },
            { pattern: "src/app/mock/**/*.+(ts|html)" },
            { pattern: "src/app/pipes/**/*.+(ts|html)" },
            { pattern: "src/app/services/**/*.+(ts|html)" }
        ],

        plugins: [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-typescript', 
            'karma-coverage', 
            'karma-mocha', 
            'karma-mocha-reporter'
        ],

        exclude: [
            'src/app/mock/standalone/sso-api.provider.ts', // this class produces some errors when compiled in test mode
            'src/app/shared/wit-api.provider.ts', // this class produces some errors when compiled in test mode
            'src/app/services/login.service.ts' // this requires some dependency from runtime, so exclude it
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
                // not excluding ngx-widgets from the bundling causes syntax errors in the final bundle(?!).
                exclude: ['ngx-widgets']
            },
            compilerOptions: {
                lib: ["ES2015", "DOM"]
            },
            exclude: [
                'node_modules',
                'runtime', // explicitly exclude the runtime here
                'src/app/mock/standalone/sso-api.provider.ts', // this class produces some errors when compiled in test mode
                'src/app/shared/wit-api.provider.ts', // this class produces some errors when compiled in test mode
                'src/app/services/login.service.ts' // this requires some dependency from runtime, so exclude it
            ]
        },

        reporters: ['progress', 'karma-typescript', 'mocha'],

        browsers: ['PhantomJS'],

        singleRun: true,

    });
};
