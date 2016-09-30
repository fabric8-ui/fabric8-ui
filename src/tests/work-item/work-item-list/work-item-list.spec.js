var WorkItemListPage = require('./work-item-list.page');

describe('Work item list', function () {
  var page, items, startCount, tabs;

  beforeEach(function () {
    page = new WorkItemListPage();
    page.allWorkItems.count().then(function(originalCount) { startCount = originalCount; });
  });

  it('should contain 14 items.', function() {
    expect(page.allWorkItems.count()).toBe(startCount);
  });

  it('should have the right mock data in the first entry.', function() {
    expect(page.workItemDescription(page.firstWorkItem)).toBe('Some Description 14');
    expect(page.workItemTitle(page.firstWorkItem)).toBe('Some Title 14');
  });

  it('should create a new workitem.', function () {
    page.typeQuickAddWorkItemTitle('Some Title');
    page.typeQuickAddWorkItemDescription('Some Description');
    page.clickQuickAddSave().then(function() {
      expect(page.allWorkItems.count()).toBe(startCount + 1);
      expect(page.workItemDescription(page.firstWorkItem)).toBe('Some Description');
      expect(page.workItemTitle(page.firstWorkItem)).toBe('Some Title');
      expect(page.workItemDescription(page.workItemByNumber(0))).toBe('Some Description');
      expect(page.workItemTitle(page.workItemByNumber(0))).toBe('Some Title');
      page.allWorkItems.getText().then(function (text) { 
        expect(text).toContain("View Details Delete\nnew\n1\nSome Title\nSome Description");	
      });
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

});