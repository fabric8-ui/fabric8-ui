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
 *
 * @author nverma
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  constants = require('./constants'),
  testSupport = require('./testSupport');

describe('Work item list', function () {
  var page, items, browserMode;
  var char255 = '<div *ngFor=let comment of workItem.relationalData.comments; let counter = index" class="comments-wrap">   +            <div *ngFor="let comment of workItem.relationalData?.comments?.slice().reverse()" class="comments-wrap">                  <div>                      <div class="user-avatar pull-left">                          <img id="{{"comment_avatar_" + counter}}" -                        class="user-assign-avatar pull-left"  +                               />';
  var char255Expected = '<div *ngFor=let comment of workItem.relationalData.comments; let counter = index" class="comments-wrap"> + <div *ngFor="let comment of workItem.relationalData?.comments?.slice().reverse()" class="comments-wrap"> <div> <div class="user-avatar pull-left"> <img id="{{"comment_avatar_" + counter}}" - class="user-assign-avatar pull-left" + />';
  var until = protractor.ExpectedConditions;

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);
    testSupport.setTestSpace(page);
  });

  it('Creating a new quick add work item and delete - desktop.', function () {
    testSupport.setBrowserMode('desktop');
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle('Quick Add and Delete');
    page.clickQuickAddSave().then(function() {
      expect(page.workItemTitle(page.firstWorkItem)).toBe('Quick Add and Delete');
      expect(page.workItemTitle(page.workItemByNumber(0))).toBe('Quick Add and Delete');
      page.clickWorkItemKebabButton(page.firstWorkItem);
      page.clickWorkItemKebabDeleteButton(page.firstWorkItem);
      page.clickWorkItemPopUpDeleteConfirmButton().then(function() {
        browser.wait(until.textToBePresentInElement((page.firstWorkItem), "Title Text" ), 60000, 'Failed to find text in workitem');
        expect(page.workItemTitle(page.firstWorkItem)).not.toBe('Quick Add and Delete');
        expect(page.workItemTitle(page.workItemByNumber(0))).not.toBe('Quick Add and Delete');
      });
    });
  });

  it('Verify that data is persisted and is not truncated if text fields receive data with a length greater that 255 characters. - desktop.', function () {
    testSupport.setBrowserMode('desktop');
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(char255);
    page.clickQuickAddSave().then(function() {
      expect(page.workItemTitle(page.firstWorkItem)).toBe(char255Expected);
      expect(page.workItemTitle(page.workItemByNumber(0))).toBe(char255Expected);
      page.clickWorkItemKebabButton(page.firstWorkItem);

      browser.wait(until.elementToBeClickable(page.workItemKebabDeleteButton(page.firstWorkItem)), constants.WAIT, 'Failed to find clickWorkItemKebabDeleteButton');
 
      page.clickWorkItemKebabDeleteButton(page.firstWorkItem);

      browser.wait(until.elementToBeClickable(page.workItemPopUpDeleteCancelConfirmButton), constants.WAIT, 'Failed to find workItemPopUpDeleteCancelConfirmButton');

      page.clickWorkItemPopUpDeleteCancelConfirmButton().then(function() {
        browser.wait(until.textToBePresentInElement((page.firstWorkItem), char255Expected), constants.WAIT, 'Failed to text in workitem');
        expect(page.workItemTitle(page.firstWorkItem)).toBe(char255Expected);
        expect(page.workItemTitle(page.workItemByNumber(0))).toBe(char255Expected);
      });
    });
  });

});
