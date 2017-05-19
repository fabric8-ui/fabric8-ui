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
  constants = require('./constants'),
  testSupport = require('./testSupport');

describe('Work item list', function () {
  var page; 
  var until = protractor.ExpectedConditions;
  var workItemTitle = "The test workitem title";
  var workItemUpdatedTitle = "The test workitem title - UPDATED";
  var EXAMPLE_USER_1 = "Example User 1";
  var EXAMPLE_USER_2 = "Example User 2";

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);
    testSupport.setTestSpace(page);
    browser.wait(until.elementToBeClickable(page.firstWorkItem), constants.WAIT, 'Failed to find first work item');   
  });
  
/** Test searching user in the assignee drop down  */
  it ('Test searching user in the assignee drop down - desktop ', function() {
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(workItemTitle);
    page.clickQuickAddSave(); 
    page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
      var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

      browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find Assignee Icon');   
      detailPage.clickworkItemDetailAssigneeIcon();

      browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeSearch), constants.WAIT, 'Failed to find Assignee Search');  
      detailPage.setWorkItemDetailAssigneeSearch(EXAMPLE_USER_1,false);
      detailPage.clickAssignedUserDropDownList(EXAMPLE_USER_1);
      expect(detailPage.details_assigned_user().getText()).toContain(EXAMPLE_USER_1);
      browser.wait(until.elementToBeClickable(detailPage.workItemDetailCloseButton), constants.WAIT, 'Failed to find Close Button');  
      detailPage.clickWorkItemDetailCloseButton();

      /* The following code fails when run on with the Chrome browser. The browser is unable
         to open the detail pane of a workitem after it has previously opened and closed the
         detail pane of a workitem. This behavior is only being seen in this test. Performing
         the same steps manually in the browser does not encounter this error. */
      // detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);
      // expect(detailPage.details_assigned_user().getText()).toContain("Harry Potter");
      // detailPage.clickWorkItemDetailCloseButton();      
    });
  }); 
  
  /** Test able to click assigne button Icon  */
  it ('Test able to click assigne button Icon - desktop ', function() {
      page.clickWorkItemQuickAdd();
      page.typeQuickAddWorkItemTitle(workItemTitle);
      page.clickQuickAddSave().then(function() {
      page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
        var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

        browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find Assignee Icon');   
        expect(detailPage.clickworkItemDetailAssigneeIcon()).toBe(null);

        browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeSearch), constants.WAIT, 'Failed to find Assignee Search'); 
        detailPage.setWorkItemDetailAssigneeSearch(EXAMPLE_USER_1,false);
        detailPage.clickAssignedUserDropDownList(EXAMPLE_USER_1);
        expect(detailPage.details_assigned_user().getText()).toContain(EXAMPLE_USER_1);

        browser.wait(until.elementToBeClickable(detailPage.workItemDetailCloseButton), constants.WAIT, 'Failed to find Close Button');         
        detailPage.clickWorkItemDetailCloseButton();
      });
    });
  }); 
  
  /** Test to update the assigned user */ 
  it ('Test to update the assigned user - desktop ', function() {
      page.clickWorkItemQuickAdd();
      page.typeQuickAddWorkItemTitle(workItemTitle);
      page.clickQuickAddSave();
      page.workItemViewId(page.firstWorkItem).getText().then(function (text) { 
        var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

        browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find Assignee Icon');   
        detailPage.clickworkItemDetailAssigneeIcon();

        browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeSearch), constants.WAIT, 'Failed to find Assignee Search');   
        detailPage.setWorkItemDetailAssigneeSearch(EXAMPLE_USER_1,false);
        detailPage.clickAssignedUserDropDownList(EXAMPLE_USER_1);
        expect(detailPage.details_assigned_user().getText()).toContain(EXAMPLE_USER_1);

        /* The following code fails when run on with the Chrome browser. The browser is unable
           to open the detail pane of a workitem after it has previously opened and closed the
           detail pane of a workitem. This behavior is only being seen in this test. Performing
           the same steps manually in the browser does not encounter this error. */
        //      detailPage.clickWorkItemDetailCloseButton();
        //      detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);
        //      browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find Assignee Icon');   
        //      expect(detailPage.workItemDetailAssigneeName().getText()).toBe('Walter Mitty');

        browser.wait(until.elementToBeClickable(detailPage.workItemDetailCloseButton), constants.WAIT, 'Failed to find Close Button');         
        detailPage.clickWorkItemDetailCloseButton();
      });
  }); 
   
 /** User can read , update , remove assignee  */
 // https://github.com/fabric8io/fabric8-planner/issues/1854 Bug
   it ('User can read , update , remove assignee - desktop ', function() {
      page.clickWorkItemQuickAdd();
      page.typeQuickAddWorkItemTitle(workItemTitle);
      page.clickQuickAddSave().then(function() {
      page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
        var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

        browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find Assignee Icon');   
        detailPage.clickworkItemDetailAssigneeIcon();

        browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeSearch), constants.WAIT, 'Failed to find Assignee Search');   
        detailPage.setWorkItemDetailAssigneeSearch(EXAMPLE_USER_1,false);
        detailPage.clickAssignedUserDropDownList(EXAMPLE_USER_1);
        expect(detailPage.details_assigned_user().getText()).toContain(EXAMPLE_USER_1);
        detailPage.details_assigned_user().click();
        detailPage.clickworkItemDetailUnassignButton();
        expect(detailPage.workItemDetailAssigneeNameClickable().getText()).toBe('Unassigned');

        browser.wait(until.elementToBeClickable(detailPage.workItemDetailCloseButton), constants.WAIT, 'Failed to find Close Button');         
        detailPage.clickWorkItemDetailCloseButton();
      });
    });
  }); 

 /** User can Cancel assignee  */
   it ('User can Cancel assignee - desktop ', function() {
      page.clickWorkItemQuickAdd();
      page.typeQuickAddWorkItemTitle(workItemTitle);
      page.clickQuickAddSave().then(function() {
      page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
        var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

        browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find Assignee Icon');   
        detailPage.clickworkItemDetailAssigneeIcon();

        browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeSearch), constants.WAIT, 'Failed to find Assignee Search');   
        detailPage.setWorkItemDetailAssigneeSearch(EXAMPLE_USER_1,false);
        detailPage.clickAssignedUserDropDownList(EXAMPLE_USER_1);
        expect(detailPage.details_assigned_user().getText()).toContain(EXAMPLE_USER_1);
        detailPage.details_assigned_user().click();
        detailPage.clickworkItemDetailCancelButton();
        expect(detailPage.details_assigned_user().getText()).toContain(EXAMPLE_USER_1);

        /* The following code fails when run on with the Chrome browser. The browser is unable
           to open the detail pane of a workitem after it has previously opened and closed the
           detail pane of a workitem. This behavior is only being seen in this test. Performing
           the same steps manually in the browser does not encounter this error. */
        // detailPage.clickWorkItemDetailCloseButton();
        // page.clickWorkItemTitle(page.firstWorkItem, text);
        // expect(detailPage.details_assigned_user().getText()).toContain("Harry Potter");

        browser.wait(until.elementToBeClickable(detailPage.workItemDetailCloseButton), constants.WAIT, 'Failed to find Close Button');         
        detailPage.clickWorkItemDetailCloseButton();
      });
    });
  }); 

  /** User can read , update , remove assignee  */
    it ('User can read , update , remove assignee - desktop ', function() {
      page.clickWorkItemQuickAdd();
      page.typeQuickAddWorkItemTitle(workItemTitle);
      page.clickQuickAddSave().then(function() {
      page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
        var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

        browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find Assignee Icon');   
        detailPage.clickworkItemDetailAssigneeIcon();

        browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeSearch), constants.WAIT, 'Failed to find Assignee Search');   
        detailPage.setWorkItemDetailAssigneeSearch(EXAMPLE_USER_1,false);
        detailPage.clickAssignedUserDropDownList(EXAMPLE_USER_1);
        expect(detailPage.details_assigned_user().getText()).toContain(EXAMPLE_USER_1);

        detailPage.details_assigned_user().click(); 
        detailPage.setWorkItemDetailAssigneeSearch(EXAMPLE_USER_2,false);
        detailPage.clickAssignedUserDropDownList(EXAMPLE_USER_2);
        detailPage.details_assigned_user().click();
        detailPage.clickworkItemDetailCancelButton();
        expect(detailPage.details_assigned_user().getText()).toContain(EXAMPLE_USER_2);

        browser.wait(until.elementToBeClickable(detailPage.workItemDetailCloseButton), constants.WAIT, 'Failed to find Close Button');         
        detailPage.clickWorkItemDetailCloseButton();
      });
    });
  });

  /** Test name and avatar are shown up in the drop down */ 
  it ('Test name and avatar are shown up in the drop down - desktop', function() {
      page.clickWorkItemQuickAdd();
      page.typeQuickAddWorkItemTitle(workItemTitle);
      page.clickQuickAddSave();
      page.workItemViewId(page.firstWorkItem).getText().then(function (text) { 
        var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

        browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find Assignee Icon');   
        detailPage.clickworkItemDetailAssigneeIcon();

        browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeSearch), constants.WAIT, 'Failed to find Assignee Search');   
        detailPage.setWorkItemDetailAssigneeSearch(EXAMPLE_USER_2,false);
        detailPage.clickAssignedUserDropDownList(EXAMPLE_USER_2);
        expect(detailPage.details_assigned_user().getText()).toContain(EXAMPLE_USER_2);
        expect(detailPage.workItemDetailAvatar().isPresent()).toBe(true);
        expect(detailPage.workItemDetailUnAssigneeIcon.isPresent()).toBe(false);

        browser.wait(until.elementToBeClickable(detailPage.workItemDetailCloseButton), constants.WAIT, 'Failed to find Close Button');         
        detailPage.clickWorkItemDetailCloseButton();
     });
  }); 

  it ('Verify that workitems cannot be assigned to non-existent users - desktop ', function() {
      page.clickWorkItemQuickAdd();
      page.typeQuickAddWorkItemTitle(workItemTitle);
      page.clickQuickAddSave();
      page.workItemViewId(page.firstWorkItem).getText().then(function (text) { 
        var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

        browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find Assignee Icon');   
        detailPage.clickworkItemDetailAssigneeIcon();
        detailPage.setWorkItemDetailAssigneeSearch("Some User 2",false);
        expect(detailPage.assignedUserDropDownList("Some User 2").isPresent()).toBe(false);

        browser.wait(until.elementToBeClickable(detailPage.workItemDetailCloseButton), constants.WAIT, 'Failed to find Close Button');         
        detailPage.clickWorkItemDetailCloseButton();
     });
  }); 

});
