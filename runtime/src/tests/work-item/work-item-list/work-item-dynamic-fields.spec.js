/**
 * POC test for automated UI tests for Planner
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

  /* Basic test - sets all the dynamic field values */
  it('Verify new dynamic fields in a workitem', function () {

    page.workItemViewId(page.firstWorkItem).getText().then(function (text) { 
      var detailPage = page.clickWorkItem(page.firstWorkItem);

      detailPage.clickStepsToReproduceText();
      detailPage.setstepsToReproduceText('THIS IS A TEST');

      detailPage.setStoryPointsText('12');
      detailPage.clickSaveStoryPointsButton();

      detailPage.clickImportantDropdown();
      detailPage.clickImportantDropdownYes();
      detailPage.clickImportantDropdownConfirmButton();
      
      detailPage.clickSeverityDropdown();
      detailPage.clickSeverityDropdownBlocker();
      detailPage.clickSeverityDropdownConfirmButton();

      detailPage.clickDueDateCalendarButton();
      detailPage.clickCurrentDate ();
      detailPage.clickDueDateSelection();

      detailPage.clickWorkItemDetailCloseButton();      

    });


  });

});



  /* Get current month */
  var currentMonth = function () {
    var d = new Date();
    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    var monthStr = month[d.getMonth()]; 
    return monthStr;
  }

  /* Get current year */
  var currentYear = function () {
    var d = new Date();
    var yearStr = d.getFullYear().toString();
    return yearStr;
  }

  /* Get current day of month */
  var currentDay = function () {
    var d = new Date();
    var dayStr = d.getDate().toString();
    return dayStr;
  }



