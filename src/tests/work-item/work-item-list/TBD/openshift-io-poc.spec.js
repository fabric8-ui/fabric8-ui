/**
 * POC test for automated UI tests for Fabric8
 *  
 * Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 * 
 * beforeEach will set the mode to phone. Any tests requiring a different resolution will must set explicitly. 
 * 
 * @author ldimaggi, nverma
 */

let until = protractor.ExpectedConditions;

var OpenShiftIoStartPage = require('../page-objects/openshift-io-start.page'),
  testSupport = require('../testSupport'),
  constants = require("../constants");

describe('openshift.io End-to-End POC test - Scenario - New user registers', function () {
  var page, items, browserMode;
  var EMAIL_ADDRESS = "badaddress@bad.com";
  var VOUCHER_CODE = "bad voucher code";

  beforeEach(function () {
    testSupport.setBrowserMode('tablet');
    // Failed: Error while waiting for Protractor to sync with the page: "window.getAllAngularTestabilities is not a function"
    // http://stackoverflow.com/questions/38050626/angular-2-with-protractorjs-failed-error-while-waiting-for-protractor-to-sync-w 
    browser.ignoreSynchronization = true;
    page = new OpenShiftIoStartPage();  
  });

  it('should enable a new user to register', function() {

    page.setEmail (EMAIL_ADDRESS);
    page.setVoucherCode (VOUCHER_CODE);

    page.clickRegisterButton();
    expect (page.toastMessage.getText()).toBe("We've placed you on the waitlist! We'll be in touch soon.");

    /* Verify that after registration the user is prevented from registering again */
    page.clickToastMessageCloseButton();
    expect (page.registerButton.isEnabled()).toBe(false);
    expect (page.email.isEnabled()).toBe(false);
    expect (page.voucherCode.isEnabled()).toBe(false);





  });

});
