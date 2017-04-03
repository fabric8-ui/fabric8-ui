/**
 * POC test for automated UI tests for openshift.io
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

var until = protractor.ExpectedConditions;

var OpenShiftIoStartPage = require('../page-objects/openshift-io-start.page'),
    OpenShiftIoRHDLoginPage = require('../page-objects/openshift-io-RHD-login.page'),
    OpenShiftIoGithubLoginPage = require('../page-objects/openshift-io-github-login.page'),
    OpenShiftIoDashboardPage = require('../page-objects/openshift-io-dashboard.page'),
    testSupport = require('../testSupport'),
    constants = require("../constants");

describe('openshift.io End-to-End POC test - Scenario - New user registers', function () {
  var page, items, browserMode;
  var EMAIL_ADDRESS = "badaddress@bad.com";
  var VOUCHER_CODE = "bad voucher code";

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    // Failed: Error while waiting for Protractor to sync with the page: "window.getAllAngularTestabilities is not a function"
    // http://stackoverflow.com/questions/38050626/angular-2-with-protractorjs-failed-error-while-waiting-for-protractor-to-sync-w 
    browser.ignoreSynchronization = true;
    page = new OpenShiftIoStartPage();  
  });

  /* Simple test for new user */
//  it('should enable a new user to register', function() {
//
//    page.setEmail (EMAIL_ADDRESS);
//    page.setVoucherCode (VOUCHER_CODE);
//
//    page.clickRegisterButton();
//    expect (page.toastMessage.getText()).toBe("We've placed you on the waitlist! We'll be in touch soon.");
//
//    /* Verify that after registration the user is prevented from registering again */
//    page.clickToastMessageCloseButton();
//    expect (page.registerButton.isEnabled()).toBe(false);
//    expect (page.email.isEnabled()).toBe(false);
//    expect (page.voucherCode.isEnabled()).toBe(false);
//  });

  /* Simple test for registered user */
  it('should enable a registered user to login', function() {
    OpenShiftIoRHDLoginPage = page.clickLoginButton();
    OpenShiftIoGithubLoginPage = OpenShiftIoRHDLoginPage.clickGithubLoginButton();

    browser.wait(until.presenceOf(OpenShiftIoGithubLoginPage.githubLoginField), constants.LONG_WAIT, 'Failed to find github loginbutton');

    OpenShiftIoGithubLoginPage.clickGithubLoginField();
    OpenShiftIoGithubLoginPage.typeGithubLoginField("almightytest");

    OpenShiftIoGithubLoginPage.clickGithubPassword();
    OpenShiftIoGithubLoginPage.typeGithubPassword("myalmighty@123");

    OpenShiftIoDashboardPage = OpenShiftIoGithubLoginPage.clickGithubLoginButton();
    OpenShiftIoDashboardPage.clickNewSpaceButton();

    var spaceTime = returnTime();
    OpenShiftIoDashboardPage.typeNewSpaceName((spaceTime));

    OpenShiftIoDashboardPage.typeDevProcess("Scenario Driven Planning");
    OpenShiftIoDashboardPage.clickCreateSpaceButton();
    OpenShiftIoDashboardPage.clickWizardButton();
    OpenShiftIoDashboardPage.clickNewSpaceCancelButton();

    OpenShiftIoDashboardPage.clickBrowseSpaces();
    OpenShiftIoDashboardPage.clickSelectSpace(spaceTime);
    
    browser.wait(until.urlContains('http://prod-preview.openshift.io/almusertest1/'+ spaceTime), constants.WAIT);
    browser.wait(until.urlIs('http://prod-preview.openshift.io/almusertest1/'+ spaceTime), constants.WAIT); 
    expect(browser.getCurrentUrl()).toEqual('http://prod-preview.openshift.io/almusertest1/'+ spaceTime);
//    browser.wait(until.presenceOf(element(by.linkText("Overview"))), constants.WAIT, 'Failed to find active filter');  
  });

});

  /* Get system time in seconds since 1970 */
  var returnTime = function () {
    var d = new Date();
    var n = d.getTime();
    console.log ("Creating space: " + n.toString());
    return n.toString();
  }






