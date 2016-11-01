/**
 * POC test for automated UI tests for ALMighty
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
 * @author ldimaggi
 */

var WorkItemListPage = require('./work-item-list.page'),
  testSupport = require('./testSupport');

describe('Work item list', function () {
  var page, items, startCount, browserMode;

var until = protractor.ExpectedConditions;
var waitTime = 30000;

  beforeEach(function () {
    testSupport.setBrowserMode('phone');
    page = new WorkItemListPage();    
    page.allWorkItems.count().then(function(originalCount) { startCount = originalCount; });
  });

/* Create a new workitem, fill in the details, save, retrieve, update, save, verify updates are saved */
  it('should find and update the workitem.', function() { 
    testSupport.setBrowserMode('desktop');	

    /* Create a new workitem */
    var workItemTitle = "The test workitem title";
    var workItemDescription = "The test workitem description";
    var workItemUpdatedDescription = "The test workitem description - UPDATED";
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(workItemTitle);
    page.typeQuickAddWorkItemDesc(workItemDescription);
    page.clickQuickAddSave().then(function() {
      expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);
  
      /* Fill in/update the new work item's details field */
      expect(page.workItemDescription(page.firstWorkItem)).toBe(workItemDescription);

      page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) { 
        detailPage = page.clickWorkItemViewButton(page.workItemViewButton(page.firstWorkItem), text);
        detailPage.setWorkItemDetailDescription (workItemUpdatedDescription, false);
        detailPage.clickWorkItemDetailSaveButton();
        browser.wait(until.presenceOf(page.firstWorkItem), waitTime, 'Failed to find workItemList');
        expect(page.workItemDescription(page.firstWorkItem)).toBe(workItemUpdatedDescription);
      });

    });

  });

});
