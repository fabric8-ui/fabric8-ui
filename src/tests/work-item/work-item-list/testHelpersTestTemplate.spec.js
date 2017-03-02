/**
 * POC test for automated UI tests for ALMighty
 *  Story: Display and Update Work Item Details
 *  https://github.com/almighty/almighty-core/issues/296
 *
 * Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 *
 * beforeEach will set the mode to phone. Any tests requiring a different resolution will must set explicitly.
 *
 * @author 
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  testSupport = require('./testSupport'),
   constants = require('./constants'),
  testHelpers = require('./testHelpers');

describe('Work item list', function () {
    var page, items, browserMode;
    var until = protractor.ExpectedConditions;
    beforeEach(function () {
        testSupport.setBrowserMode('desktop');
        page = new WorkItemListPage(true);
    });

    it('Quick Create workitem', function () { 
        var theWorkItem = testHelpers.quickCreateWorkItem (page, "testing123", "testing456");
        // Perform some tests on that workitem
        testHelpers.assignWorkItem (page, theWorkItem, "Example User 1");
        testHelpers.verifyAssignee (page, theWorkItem, "Example User 1");
        testHelpers.setWorkItemDescription (page, "testing123", "newDescText", true);
        testHelpers.setWorkItemTitle (page, "testing123", "newTitleText", true);
        testHelpers.deleteWorkItem (page, theWorkItem, true);
    });

    it('Create workitem', function () { 
        var theWorkItem = testHelpers.createWorkItem (page, "testing123", "testing456", "userstory", "Example User 1"); 
        browser.wait(until.elementToBeClickable(page.firstWorkItem), constants.WAIT, 'Failed to find Assignee Icon');   
 
        // Perform some tests on that workitem
        testHelpers.deleteWorkItem (page, theWorkItem);
    });

});
