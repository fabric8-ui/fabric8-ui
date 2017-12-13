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
  constants = require('./constants'),
  testSupport = require('./testSupport');

fdescribe('Work item list', function () {
  var page;
  var until = protractor.ExpectedConditions;
  var workItemTitle = "The test workitem title";
  var EXAMPLE_USER_1 = "Example User 1";
  var EXAMPLE_USER_2 = "Example User 2";

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);
    testSupport.setTestSpace(page);
    browser.wait(until.elementToBeClickable(page.firstWorkItem), constants.WAIT, 'Failed to find first work item');
  });

  /** Test searching user in the assignee drop down */
  it('Test basic user assignment ', function () {
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(workItemTitle);
    page.clickQuickAddSave().then(function () {
      var detailPage = page.clickWorkItemTitle(workItemTitle);
      browser.wait(until.elementToBeClickable(detailPage.workItemDetailCloseButton), constants.WAIT, 'Failed to find detail page close Icon');
      expect(detailPage.AddAssigneeButton.isDisplayed()).toBe(true);
      detailPage.clickAddAssigneeButton();
      expect(detailPage.AssigneeDropdown.isDisplayed()).toBe(true);
      expect(detailPage.AssigneeSearch.isDisplayed()).toBe(true);
      // to check assignee list items
      expect(detailPage.AssigneeDropdownListItem.getText()).toContain(EXAMPLE_USER_1);
      //to Verify that workitems cannot be assigned to non-existent users
      expect(detailPage.AssigneeDropdownListItem.getText()).not.toContain("some user");

      detailPage.setAssigneeSearch((EXAMPLE_USER_1, false));
      expect(detailPage.AssigneeDropdownListItem.getText()).toContain(EXAMPLE_USER_1);
      expect(detailPage.AssigneeDropdownListItem.getText()).not.toContain("some user");

      //to  user has been clicked
      detailPage.clickAssigneeListItem(EXAMPLE_USER_1);
      detailPage.clickAssigneeListItem(EXAMPLE_USER_2);
      detailPage.clickCloseAssigneeDropdown();
      expect(detailPage.AssigneeDropdown.isDisplayed()).toBe(false);

      //Verify assignee has been assigned
      expect(detailPage.AssignUsers.getText()).toContain(EXAMPLE_USER_1);
      expect(detailPage.AssignUsers.getText()).toContain(EXAMPLE_USER_2);
    });
  });

  /** Unassign the user */
  it('Unassign the user ', function () {
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(workItemTitle);
    page.clickQuickAddSave().then(function () {
      var detailPage = page.clickWorkItemTitle(workItemTitle);
      browser.wait(until.elementToBeClickable(detailPage.workItemDetailCloseButton), constants.WAIT, 'Failed to find detail page close Icon');
      detailPage.clickAddAssigneeButton();
      // to unassign same user by double click
      detailPage.clickAssigneeListItem(EXAMPLE_USER_1);
      detailPage.clickAssigneeListItem(EXAMPLE_USER_1);
      detailPage.clickCloseAssigneeDropdown();
      //assign user to wi
      detailPage.clickAddAssigneeButton();
      detailPage.clickAssigneeListItem(EXAMPLE_USER_1)
      detailPage.clickAssigneeListItem(EXAMPLE_USER_2);
      detailPage.clickCloseAssigneeDropdown();
      //to unassign user to wi
      detailPage.clickAddAssigneeButton();
      detailPage.clickAssigneeListItem(EXAMPLE_USER_1);
      detailPage.clickCloseAssigneeDropdown();
      expect(detailPage.AssignUsers.getText()).not.toContain(EXAMPLE_USER_1);
      expect(detailPage.AssignUsers.getText()).toContain(EXAMPLE_USER_2);
    });
  });

  /** Close Assignee Dropdown without any change */
  it('Close Assignee Dropdown without any change', function () {
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(workItemTitle);
    page.clickQuickAddSave().then(function () {
      var detailPage = page.clickWorkItemTitle(workItemTitle);
      browser.wait(until.elementToBeClickable(detailPage.workItemDetailCloseButton), constants.WAIT, 'Failed to find detail page close Icon');
      expect(detailPage.AssignUsers.isPresent()).toBe(false);
      detailPage.clickAddAssigneeButton();
      detailPage.clickCloseAssigneeDropdown();
      expect(detailPage.AssignUsers.isPresent()).toBe(false);
    });
  });
});
