/**
 * POC test for automated UI tests for ALMighty
 *  
 * Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 * 
 * beforeEach will set the mode to phone. Any tests requiring a different resolution will must set explicitly. 
 * 
 * @author ldimaggi
 */

var CommonPage = require('../page-objects/common.page'),
  SettingsPage = require('../page-objects/settings.page'),
  testSupport = require('../testSupport');

describe('Settings page', function () {
  var page, browserMode;
  var until = protractor.ExpectedConditions;
  var waitTime = 30000;

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new CommonPage();
  });

  it('should contain correct page title.', function() {
      var theSettingspage = page.clickSettingsMenuTab();
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8088/settings');
      browser.wait(until.urlContains('settings'), waitTime, 'Failed to open settings page');
  });

});
