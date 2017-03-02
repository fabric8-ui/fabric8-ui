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
  var page, items, browserMode;
  var until = protractor.ExpectedConditions;

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
//    browser.ignoreSynchronization = true;
    page = new WorkItemListPage(true);
  });
  
/**Test searching user in the assignee drop down  */
  it('Test searching user in the assignee drop down - desktop ', function() {
    var workItemTitle = "The test workitem title";
    var workItemUpdatedTitle = "The test workitem title - UPDATED";
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(workItemTitle);
    page.clickQuickAddSave(); 
    page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
      var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

      browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find Assignee Icon');   
//        detailPage.workItemDetailAssigneeIcon().getLocation().then(function (navDivLocation) {
//          initTop = navDivLocation.y;
//          initLeft = navDivLocation.x;
//          console.log ("x = " + navDivLocation.x + ", y = " + navDivLocation.y);
//        });    
      detailPage.clickworkItemDetailAssigneeIcon();

      browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeSearch), constants.WAIT, 'Failed to find Assignee Search');  
      detailPage.setWorkItemDetailAssigneeSearch("Example User 1",false);
      detailPage.clickAssignedUserDropDownList("Example User 1");
      expect(detailPage.details_assigned_user().getText()).toContain("Example User 1");

      browser.wait(until.elementToBeClickable(detailPage.workItemDetailCloseButton), constants.WAIT, 'Failed to find Close Button');  
      detailPage.clickWorkItemDetailCloseButton();

      // TODO Fails on Chrome      
      // page.clickWorkItemTitle(page.firstWorkItem, text);
      // expect(detailPage.details_assigned_user().getText()).toContain("Harry Potter");
      // detailPage.clickWorkItemDetailCloseButton();
    });
  }); 
  
  /**Test able to click assigne button Icon  */
  it('Test able to click assigne button Icon - desktop ', function() {
      var workItemTitle = "The test workitem title";
      var workItemUpdatedTitle = "The test workitem title - UPDATED";
      page.clickWorkItemQuickAdd();
      page.typeQuickAddWorkItemTitle(workItemTitle);
      page.clickQuickAddSave().then(function() {
      page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
      var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

      browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find Assignee Icon');   
      expect(detailPage.clickworkItemDetailAssigneeIcon()).toBe(null);
      detailPage.setWorkItemDetailAssigneeSearch("Example User 1",false);
      detailPage.clickAssignedUserDropDownList("Example User 1");
      expect(detailPage.details_assigned_user().getText()).toContain("Example User 1");
      detailPage.clickWorkItemDetailCloseButton();
      });
    });
  }); 
  
  /**Test to update the assigned user */ 
  it('Test to update the assigned user - desktop ', function() {
    var workItemTitle = "The test workitem title";
      var workItemUpdatedTitle = "The test workitem title - UPDATED";
      page.clickWorkItemQuickAdd();
      page.typeQuickAddWorkItemTitle(workItemTitle);
      page.clickQuickAddSave();
      page.workItemViewId(page.firstWorkItem).getText().then(function (text) { 
      var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

      browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find Assignee Icon');   
      detailPage.clickworkItemDetailAssigneeIcon();

      detailPage.setWorkItemDetailAssigneeSearch("Example User 1",false);
      detailPage.clickAssignedUserDropDownList("Example User 1");
      expect(detailPage.details_assigned_user().getText()).toContain("Example User 1");
      // TODO Fails on Chrome
      // detailPage.clickWorkItemDetailCloseButton();
      // page.clickWorkItemTitle(page.firstWorkItem, text);
      // expect(detailPage.workItemDetailAssigneeName().getText()).toBe('Walter Mitty');
      });
  }); 
   
 /**User can read , update , remove assignee  */
   it('User can read , update , remove assignee - desktop ', function() {
      var workItemTitle = "The test workitem title";
      var workItemUpdatedTitle = "The test workitem title - UPDATED";
      page.clickWorkItemQuickAdd();
      page.typeQuickAddWorkItemTitle(workItemTitle);
      page.clickQuickAddSave().then(function() {
      page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
      var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

      browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find Assignee Icon');   
      detailPage.clickworkItemDetailAssigneeIcon();

      detailPage.setWorkItemDetailAssigneeSearch("Example User 1",false);
      detailPage.clickAssignedUserDropDownList("Example User 1");
      expect(detailPage.details_assigned_user().getText()).toContain("Example User 1");
      detailPage.details_assigned_user().click();
      detailPage.clickworkItemDetailUnassignButton();
      expect(detailPage.workItemDetailAssigneeNameClickable().getText()).toBe('Unassigned');
      });
    });
  }); 

 /**User can Cancel assignee  */
   it('User can Cancel assignee - desktop ', function() {
      var workItemTitle = "The test workitem title";
      var workItemUpdatedTitle = "The test workitem title - UPDATED";
      page.clickWorkItemQuickAdd();
      page.typeQuickAddWorkItemTitle(workItemTitle);
      page.clickQuickAddSave().then(function() {
      page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
      var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

      browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find Assignee Icon');   
      detailPage.clickworkItemDetailAssigneeIcon();

      detailPage.setWorkItemDetailAssigneeSearch("Example User 1",false);
      detailPage.clickAssignedUserDropDownList("Example User 1");
      expect(detailPage.details_assigned_user().getText()).toContain("Example User 1");
      detailPage.details_assigned_user().click();
      detailPage.clickworkItemDetailCancelButton();
      expect(detailPage.details_assigned_user().getText()).toContain("Example User 1");
      // TODO Fails on Chrome
      // detailPage.clickWorkItemDetailCloseButton();
      // page.clickWorkItemTitle(page.firstWorkItem, text);
      // expect(detailPage.details_assigned_user().getText()).toContain("Harry Potter");
      });
    });
  }); 

  /**User can read , update , remove assignee  */
    it('User can read , update , remove assignee - desktop ', function() {
      var workItemTitle = "The test workitem title";
      var workItemUpdatedTitle = "The test workitem title - UPDATED";
      page.clickWorkItemQuickAdd();
      page.typeQuickAddWorkItemTitle(workItemTitle);
      page.clickQuickAddSave().then(function() {
      page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
      var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

      browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find Assignee Icon');   
      detailPage.clickworkItemDetailAssigneeIcon();

      detailPage.setWorkItemDetailAssigneeSearch("Example User 1",false);
      detailPage.clickAssignedUserDropDownList("Example User 1");
      expect(detailPage.details_assigned_user().getText()).toContain("Example User 1");
      detailPage.details_assigned_user().click();
      detailPage.setWorkItemDetailAssigneeSearch("Example User 2",false);
      detailPage.clickAssignedUserDropDownList("Example User 2");
      detailPage.details_assigned_user().click();
      detailPage.clickworkItemDetailCancelButton();
      expect(detailPage.details_assigned_user().getText()).toContain("Example User 2");
      });
    });
  });

  /**Test name and avatar are shown up in the drop down */ 
  it('Test name and avatar are shown up in the drop down - desktop', function() {
    var workItemTitle = "The test workitem title";
      var workItemUpdatedTitle = "The test workitem title - UPDATED";
      page.clickWorkItemQuickAdd();
      page.typeQuickAddWorkItemTitle(workItemTitle);
      page.clickQuickAddSave();
      page.workItemViewId(page.firstWorkItem).getText().then(function (text) { 
      var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

      browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find Assignee Icon');   
      detailPage.clickworkItemDetailAssigneeIcon();

      detailPage.setWorkItemDetailAssigneeSearch("Example User 2",false);
      detailPage.clickAssignedUserDropDownList("Example User 2");
      expect(detailPage.details_assigned_user().getText()).toContain("Example User 2");
      expect(detailPage.workItemDetailAvatar().isPresent()).toBe(true);
      expect(detailPage.workItemDetailUnAssigneeIcon.isPresent()).toBe(false);
      detailPage.clickWorkItemDetailCloseButton();
     });
  }); 

  it('Verify that workitems cannot be assigned to non-existent users - desktop ', function() {
    var workItemTitle = "The test workitem title";
      var workItemUpdatedTitle = "The test workitem title - UPDATED";
      page.clickWorkItemQuickAdd();
      page.typeQuickAddWorkItemTitle(workItemTitle);
      page.clickQuickAddSave();
      page.workItemViewId(page.firstWorkItem).getText().then(function (text) { 
      var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

      browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find Assignee Icon');   
      detailPage.clickworkItemDetailAssigneeIcon();
      detailPage.setWorkItemDetailAssigneeSearch("Some User 2",false);
      expect(detailPage.assignedUserDropDownList("Some User 2").isPresent()).toBe(false);
     });
  }); 

});
