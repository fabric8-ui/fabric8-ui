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
 * @author nverma
 */

var WorkItemListPage = require('./work-item-list.page'),
  testSupport = require('./testSupport');

describe('Work item list', function () {
  var page, items, startCount, browserMode;

  beforeEach(function () {
    testSupport.setBrowserMode('phone');
    page = new WorkItemListPage();
  });

  it('Creating a new quick add work item and delete - phone.', function () {
    testSupport.setBrowserMode('phone');
//    page.clickQuickAddWorkItemTitleButton();
//    page.typeQuickAddWorkItemTitleText('Quick Add and Delete');
//    page.clickWorkItemQuickAddButton().then(function() {    
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle('Quick Add and Delete');
    page.clickQuickAddSave().then(function() {
      expect(page.workItemTitle(page.firstWorkItem)).toBe('Quick Add and Delete');
      expect(page.workItemTitle(page.workItemByNumber(0))).toBe('Quick Add and Delete');
      page.clickWorkItemKebabButton(page.firstWorkItem);     
      page.clickWorkItemKebabDeleteButton(page.firstWorkItem);
      page.clickWorkItemPopUpDeleteConfirmButton().then(function() {
        expect(page.workItemTitle(page.firstWorkItem)).not.toBe('Quick Add and Delete');
        expect(page.workItemTitle(page.workItemByNumber(0))).not.toBe('Quick Add and Delete');
      });
    });
  });

  it('Creating a new quick add work item and Cancel delete - phone.', function () {
    testSupport.setBrowserMode('phone');
//    page.clickQuickAddWorkItemTitleButton();
//    page.typeQuickAddWorkItemTitleText('Quick Add and Cancel Delete');
//    page.clickWorkItemQuickAddButton().then(function() { 
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle('Quick Add and Cancel Delete');
    page.clickQuickAddSave().then(function() {
      expect(page.workItemTitle(page.firstWorkItem)).toBe('Quick Add and Cancel Delete');
      expect(page.workItemTitle(page.workItemByNumber(0))).toBe('Quick Add and Cancel Delete');
      page.clickWorkItemKebabButton(page.firstWorkItem);     
      page.clickWorkItemKebabDeleteButton(page.firstWorkItem);
      page.clickWorkItemPopUpDeleteCancelConfirmButton().then(function() {
        expect(page.workItemTitle(page.firstWorkItem)).toBe('Quick Add and Cancel Delete');
        expect(page.workItemTitle(page.workItemByNumber(0))).toBe('Quick Add and Cancel Delete');
      });
    });
  });

});
