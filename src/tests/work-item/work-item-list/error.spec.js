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

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  constants = require('./constants'),
  testSupport = require('./testSupport');

describe('Work item list', function () {
  var page; 
  var until = protractor.ExpectedConditions;
  var workItemTitle = 'The test workitem title';

  /* Expected error messages */
  const WORKITEM_TITLE = 'title is a required field';
  const ITERATION_TITLE = 'This field is required.';

  beforeEach(function () {      
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);
    testSupport.setTestSpace(page);
    browser.wait(until.elementToBeClickable(page.firstWorkItem), constants.WAIT, 'Failed to find first work item');   
  });
  
/** Verify error message for deleting workitem title */
  it ('Verify that correct error message is diaplayed when workitem title is deleted - desktop ', function() {
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(workItemTitle);
    page.clickQuickAddSave(); 
    page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
      var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);
       browser.wait(until.elementToBeClickable(detailPage.clickWorkItemDetailTitle), constants.WAIT, 'Failed to find Workitem title');   

       detailPage.clickWorkItemTitleDiv();

       /* Simply deleting the text does not work on Firefox - https://openshift.io/openshiftio/openshiftio/plan/detail/781 */
       detailPage.setWorkItemDetailTitle ("   ", false);

       browser.wait(until.presenceOf(detailPage.deletedTitleError), constants.WAIT, 'Failed to find Workitem title error');
       browser.wait(until.presenceOf(detailPage.disabledWorkItemTitleSaveIcon), constants.WAIT, 'Failed to find disabledWorkItemTitleSaveIcon'); 

       /* Verify that error message is displayed and the title save button is disabled */
       expect(detailPage.deletedTitleError.getText()).toBe(WORKITEM_TITLE);
       expect(detailPage.deletedTitleError.isPresent()).toBe(true);

       detailPage.clickWorkItemDetailCloseButton();    
    });
  }); 

  /** Verify error message is displayed if an attempt is made to create an iteration without a name */
 it('Verify that Iteration name is required', function() {
    page.clickIterationAddButton();
    page.clickCreateIteration();
    expect(page.getHelpBoxIteration()).toBe(ITERATION_TITLE);
    page.clickCancelIteration();
  });


});
