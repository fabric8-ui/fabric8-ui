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

var Fabric8StartPage = require('../page-objects/fabric8-start.page'),
  testSupport = require('../testSupport'),
  constants = require("../constants"),
  Fabric8RHDLoginPage = require("../page-objects/fabric8-RHD-login.page"),
  GithubLoginPage = require("../page-objects/github-login.page"),
  CompleteRegistrationPage = require ("../page-objects/complete-registration.page"),
  Fabric8MainPage = require('../page-objects/fabric8-main.page');

describe('Fabric8 POC test', function () {
  var page, items, browserMode;

  beforeEach(function () {
    testSupport.setBrowserMode('tablet');
    page = new Fabric8StartPage();  
    // Failed: Error while waiting for Protractor to sync with the page: "window.getAllAngularTestabilities is not a function"
    // http://stackoverflow.com/questions/38050626/angular-2-with-protractorjs-failed-error-while-waiting-for-protractor-to-sync-w 
    browser.ignoreSynchronization = true;
  });

  it('should have the github login button on the page.', function() {
    Fabric8RHDLoginPage = page.clickGithubLoginButton();
    browser.wait(until.presenceOf(Fabric8RHDLoginPage.githubLoginButton), constants.LONG_WAIT, 'Failed to find github loginbutton');
    
    GithubLoginPage = Fabric8RHDLoginPage.clickGithubLoginButton();
    browser.wait(until.presenceOf(GithubLoginPage.githubLoginField), constants.LONG_WAIT, 'Failed to find github login');
   
    GithubLoginPage.clickGithubLoginField();
    GithubLoginPage.typeGithubLoginField("almightytest");

    GithubLoginPage.clickGithubPassword();
    GithubLoginPage.typeGithubPassword("myalmighty@123");

//    CompleteRegistrationPage = GithubLoginPage.clickGithubLoginButton();
//    browser.wait(until.presenceOf(CompleteRegistrationPage.fullName), constants.WAIT, 'Failed to find registration name');
//
//    CompleteRegistrationPage.clickFullName();
//    CompleteRegistrationPage.typeFullName("The fullname");
//
//    CompleteRegistrationPage.clickBio();
//    CompleteRegistrationPage.typeBio("The Bio");
//
//    CompleteRegistrationPage.clickUserName();
//    CompleteRegistrationPage.typeUserName("The Username");
//
//    CompleteRegistrationPage.clickUrlField();
//    CompleteRegistrationPage.typeUrlField("The Url");
//
//    CompleteRegistrationPage.clickEmailField();
//    CompleteRegistrationPage.typeEmailField("The email");

    //Fabric8MainPage = CompleteRegistrationPage.clickConfirmRegistrationButton();
    
    Fabric8MainPage = GithubLoginPage.clickGithubLoginButton();

    browser.wait(until.presenceOf(Fabric8MainPage.startCollaboratingButton), constants.LONG_WAIT, 'Failed to find start collaborating button');
    Fabric8MainPage.clickStartCollaboratingButton();

    browser.wait(until.presenceOf(Fabric8MainPage.spaceName), constants.LONG_WAIT, 'Failed to find space name field');
    Fabric8MainPage.clickSpaceName();
    Fabric8MainPage.typeSpaceName("The test space name");

    browser.wait(until.presenceOf(Fabric8MainPage.nextButton), constants.LONG_WAIT, 'Failed to find next button');
    Fabric8MainPage.clickNextButton();

    browser.wait(until.presenceOf(Fabric8MainPage.wizardButton), constants.LONG_WAIT, 'Failed to find quickstart button');
    Fabric8MainPage.clickQuickstartButton();

    browser.wait(until.presenceOf(Fabric8MainPage.projectName), constants.LONG_WAIT, 'Failed to find github login');
    Fabric8MainPage.clickProjectName();
    Fabric8MainPage.typeProjectName("The test project name");

    browser.wait(until.presenceOf(Fabric8MainPage.topLevelPackage), constants.LONG_WAIT, 'Failed to find top level package');
    Fabric8MainPage.clickTopLevelPackage();
    Fabric8MainPage.typeTopLevelPackage("the.top.level.package");

    browser.wait(until.presenceOf(Fabric8MainPage.projectVersion), constants.LONG_WAIT, 'Failed to find project version');
    Fabric8MainPage.clickProjectVersion();
    Fabric8MainPage.typeProjectVersion("The test project version");

    Fabric8MainPage.clickFinishButton();

  });

});
