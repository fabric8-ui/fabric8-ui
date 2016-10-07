var WorkItemListPage = require('./work-item-list.page');

describe('Work item list', function () {
  var page, detailPage, items, startCount, firstWorkItem;

  beforeEach(function () {
    browser.driver.manage().window().setSize(1920, 1080);
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
    
  it('should contain right mock data on detail page.', function() {  
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

  it('should have the right mock data in the first entry.', function() {
    // expect(page.workItemDescription(page.firstWorkItem)).toBe('Some Description 14');
    expect(page.workItemTitle(page.firstWorkItem)).toBe('Some Title 14');
  });

  it('should create a new workitem.', function () {
    page.typeQuickAddWorkItemTitle('Some Title');
    // page.typeQuickAddWorkItemDescription('Some Description');
    page.clickQuickAddSave().then(function() {
      expect(page.allWorkItems.count()).toBe(startCount + 1);
      // expect(page.workItemDescription(page.firstWorkItem)).toBe('Some Description');
      expect(page.workItemTitle(page.firstWorkItem)).toBe('Some Title');
      // expect(page.workItemDescription(page.workItemByNumber(0))).toBe('Some Description');
      expect(page.workItemTitle(page.workItemByNumber(0))).toBe('Some Title');
      // page.allWorkItems.getText().then(function (text) {
      //   expect(text).toContain("View Details Delete\nnew\n1\nSome Title\nSome Description");
      // });
    });
  });

  it('should reset the quick add form when the reset button is clicked.', function () {
    page.typeQuickAddWorkItemTitle('Some Other Title');
    page.typeQuickAddWorkItemDescription('Some Other Description');
    page.clickQuickAddCancel().then(function() {
      expect(page.allWorkItems.count()).toBe(startCount);
      expect(page.workItemQuickAddTitle.getText()).toBe('');
      expect(page.workItemQuickAddDescription.getText()).toBe('');
    });
  });
  
  it('should update.', function() {
    page.workItemViewId(page.firstWorkItem).getText().then(function (text) { 
      detailPage = page.clickWorkItemViewButton(page.workItemViewButton(page.firstWorkItem), text);      
      detailPage.setWorkItemDetailTitle(" - UPDATED", true);
      detailPage.setWorkItemDetailDescription("A new description", false);
      detailPage.setWorkItemDetailType("bug");
      detailPage.setWorkItemDetailCreator("A new creator", false);
      detailPage.setWorkItemDetailAssignee("A new assignee ======================", false);
      detailPage.setWorkItemDetailState("resolved");        
    });
  });

});

