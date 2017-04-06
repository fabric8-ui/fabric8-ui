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
 * @author ldimaggi
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  testSupport = require('./testSupport'),
  constants = require('./constants'),
  WorkItemDetailPage = require('./page-objects/work-item-detail.page');

var workItemTitle = "The test workitem title";
var workItemUpdatedTitle = "The test workitem title - UPDATED";
var workItemDescription = "The test workitem description";
var workItemUpdatedDescription = "The test workitem description - UPDATED";
var until = protractor.ExpectedConditions;
var waitTime = 30000;

describe('Work item list', function () {
  var page, items, browserMode;
  var until = protractor.ExpectedConditions;
  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);   
    testSupport.setTestSpace(page);
  });

  it('Verify new dynamic fields in a workitem', function () {

    page.workItemViewId(page.firstWorkItem).getText().then(function (text) { 
      var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);      
      detailPage.clickStepsToReproduceText();
      detailPage.setstepsToReproduceText('THIS IS A TEST');

    });


  });

});
