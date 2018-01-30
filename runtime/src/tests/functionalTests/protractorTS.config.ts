import { Config } from "protractor";
import { SpecReporter } from "jasmine-spec-reporter";

// Full protractor configuration file reference could be found here:
// https://github.com/angular/protractor/blob/master/lib/config.ts
let conf: Config = {
  framework: "jasmine2",

  jasmineNodeOpts: {
    showColors: true,
    silent: true,
    isVerbose: true,
    defaultTimeoutInterval: 60 * 60 * 1000 // 60 mins for spec to run
  },

  directConnect: process.env.DIRECT_CONNECTION === "true",
  useAllAngular2AppRoots: true,
  getPageTimeout: 1 * 60 * 1000, // must load within 1 min
  seleniumAddress: "http://localhost:4444/wd/hub",

  // Ref: https://github.com/angular/protractor/tree/master/exampleTypescript/asyncAwait
  SELENIUM_PROMISE_MANAGER: false,

  specs: ["specs/*.js", "specs/**/*.js"],

  suites: {
    smokeTest: ["specs/**/*.spec.js"]
  },

  // see: https://github.com/angular/protractor/blob/master/docs/timeouts.md
  capabilities: {
    browserName: "chrome",
    chromeOptions: {
      args: process.env.HEADLESS_MODE === 'true'? ['--no-sandbox', '--headless'] : ['--no-sandbox']
    }
  },

  // Assign the test reporter to each running instance
  onPrepare: function() {
    jasmine.getEnv().addReporter(
      new SpecReporter({
        spec: {
          displayStacktrace: true,
          displayDuration: true
        },
        summary: {
          displayDuration: true
        }
      })
    );
  },
};

exports.config = conf;
