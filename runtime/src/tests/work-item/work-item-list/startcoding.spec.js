/**
 * POC test for automated UI tests for Planner
 *  Story: Display and Update Work Item Details
 *  https://github.com/almighty/almighty-core/issues/298
 *
 * Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 *
 * beforeEach will set the mode to phone. Any tests requiring a different resolution will must set explicitly.
 *
 * @author naina-verma
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  testSupport = require('./testSupport');

describe('Work item list', function () {
  var page, items, browserMode;

var until = protractor.ExpectedConditions;
var waitTime = 30000;

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);
    testSupport.setTestSpace(page);
  });
 it('Verify start coding is visible when code base is present - Desktop', function () {
    var detailPage = page.clickWorkItemTitle(page.workItemByTitle("Title Text 0"), "id0");
    browser.wait(until.textToBePresentInElement((detailPage.startCodingElement.getText()), 'Start Coding'), waitTime);
    expect(detailPage.startCodingElement.isPresent()).toBe(true);
    expect(detailPage.startCodingElement.getText()).toBe('Start Coding');
   }); 

 it('Verify start coding is disable when creating new item  - Desktop', function () {
    var workItemTitle = 'Quick Add';
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(workItemTitle);
    page.clickQuickAddSave();
    page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
        var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text); 
          expect((detailPage.startCodingElement.isPresent().not));
          expect((detailPage.startCodingLabel().isPresent().not));
    }); 
   });
 it('Try clicking on start coding it should redirect - Desktop', function () {
    var detailPage = page.clickWorkItemTitle(page.workItemByTitle("Title Text 0"), "id0");
    // expect(detailPage.startCodingElement.isPresent()).toBe(true);
    expect(detailPage.startCodingElement.getAttribute('href')).toEqual('http://mock.service/codebase');
    detailPage.clickStartCoding();
   });

 it('Verify start coding label is visible when code base is present - Desktop', function () {
    var detailPage = page.clickWorkItemTitle(page.workItemByTitle("Title Text 0"), "id0");
    browser.wait(until.textToBePresentInElement((detailPage.startCodingElement.getText()), 'Start Coding'), waitTime);
    expect(detailPage.startCodingLabel().isPresent()).toBe(true);
    expect(detailPage.startCodingLabel().getText()).toBe('Code');
   }); 

});
