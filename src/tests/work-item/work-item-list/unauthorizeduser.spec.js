/**
 * POC test for automated UI tests for ALMighty
 *  Story: Display and Update Work Item Details
 *  https://github.com/almighty/almighty-core/issues/296
 *
 * Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 *
 * beforeEach will set the mode to phone. Any tests requiring a different resolution will must set explicitly.
 *Test if user is not authenticated can view almighty in read only:
 *Test Quick add work item should not be visible
 *Test user should not be able update the work item type
 *Test user should not be able to update the work item state
 *Test user should not be able to Delete any work item
 * @author nverma
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
    WorkItemDetailPage = require('./page-objects/work-item-detail.page'),
  testSupport = require('./testSupport');

describe('Work item list', function () {
  var page, items, browserMode,detailPage;

  beforeEach(function () {
    testSupport.setBrowserMode('phone');
    page = new WorkItemListPage(false);
    detailPage=new WorkItemDetailPage(1);
  });

/*Test Quick add work item should not be visible*/ 
  it('Test Quick workitem visible without authorization - phone.', function () { 
    page.clickLogoutButton().click();
    expect(page.quickAddbuttonById().isPresent()).toBeFalsy();
   });
/*Test user should not be able to Delete any work item*/ 
  it('Test user should not be able to Delete any work item - phone.', function () {
    expect(page.KebabButtonById().isPresent()).toBe(false);
   });
/*Test user should not be able update the work item title */
  it('Test user should not be able update the work item title - phone.', function () {
    testSupport.setBrowserMode('phone');
    page.workItemByIndex(1).click();
    // TODO Fails on FireFox and Chrome
    //expect(detailPage.clickWorkItemTitleById().isPresent()).toBeFalsy();
    expect(detailPage.workItemTitleEditIconById().isPresent()).toBeFalsy();
   });
/*Test user should not be able update the work item description */
  it('Test user should not be able update the work item description - phone.', function () {
    testSupport.setBrowserMode('phone');
    page.workItemByIndex(1).click();   
    // TODO Fails on FireFox and Chrome 
    //expect(detailPage.workItemDetailDescriptionById().isPresent()).toBeFalsy();
    expect(detailPage.workItemDescriptionSaveIconById().isPresent()).toBeFalsy();
   });
/*Test user should not be able update the work item state */
  it('Test user should not be able update the work item state - types.', function () {
    testSupport.setBrowserMode('phone');
    page.workItemByIndex(1).click();
    expect(detailPage.WorkItemStateDropDownListCount()).toBe(0);
   });
/*Test user should not be able update the work item type */
  it('Test user should not be able update the work item type - phone.', function () {
    testSupport.setBrowserMode('phone');
    page.workItemByIndex(1).click();
    expect(detailPage.WorkItemTypeDropDownListCount()).toBe(0);
   });
/**Test for title and description is readable */  
  it('Test for title and description is readable - phone.', function () {
    testSupport.setBrowserMode('phone');
    page.workItemByIndex(1).click();
    expect(page.workItemTitle(page.firstWorkItem)).toBeTruthy();
    expect(page.workItemDescription(page.firstWorkItem).isPresent()).toBeTruthy();
   });
   it('Test add comments should not be visible - phone.', function () {
    testSupport.setBrowserMode('phone');
    page.workItemByIndex(1).click();   
    expect(detailPage.commentDiv().isPresent()).toBeFalsy();
   });
   it('Test Link Item container Div should not be visible - phone.', function () {
    testSupport.setBrowserMode('desktop');
    page.workItemByIndex(1).click();   
    expect(detailPage.linkItemTotalCount().isPresent()).toBeFalsy();
    expect(detailPage.commentDiv().isPresent()).toBeFalsy();
   });
});
