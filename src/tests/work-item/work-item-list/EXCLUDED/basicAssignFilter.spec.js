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
 * 
 * March 28, 2017 - This test is excluded from the functional tests. The supporting mock code 
 * functions correctly when filters are defined and executed manually in the Chrome browser.
 * When the test is run under Protractor, the filtering is not performed. 
 * 
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  testSupport = require('./testSupport'),
  WorkItemDetailPage = require('./page-objects/work-item-detail.page'),
  CommonPage = require('./page-objects/common.page'),
  constants = require('./constants');

describe('Basic filter workitems by assignee Test', function () {
  var page;
  var until = protractor.ExpectedConditions;
  var EXAMPLE_USER_1 = "Example User 1";

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);
    testSupport.setTestSpace(page);
    browser.wait(until.elementToBeClickable(page.firstWorkItem), constants.WAIT, 'Failed to find first work item');   
  });

  it ('should add workitems from the filtered results.', function() {

    page.clickWorkItemFilterPulldown();
    page.clickFilterAssignToMe();
    expect (page.allWorkItems.count()).toBe(0);
    // The following line allows for manual debugging of filtering
    //browser.wait(until.presenceOf(element(by.id("this-is-not-here"))), constants.WAIT, 'Failed to find active filter');  

    /* Test fails with PhantomJS due to this issue:
    https://github.com/fabric8io/fabric8-planner/issues/319#issuecomment-274175439 */

    page.clickWorkItemFilterPulldown();
    page.clickFilterAssignToMe();
    browser.wait(until.presenceOf(page.currentActiveFilter), constants.WAIT, 'Failed to find active filter');  
    expect (page.allWorkItems.count()).toBe(1);
  });

  // TDO - Add more tests after enhancement for dynamic refresh of filters is implemented
  // see: https://github.com/fabric8io/fabric8-planner/issues/791
});

/* Create and assign a new workitem */
var createWorkitem = function(page, workItemTitle, assignee) {

  var until = protractor.ExpectedConditions;

  page.clickWorkItemQuickAdd();
  page.typeQuickAddWorkItemTitle(workItemTitle);
  page.clickQuickAddSave().then(function() {
    page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
      var detailPage = page.clickWorkItemTitle(page.workItemByTitle(workItemTitle), text);

      browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find Assignee Icon');   
      detailPage.clickworkItemDetailAssigneeIcon();
      detailPage.setWorkItemDetailAssigneeSearch(assignee,false);
      detailPage.clickAssignedUserDropDownList(assignee);
      browser.wait(until.elementToBeClickable(detailPage.workItemDetailCloseButton), constants.WAIT, 'Failed to find Close Button');         
      detailPage.clickWorkItemDetailCloseButton();
    });
  });
  page.clickQuickAddCancel();
};
