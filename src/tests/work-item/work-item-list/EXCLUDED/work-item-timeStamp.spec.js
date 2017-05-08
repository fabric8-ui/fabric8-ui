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
 * @author naina-verma
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  testSupport = require('./testSupport'),
  constants = require('./constants'),
  WorkItemDetailPage = require('./page-objects/work-item-detail.page');
  var until = protractor.ExpectedConditions;
  var waitTime = 30000;

describe('Work item list', function () {
  var page, items, browserMode;
  detailPage = new WorkItemDetailPage();
  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);  
    testSupport.setTestSpace(page); 
    
  });

 it('check date showing up correctly - Desktop', function () {
    page.clickWorkItemTitle(page.firstWorkItem, "Title Text 0");
    expect(detailPage.getCreatedtime()).toBe('a few seconds ago');
    page.workItemByURLId("id1");
    browser.wait(until.elementToBeClickable(page.workItemTitle(page.firstWorkItem)), constants.WAIT, 'Failed to find Assignee Icon');   
    expect(detailPage.getCreatedtime()).toBe('17 minutes ago');
    page.workItemByURLId("id2");
    browser.wait(until.elementToBeClickable(page.workItemTitle(page.firstWorkItem)), constants.WAIT, 'Failed to find Assignee Icon');   
   
    expect(detailPage.getCreatedtime()).toBe('8 hours ago');
    page.workItemByURLId("id3");
    browser.wait(until.elementToBeClickable(page.workItemTitle(page.firstWorkItem)), constants.WAIT, 'Failed to find Assignee Icon');   
   
    expect(detailPage.getCreatedtime()).toBe('3 days ago');
    page.workItemByURLId("id4");
    browser.wait(until.elementToBeClickable(page.workItemTitle(page.firstWorkItem)), constants.WAIT, 'Failed to find Assignee Icon');   
   
    expect(detailPage.getCreatedtime()).toBe('15 days ago');
    page.workItemByURLId("id5");
    browser.wait(until.elementToBeClickable(page.workItemTitle(page.firstWorkItem)), constants.WAIT, 'Failed to find Assignee Icon');   
   
    expect(detailPage.getCreatedtime()).toBe('25 days ago');
    page.workItemByURLId("id6");
    browser.wait(until.elementToBeClickable(page.workItemTitle(page.firstWorkItem)), constants.WAIT, 'Failed to find Assignee Icon');   
   
    // expect(detailPage.getCreatedtime()).toBe('a month ago');
    page.workItemByURLId("id7");
    browser.wait(until.elementToBeClickable(page.workItemTitle(page.firstWorkItem)), constants.WAIT, 'Failed to find Assignee Icon');   
   
    expect(detailPage.getCreatedtime()).not.toBe('a year ago');
   });
 it('check date showing up correctly - phone', function () {
    testSupport.setBrowserMode('desktop');
    page.workItemByURLId("id0");
    browser.wait(until.elementToBeClickable(page.workItemTitle(page.firstWorkItem)), constants.WAIT, 'Failed to find Assignee Icon');   
   
    expect(detailPage.getCreatedtime()).toBe('a few seconds ago');
    detailPage.clickWorkItemDetailCloseButton();
    page.workItemByURLId("id1");
    browser.wait(until.elementToBeClickable(page.workItemTitle(page.firstWorkItem)), constants.WAIT, 'Failed to find Assignee Icon');   
   
    expect(detailPage.getCreatedtime()).toBe('17 minutes ago');
    detailPage.clickWorkItemDetailCloseButton();
    page.workItemByURLId("id2");
    browser.wait(until.elementToBeClickable(page.workItemTitle(page.firstWorkItem)), constants.WAIT, 'Failed to find Assignee Icon');   
   
    expect(detailPage.getCreatedtime()).toBe('8 hours ago');
    detailPage.clickWorkItemDetailCloseButton();
    page.workItemByURLId("id3");
    browser.wait(until.elementToBeClickable(page.workItemTitle(page.firstWorkItem)), constants.WAIT, 'Failed to find Assignee Icon');   
   
    expect(detailPage.getCreatedtime()).toBe('3 days ago');
    detailPage.clickWorkItemDetailCloseButton();
    page.workItemByURLId("id4");
    browser.wait(until.elementToBeClickable(page.workItemTitle(page.firstWorkItem)), constants.WAIT, 'Failed to find Assignee Icon');   
   
    expect(detailPage.getCreatedtime()).toBe('15 days ago');
    detailPage.clickWorkItemDetailCloseButton();
    page.workItemByURLId("id5");
    browser.wait(until.elementToBeClickable(page.workItemTitle(page.firstWorkItem)), constants.WAIT, 'Failed to find Assignee Icon');   
   
    expect(detailPage.getCreatedtime()).toBe('25 days ago');
    detailPage.clickWorkItemDetailCloseButton();
    page.workItemByURLId("id6");
    browser.wait(until.elementToBeClickable(page.workItemTitle(page.firstWorkItem)), constants.WAIT, 'Failed to find Assignee Icon');   
   
    // expect(detailPage.getCreatedtime()).toBe('a month ago');
    detailPage.clickWorkItemDetailCloseButton();
    page.workItemByURLId("id7");
    browser.wait(until.elementToBeClickable(page.workItemTitle(page.firstWorkItem)), constants.WAIT, 'Failed to find Assignee Icon');   
   
    expect(detailPage.getCreatedtime()).not.toBe('a year ago');
    page.workItemByURLId("id8");
    browser.wait(until.elementToBeClickable(page.workItemTitle(page.firstWorkItem)), constants.WAIT, 'Failed to find Assignee Icon');   
   
    expect(detailPage.getCreatedtime()).toBe('in 12 years');
   });
  
});
