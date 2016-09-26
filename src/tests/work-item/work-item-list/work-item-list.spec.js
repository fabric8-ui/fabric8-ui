var WorkItemListPage = require('./work-item-list.page');

describe('Work item list', function () {

  var page;

  beforeEach(function () {
    page = new WorkItemListPage();
  });

  it('should contain 14 items.', function() {
    expect(page.allWorkItems.count()).toBe(14);
  });

  it('should have the right mock data in the first entry.', function() {
    expect(page.workItemDescription(page.firstWorkItem)).toBe('No description available for this work item.');
    expect(page.workItemTitle(page.firstWorkItem)).toBe('');
  });

  it('should create a new workitem.', function () {
    page.typeQuickAddWorkItemTitle('Some Title');
    page.typeQuickAddWorkItemDescription('Some Description');
    page.clickQuickAddSave().then(function() {
      expect(page.allWorkItems.count()).toBe(15);
      expect(page.workItemDescription(page.firstWorkItem)).toBe('Some Description');
      expect(page.workItemTitle(page.firstWorkItem)).toBe('Some Title');
    });
  });

  it('should reset the quick add form when the reset button is clicked.', function () {
    page.typeQuickAddWorkItemTitle('Some Other Title');
    page.typeQuickAddWorkItemDescription('Some Other Description');
    page.clickQuickAddCancel().then(function() {
      expect(page.allWorkItems.count()).toBe(14);
      expect(page.workItemQuickAddTitle.getText()).toBe('');
      expect(page.workItemQuickAddDescription.getText()).toBe('');
    });
  });

});
