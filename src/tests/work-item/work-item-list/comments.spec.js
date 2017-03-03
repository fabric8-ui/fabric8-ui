/**Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 *
 * beforeEach will set the mode to Desktop. Any tests requiring a different resolution will must set explicitly.
 *
 * @author naina-verma
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  constants = require('./constants'),
  testSupport = require('./testSupport');
  WorkItemDetailPage = require('./page-objects/work-item-detail.page'),
describe('Comments tests :: ', function () {
  var page, items, browserMode;

var until = protractor.ExpectedConditions;
var waitTime = 30000;

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);
    detailPage = new WorkItemDetailPage(true);
    testSupport.setTestSpace(page);
  });
  it('Verify comments text area, username, comment,time is present -desktop ', function() {
      page.clickWorkItemTitle(page.firstWorkItem, "id0");
      expect(detailPage.commentDiv().isPresent()).toBe(true);
      detailPage.clickCommentsDiv();
      detailPage.writeComment("some comment");
      expect(detailPage.commentsAvatar('0').isPresent()).toBe(true);
     });
/**More test will be adding here !! Waiting for Userstory to complete https://github.com/fabric8io/fabric8-planner/issues/653 */
});
