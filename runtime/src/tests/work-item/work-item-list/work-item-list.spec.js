/**
 * POC test for automated UI tests for Planner
 *  
 * Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 * 
 * beforeEach will set the mode to desktop. Any tests requiring a different resolution will must set explicitly. 
 * 
 * @author ldimaggi, rgarg
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  testSupport = require('./testSupport'),
  constants = require('./constants'),
  WorkItemDetailPage = require('./page-objects/work-item-detail.page');

describe('Work item list', function () {
  var page, items, browserMode;
  var until = protractor.ExpectedConditions;

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);   
    testSupport.setTestSpace(page); 
    
    workItemMockData = {
      pageTitle:'Title Text 0 Details',
      workItemTitle:'Title Text 0', 
      workItemDescription:'Description Text 0',
      workItemType:'system.userstory',
      workItemCreator:'',
      workItemAssignee:'',
      workItemState:'New'
    }; 
  });

  it('should have the right mock data in the first entry - phone.', function() {
      expect(page.workItemTitle(page.firstWorkItem)).toBe('Title Text 0');
    });
    
  it('should have the right mock data in the first entry - desktop.', function() {
      expect(page.workItemTitle(page.firstWorkItem)).toBe('Title Text 0');
    });

  it('should create a new workitem - desktop.', function () {
      testSupport.setBrowserMode('desktop');	
      page.clickWorkItemQuickAdd();
      page.typeQuickAddWorkItemTitle('test workitem');
      page.clickQuickAddSave().then(function() {
        expect(page.workItemTitle(page.firstWorkItem)).toBe('test workitem');
        expect(page.workItemTitle(page.workItemByNumber(0))).toBe('test workitem');
      });
  });	 

  it('should contain right mock data on detail page - desktop.', function() { 
      page.workItemViewId(page.firstWorkItem).getText().then(function (text) { 
        var detailPage = page.clickWorkItem(page.firstWorkItem);
        browser.wait(until.elementToBeClickable(detailPage.workItemDetailAssigneeIcon), constants.WAIT, 'Failed to find Assignee Icon');   
        
        /* TODO - text in title/desc fields once updated is not visible in DOM - have to find a diff way to get the text */
        //expect(detailPage.clickWorkItemDetailTitle.getText()).toBe(workItemMockData.workItemTitle);   
        //expect(detailPage.workItemDetailDescription.getText()).toContain(workItemMockData.workItemDescription);
        detailPage.clickWorkItemDetailCloseButton();
      });
  });

});
