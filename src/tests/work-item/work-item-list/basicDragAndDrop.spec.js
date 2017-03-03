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

/*
Drag and drop testing is blocked. The behavior seen is:

* On PhantomJS - The test fails - it's not possible to determine where the failure occurs.
* On Chrome - The test fails - visual observation shows that the drag and drop operation is not performed.
* On Firefox - The test fails - The mouseDown operation seems to function, but the location used 
  cannot be changed from that defined by the physical location of the browser on the system on which
  the test is run. The mouseMove and mouseUp operations are not performed. If the test is run in a 
  headless mode with Xvfb, the same problems are seen.

  Multiple other people/groups are encountering related issues. Multiple workarounds have been
  published, buit these workaround have not been seen to be successful for us.

  Bug, drag and drop fails on Chrome browser:
     https://bugs.chromium.org/p/chromedriver/issues/detail?id=841

  Bug, drag and drop fails on Chrome browser:
     https://github.com/angular/protractor/issues/583

  Bug, drag and drop fails with Selenium
     https://github.com/seleniumhq/selenium-google-code-issue-archive/issues/3604

  Drag and drop helper workaround (fails)
     https://gist.github.com/rcorreia/2362544

  Another drag and drop helper workaround (fails)
     https://gist.github.com/druska/624501b7209a74040175

  Another drag and drop helper workaround (fails)
     https://gist.github.com/douglaslise/884692bb54cdf8e76702c01bc18defbd

  Another drag and drop helper workaround (fails)
     https://gist.github.com/druska/624501b7209a74040175

  Ref: Multiple approaches to performing drag and drop 
     http://stackoverflow.com/questions/25664551/how-to-simulate-a-drag-and-drop-action-in-protractor

  Ref: Selenium Action methods:
     http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/actions_exports_ActionSequence.html
*/

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  testSupport = require('./testSupport'),
  WorkItemDetailPage = require('./page-objects/work-item-detail.page'),
  CommonPage = require('./page-objects/common.page');

describe('Drag and drop Test', function () {
  var page, browserMode;
  var until = protractor.ExpectedConditions;
  var waitTime = 30000;

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);  
    testSupport.setTestSpace(page);  
  });

  it('should drag and drop the source into into the target position - phone.', function() {
    var sourceElement = page.workItemByTitle("Title Text 0");
    var targetElement = page.workItemByTitle("Title Text 7");

    browser.actions().dragAndDrop(sourceElement, targetElement).perform().then(function() {
        //browser.wait(until.textToBePresentInElement(page.workItemByNumber(7), "Title Text 0"), waitTime);
        //expect(page.workItemTitle(page.workItemByNumber(7))).toBe("Title Text 0");
        // Test commented out pending resolution of PhantomJS/Chrome/Firefox/Protractor/Angular bugs
        // see: https://github.com/fabric8io/fabric8-planner/issues/554
    });

  });
  
});
