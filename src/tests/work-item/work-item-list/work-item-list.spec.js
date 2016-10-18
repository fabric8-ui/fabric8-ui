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
    
    workItemMockData = {
      pageTitle:'Some Title 14 Details',
      workItemTitle:'Some Title 14', 
      workItemDescription:'Some Description 14',
      workItemType:'system.userstory',
      workItemCreator:'someOtherUser14',
      workItemAssignee:'someUser14',
      workItemState:'new'
    }; 
  });

  it('should contain 14 items.', function() {
    expect(page.allWorkItems.count()).toBe(startCount);
  });

  it('should have the right mock data in the first entry - phone.', function() {
    expect(page.workItemTitle(page.firstWorkItem)).toBe('Some Title 14');
  });
  
  it('should have the right mock data in the first entry - desktop.', function() {
    setBrowserMode('desktop');		  
    expect(page.workItemDescription(page.firstWorkItem)).toBe('Some Description 14');
    expect(page.workItemTitle(page.firstWorkItem)).toBe('Some Title 14');
  });

  it('should create a new workitem - phone.', function () {
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle('Some Title');
    page.clickQuickAddSave().then(function() {
      expect(page.allWorkItems.count()).toBe(startCount + 1);
      expect(page.workItemTitle(page.firstWorkItem)).toBe('Some Title');
      expect(page.workItemTitle(page.workItemByNumber(0))).toBe('Some Title');
    });
  });
 
 it('should create a new workitem - desktop.', function () {
    setBrowserMode('desktop');	
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle('Some Title');
    page.clickQuickAddSave().then(function() {
      expect(page.allWorkItems.count()).toBe(startCount + 1);
      expect(page.workItemTitle(page.firstWorkItem)).toBe('Some Title');
      expect(page.workItemTitle(page.workItemByNumber(0))).toBe('Some Title');
    });
  });
	 
  it('should contain right mock data on detail page - desktop.', function() { 
    setBrowserMode('desktop');	
    page.workItemViewId(page.firstWorkItem).getText().then(function (text) { 
      detailPage = page.clickWorkItemViewButton(page.workItemViewButton(page.firstWorkItem), text);
      expect(detailPage.workItemDetailPageTitle.getText()).toBe(workItemMockData.pageTitle);
      expect(detailPage.workItemDetailTitle.getAttribute("value")).toBe(workItemMockData.workItemTitle);      
      expect(detailPage.workItemDetailDescription.getAttribute("value")).toBe(workItemMockData.workItemDescription);
      expect(detailPage.workItemDetailType.getAttribute("value")).toBe(workItemMockData.workItemType);
      expect(detailPage.workItemDetailCreator.getAttribute("value")).toBe(workItemMockData.workItemCreator);
      expect(detailPage.workItemDetailAssignee.getAttribute("value")).toBe(workItemMockData.workItemAssignee);
      expect(detailPage.workItemDetailState.getAttribute("value")).toBe(workItemMockData.workItemState);
      detailPage.clickWorkItemDetailCancelButton();
    });
  });
  
  /*
   * Set the screen resolution
   */
  function setBrowserMode(browserModeStr) {
    switch (browserModeStr) {
	  case 'phone':
	    browser.driver.manage().window().setSize(375, 667);
      break;
	  case 'tablet':
        browser.driver.manage().window().setSize(768, 1024);
      break;
      case 'desktop':
        browser.driver.manage().window().setSize(1920, 1080);
    } 
  };
  
  /* 
  * Write screenshot to file 
  */ 
  function writeScreenShot(data, filename) {
    var fs = require('fs');
    var stream = fs.createWriteStream(filename);
    stream.write(new Buffer(data, 'base64'));
    stream.end();
  }
  
});
