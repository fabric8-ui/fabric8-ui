/**
 * POC test for automated UI tests using test helper functions
 *
 * Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 *
 * @author 
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  testSupport = require('./testSupport'),
   constants = require('./constants'),
  testHelpers = require('./testHelpers');

describe('Work item list', function () {
    var page, items, browserMode;
    beforeEach(function () {
        testSupport.setBrowserMode('desktop');
        page = new WorkItemListPage(true);
    testSupport.setTestSpace(page);
    });

    /* Perform some tests on that workitem - set values and verify them */
    it('Quick Create workitem', function () { 
        var theWorkItem = testHelpers.quickCreateWorkItem (page, "testing123", "testing456");
        testHelpers.setWorkItemDescription (page, "testing123", "newDescText", true);
        testHelpers.setWorkItemTitle (page, "testing123", "newTitleText", true);
        testHelpers.setWorkItemAssignee (page, theWorkItem, "Example User 1");

        testHelpers.verifyWorkItemDescription (page, theWorkItem, "newDescText");
        testHelpers.verifyWorkItemTitle (page, theWorkItem, "newTitleText");
        testHelpers.verifyworkItemAssignee (page, theWorkItem, "Example User 1");
    });

    it('Create workitem', function () { 
        var theWorkItem = testHelpers.createWorkItem (page, "testing123", "testing456", "userstory", "Example User 1"); 

        testHelpers.verifyWorkItemDescription (page, theWorkItem, "testing456");
        testHelpers.verifyWorkItemTitle (page, theWorkItem, "testing123");
        testHelpers.verifyworkItemAssignee (page, theWorkItem, "Example User 1");
    });

});