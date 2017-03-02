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
 * @author naina-verma
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  testSupport = require('./testSupport'),
  constants = require('./constants');

describe('Work item list', function () {
  var page, items, browserMode;

  var until = protractor.ExpectedConditions;
  var WORK_ITEM_TITLE = "The test workitem title";
  var WORK_ITEM_UPDATED_TITLE = "The test workitem title - UPDATED";
  var WORK_ITEM_DESCRIPTION = "The test workitem description";
  var WORK_ITEM_UPDATED_DESCRIPTION = "The test workitem description - UPDATED";
  var EXAMPLE_USER_0 = "Example User 0";
  var EXAMPLE_USER_1 = "Example User 1";
  var MOCK_WORKITEM_TITLE_0 = "Title Text 0";

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);
  });

  /* User can read, update, remove assignee on a workitem  */
  it('User can read, update, remove assignee and delete WI', function() {
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(WORK_ITEM_TITLE);
    page.clickQuickAddSave().then(function() {
      page.workItemViewId(page.workItemByTitle(WORK_ITEM_TITLE)).getText().then(function (text) {

        var detailPage = page.clickWorkItemTitle(page.workItemByTitle(WORK_ITEM_TITLE), text);
        browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find Assignee Icon');   
        
        detailPage.clickworkItemDetailAssigneeIcon();
        detailPage.setWorkItemDetailAssigneeSearch(EXAMPLE_USER_1, false);
        detailPage.clickAssignedUserDropDownList(EXAMPLE_USER_1);
        expect(detailPage.details_assigned_user().getText()).toContain(EXAMPLE_USER_1);

        detailPage.details_assigned_user().click();
        detailPage.clickworkItemDetailUnassignButton();
        expect(detailPage.workItemDetailAssigneeNameClickable().getText()).toBe('Unassigned');
        detailPage.clickWorkItemDetailCloseButton();
        page.clickWorkItemKebabButton(page.firstWorkItem);
        page.clickWorkItemKebabDeleteButton(page.firstWorkItem);
        browser.wait(until.elementToBeClickable(page.firstWorkItem), constants.WAIT, 'Failed to find Assignee Icon');   

        page.clickWorkItemPopUpDeleteConfirmButton().then(function() {
  
        expect(page.workItemTitle(page.firstWorkItem)).not.toBe(WORK_ITEM_TITLE);
        expect(page.workItemTitle(page.workItemByNumber(0))).not.toBe(WORK_ITEM_TITLE);
      });
      });
    });
  });

  /* Create a new workitem, fill in the details, save, retrieve, update, save, verify updates are saved */
  it('should find and update the workitem through its detail page - desktop.', function() {

    /* Create a new workitem */
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(WORK_ITEM_TITLE);
    page.typeQuickAddWorkItemDesc(WORK_ITEM_DESCRIPTION);
    page.clickQuickAddSave().then(function() {
      expect(page.workItemTitle(page.firstWorkItem)).toBe(WORK_ITEM_TITLE);

      /* Fill in/update the new work item's title and details field */
      expect(page.workItemTitle(page.workItemByTitle(WORK_ITEM_TITLE))).toBe(WORK_ITEM_TITLE);

      page.workItemViewId(page.workItemByTitle(WORK_ITEM_TITLE)).getText().then(function (text) {
        var detailPage = page.clickWorkItemTitle(page.workItemByTitle(WORK_ITEM_TITLE), text);
        browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find Assignee Icon');   

        detailPage.clickWorkItemDetailTitleClick();
        detailPage.setWorkItemDetailTitle (WORK_ITEM_UPDATED_TITLE, false);
        detailPage.clickWorkItemTitleSaveIcon();
        detailPage.clickWorkItemDetailDescription()
        detailPage.setWorkItemDetailDescription (WORK_ITEM_UPDATED_DESCRIPTION, false);
        detailPage.clickWorkItemDescriptionSaveIcon();

        detailPage.clickWorkItemDetailCloseButton();
        browser.wait(until.presenceOf(page.firstWorkItem), constants.WAIT, 'Failed to find workItemList');
        expect(page.workItemTitle(page.firstWorkItem)).toBe(WORK_ITEM_UPDATED_TITLE);
      });
    });
  });

  /* Vary the order of execution of the workitems */
  it('should top workitem to the bottom and back to the top via the workitem kebab - phone.', function() {

    page.allWorkItems.count().then(function (text) {
      var totalCount = text

      /* Verify that the first work item is in the correct position */
      expect(page.workItemTitle(page.workItemByIndex(0))).toBe(MOCK_WORKITEM_TITLE_0);
      compareWorkitems (page, 0, MOCK_WORKITEM_TITLE_0);

      /* Move the workitem to the bottom */
      page.clickWorkItemKebabButton (page.workItemByTitle(MOCK_WORKITEM_TITLE_0)).then(function() {
        page.clickWorkItemKebabMoveToBottomButton(page.workItemByTitle(MOCK_WORKITEM_TITLE_0));
        compareWorkitems (page, totalCount - 1, MOCK_WORKITEM_TITLE_0);
      });
      /* And then move it back to the top  This is not working with chrome due to Kebab is hidden for bottom WI*/
      // page.clickWorkItemKebabButton (page.workItemByTitle(MOCK_WORKITEM_TITLE_0)).then(function() {
      //   page.clickWorkItemKebabMoveToTopButton(page.workItemByTitle(MOCK_WORKITEM_TITLE_0));
      //   compareWorkitems (page, 0, MOCK_WORKITEM_TITLE_0);
      // });

    });

  });

  /* Test that the Quick add work item is visible */
  it('Test Quick workitem visible without authorization - phone.', function () {
    page.clickLogoutButton().click();
    expect(page.quickAddbuttonById().isPresent()).toBeFalsy();
  });

  /* Create workitem - verify user and icon */
  it('Edit and check WorkItem , creatorname and image is reflected', function () {
    page.clickDetailedDialogButton();
    var detailPage = page.clickDetailedIcon("userstory");
    browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find workItem');   

    detailPage.setWorkItemDetailTitle (WORK_ITEM_TITLE, false);
    detailPage.clickWorkItemTitleSaveIcon();
    detailPage.clickWorkItemDetailDescription()
    detailPage.setWorkItemDetailDescription (WORK_ITEM_DESCRIPTION, true);
    detailPage.clickWorkItemDescriptionSaveIcon();
    expect(detailPage.getCreatorUsername()).toBe(EXAMPLE_USER_0);
    expect(detailPage.getCreatorAvatar().isPresent()).toBe(true);
    detailPage.clickWorkItemDetailCloseButton();

    expect(page.workItemTitle(page.workItemByTitle(WORK_ITEM_TITLE))).toBe(WORK_ITEM_TITLE);
    browser.wait(until.elementToBeClickable(page.firstWorkItem), constants.WAIT, 'Failed to find First Work Item');   

    page.workItemViewId(page.workItemByTitle(WORK_ITEM_TITLE)).getText().then(function (text) {
      page.clickWorkItemTitle(page.workItemByTitle(WORK_ITEM_TITLE), text);
      expect(detailPage.getCreatorUsername()).toBe(EXAMPLE_USER_0);
      expect(detailPage.getCreatorAvatar().isPresent()).toBe(true);
      expect(detailPage.getImageURL()).toBe('https://avatars.githubusercontent.com/u/2410471?v=3&s=20');
   });
 });

 it('check date showing up correctly - Desktop', function () {
    var detailPage = page.clickWorkItemTitle(page.firstWorkItem, "Title Text 0");
    browser.wait(until.elementToBeClickable(page.firstWorkItem), constants.WAIT, 'Failed to find workItem');   
    expect(detailPage.getCreatedtime()).toBe('a few seconds ago');
    detailPage.clickWorkItemDetailCloseButton();
    
//    detailPage = page.workItemByURLId("id1");
//    expect(detailPage.workItemDetailTitle.getText()).toBe('17 minutes ago');
   });
});

/* Compare an expected and actual work item - the offset values enable us to track
   workitems after they have been moved. */
  var compareWorkitems = function(page, targetIndex, expectedTitle) {
    expect(page.workItemTitle(page.workItemByIndex(targetIndex))).toBe(expectedTitle);
  }

