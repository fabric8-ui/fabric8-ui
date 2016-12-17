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

var CommonPage = require('./page-objects/common.page'),
  MicroservicesPage = require('./page-objects/microservices.page'),
  testSupport = require('./testSupport');

describe('Microservices page', function () {
  var page, browserMode;
  var until = protractor.ExpectedConditions;
  var waitTime = 30000;

  beforeEach(function () {
    testSupport.setBrowserMode('phone');
    page = new CommonPage();
  });

  it('should contain correct page title.', function() {
// Commented out pending resolution of: https://github.com/almighty/almighty-ui/issues/472      
//      var theMicroservicesPage = page.clickMicroServicesMenuTab();
//      expect(browser.getCurrentUrl()).toEqual('http://localhost:8088/intro');
//      browser.wait(until.urlContains('intro'), waitTime, 'Failed to open microservices page');
  });

});

