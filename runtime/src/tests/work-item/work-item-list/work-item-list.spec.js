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

  var WORK_ITEM_TITLE = 'Title Text 2';
  var CHILD_QUICK_ADD_TITLE = 'Child Work Item';

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
    
  it('should have the right mock data in the first entry.', function() {
      expect(page.workItemTitle(page.firstWorkItem)).toBe('Title Text 0');
  });

  it('should create a new workitem - desktop.', function () {
      testSupport.setBrowserMode('desktop');	
      page.typeQuickAddWorkItemTitle('test workitem');
      page.clickQuickAddSave().then(function() {
        expect(page.workItemTitle(page.firstWorkItem)).toBe('test workitem');
        expect(page.workItemTitle(page.workItemByTitle('test workitem')).isPresent()).toBe(true);
      });
  });	 

  it('should open setting button and hide a column from view', function() { 
    // default column count is 10
    expect(page.getDataTableHeaderCellCount()).toEqual(10);
    // hide and validate attribute header Count
    page.clickSettingButton().then(function() {
      browser.wait(until.presenceOf(page.settingDropdown()), constants.WAIT, 'Failed to open setting dropdown');
      page.selectAttributeCheckBox("Iteration");
      page.clickMoveToAvailableAttribute();
      page.clickCancelButton();
      expect(page.getDataTableHeaderCellCount()).toEqual(9);
    });
    //show and validate header count
    page.clickSettingButton().then(function() {
      browser.wait(until.presenceOf(page.settingDropdown()), constants.WAIT, 'Failed to open setting dropdown');
      page.selectAttributeCheckBox("Iteration");
      page.clickMoveToDisplayAttribute();
      page.clickCancelButton();
      expect(page.getDataTableHeaderCellCount()).toEqual(10);
    });
  });

  it('Tree icon should be disabled if no child work item exists', function() {
    page.clickInlineQuickAdd(WORK_ITEM_TITLE).then(function() {
      page.typeInlineQuickAddWorkItemTitle(CHILD_QUICK_ADD_TITLE);
      page.clickInlineQuickAddCancel(WORK_ITEM_TITLE);
      expect(page.treeIconDisable(WORK_ITEM_TITLE).isDisplayed()).toBe(true);
    });
  });

  it('Add, Add and Open should be enabled after entering the value', function() {
    page.clickInlineQuickAdd(WORK_ITEM_TITLE).then(function() {
      expect(page.getInlineQuickAddBtn().getAttribute('class')).toMatch('disable');
      page.typeInlineQuickAddWorkItemTitle(CHILD_QUICK_ADD_TITLE);
      expect(page.getInlineQuickAddBtn().getAttribute('class')).not.toMatch('disable');      
      page.clickInlineQuickAddCancel(WORK_ITEM_TITLE);
    });
  });
});
