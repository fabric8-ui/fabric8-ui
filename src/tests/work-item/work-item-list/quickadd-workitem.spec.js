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
 */

var WorkItemListPage = require('./work-item-list.page');

describe('Work item list', function () {
  var page, items, startCount, browserMode;

  beforeEach(function () {
    setBrowserMode('phone');
    page = new WorkItemListPage();
    page.allWorkItems.count().then(function(originalCount) { startCount = originalCount; });
  });
  it('Creating a new quick add work item and delete - phone.', function () {
    setBrowserMode('phone');
    page.clickQuickAddWorkItemTitleButton();
    page.typeQuickAddWorkItemTitleText('Quick Add and Delete');
    page.clickWorkItemQuickAddButton().then(function() {
    expect(page.workItemTitle(page.firstWorkItem)).toBe('Quick Add and Delete');
    expect(page.workItemTitle(page.workItemByNumber(0))).toBe('Quick Add and Delete');
    page.clickWorkItemKebabButton();
    page.clickWorkItemKebabDeleteButton();
    page.clickWorkItemPopUpDeleteConfirmButton().then(function() {
    expect(page.workItemTitle(page.firstWorkItem)).not.toBe('Quick Add and Delete');
    expect(page.workItemTitle(page.workItemByNumber(0))).not.toBe('Quick Add and Delete');
    });
    });


  });


  it('Creating a new quick add work item and Cancel delete - phone.', function () {
    setBrowserMode('phone');
    page.clickQuickAddWorkItemTitleButton();
    page.typeQuickAddWorkItemTitleText('Quick Add and Cancel Delete');
    page.clickWorkItemQuickAddButton().then(function() {
    expect(page.workItemTitle(page.firstWorkItem)).toBe('Quick Add and Cancel Delete');
    expect(page.workItemTitle(page.workItemByNumber(0))).toBe('Quick Add and Cancel Delete');
    page.clickWorkItemKebabButton();
    page.clickWorkItemKebabDeleteButton();
    page.clickWorkItemPopUpDeleteCancelConfirmButton().then(function() {
    expect(page.workItemTitle(page.firstWorkItem)).toBe('Quick Add and Cancel Delete');
    expect(page.workItemTitle(page.workItemByNumber(0))).toBe('Quick Add and Cancel Delete');
    });
    });
  });

  /*
   * Set the screen resolution
   */
  function setBrowserMode(browserModeStr) {
    switch (browserModeStr) {
	  case 'phone':
      browser.get("http://localhost:8088/");
	    browser.driver.manage().window().setSize(375, 667);
      break;

	  case 'tablet':
        browser.get("http://localhost:8088/");
        browser.driver.manage().window().setSize(768, 1024);
      break;
    case 'desktop':
        browser.get("http://localhost:8088/");
        browser.driver.manage().window().setSize(1920, 1080);

    }

  };


});
