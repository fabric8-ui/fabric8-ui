/**
 * Support module for automated UI tests for ALMighty
 * 
 * Ref: https://www.sitepoint.com/understanding-module-exports-exports-node-js/
 * 
 * @author ldimaggi
 */

module.exports = {

/**
 * Set the browser window size
 * 
 * Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 * 
 */
  setBrowserMode: function(browserModeStr) {
    switch (browserModeStr) {
	  case 'phone':
	    browser.driver.manage().window().setSize(375, 667);
      break;
	  case 'tablet':
        browser.driver.manage().window().setSize(768, 1024);
      break;
      case 'desktop':
        browser.driver.manage().window().setSize(1920, 1080);
    } 
  },

  /** 
  * Write screenshot to file 
  * Example usage:
  *    browser.takeScreenshot().then(function (png) {
  *      testSupport.writeScreenShot(png, 'exception.png');
  *  });
  * 
  * Ref: http://blog.ng-book.com/taking-screenshots-with-protractor/
  */ 
  writeScreenShot: function(data, filename) {
    var fs = require('fs');
    var stream = fs.createWriteStream(filename);
    stream.write(new Buffer(data, 'base64'));
    stream.end();
  }

};
