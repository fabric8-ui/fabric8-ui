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

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  testSupport = require('./testSupport'),
  constants = require('./constants'),
  WorkItemDetailPage = require('./page-objects/work-item-detail.page');

var workItemTitle = "The test workitem title";
var workItemUpdatedTitle = "The test workitem title - UPDATED";
var workItemDescription = "The test workitem description";
var workItemUpdatedDescription = "The test workitem description - UPDATED";
var until = protractor.ExpectedConditions;
var waitTime = 30000;

describe('Work item list', function () {
  var page, items, browserMode;
  var until = protractor.ExpectedConditions;
  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);   
    testSupport.setTestSpace(page);
  });

 it('Create WorkItem and creatorname and image is relecting', function () {
   page.clickDetailedDialogButton();
   var detailPage = page.clickDetailedIcon("userstory");

   browser.wait(until.elementToBeClickable(detailPage.workItemDetailTitle), constants.WAIT, 'Failed to find workItemDetailTitle');   
   detailPage.setWorkItemDetailTitle (workItemTitle, false);

   detailPage.clickWorkItemTitleSaveIcon();
   detailPage.clickWorkItemDetailDescription()
   detailPage.setWorkItemDetailDescription (workItemDescription, true);
   detailPage.clickWorkItemDescriptionSaveIcon();
   expect(detailPage.getCreatorUsername()).toBe('Example User 0');
   expect(detailPage.getCreatorAvatar().isPresent()).toBe(true);     
   detailPage.clickWorkItemDetailCloseButton();
   browser.wait(until.presenceOf(page.workItemByTitle(workItemTitle)), waitTime, 'Failed to find workItemList');
   expect(page.workItemTitle(page.workItemByTitle(workItemTitle))).toBe(workItemTitle);
 });

 it('Edit and check WorkItem , creatorname and image is relecting', function () {
   page.clickDetailedDialogButton();
   var detailPage = page.clickDetailedIcon("userstory");

   browser.wait(until.elementToBeClickable(detailPage.workItemDetailTitle), constants.WAIT, 'Failed to find workItemDetailTitle'); 
   detailPage.setWorkItemDetailTitle (workItemTitle, false);

   detailPage.clickWorkItemTitleSaveIcon();
   detailPage.clickWorkItemDetailDescription()
   detailPage.setWorkItemDetailDescription (workItemDescription, true);
   detailPage.clickWorkItemDescriptionSaveIcon();
   expect(detailPage.getCreatorUsername()).toBe('Example User 0');
   expect(detailPage.getCreatorAvatar().isPresent()).toBe(true);     
   detailPage.clickWorkItemDetailCloseButton();
   browser.wait(until.presenceOf(page.workItemByTitle(workItemTitle)), waitTime, 'Failed to find workItemList');
   expect(page.workItemTitle(page.workItemByTitle(workItemTitle))).toBe(workItemTitle);
   page.workItemViewId(page.firstWorkItem).getText().then(function (text) { 
      page.clickWorkItemTitle(page.firstWorkItem, text);
      expect(detailPage.getCreatorUsername()).toBe('Example User 0');
      expect(detailPage.getCreatorAvatar().isPresent()).toBe(true);  
      expect(detailPage.getImageURL()).toBe('https://avatars.githubusercontent.com/u/2410471?v=3&s=20');
   });
 });
 it('check Creator is readonly - desktop', function () {
   page.clickDetailedDialogButton();
   var detailPage = page.clickDetailedIcon("userstory");
   browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find Assignee Icon');   
   expect(detailPage.getCreatorDefaultIcon().isPresent()).toBe(true);
   expect(detailPage.getCreatorUsername()).toBe('Creator not found');
   });
 /*  This test is blocked by : https://github.com/almighty/almighty-ui/issues/605
 it('check Creator is shown as loggedIn user - desktop', function () {
   page.clickDetailedDialogButton();
   var detailPage = page.clickDetailedIcon("userstory");
   detailPage.clickCreatorDefaultIcon();
   expect(detailPage.getCreatorAvatar().isPresent()).toBe(true); 
   expect(detailPage.getCreatorUsername()).toBe('Example User 0');
   });
 */
/* Test commented out pending resolution of issue: https://github.com/almighty/almighty-ui/issues/538  */
//  it('should create a new workitem through the detail dialog - phone.', function () {
//    page.clickDetailedDialogButton();
//    var detailPage = page.clickDetailedIcon("userstory");
//    detailPage.setWorkItemDetailTitle (workItemTitle, false);
//    detailPage.clickWorkItemTitleSaveIcon();
//    detailPage.clickWorkItemDetailDescription()
//    detailPage.setWorkItemDetailDescription (workItemDescription, true);
//    detailPage.clickWorkItemDescriptionSaveIcon();
//    detailPage.clickWorkItemDetailCloseButton();
//    browser.wait(until.presenceOf(page.workItemByTitle(workItemTitle)), waitTime, 'Failed to find workItemList');
//    expect(page.workItemTitle(page.workItemByTitle(workItemTitle))).toBe(workItemTitle);
//  });
  
});
