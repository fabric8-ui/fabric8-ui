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
  testSupport = require('./testSupport');

describe('Iteration tests :: ', function () {
  var page, items, browserMode;

var until = protractor.ExpectedConditions;
var waitTime = 30000;

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);
  });
  it('Verify Iteration add button and label are clickable + dialoge label is present -phone ', function() {
      expect(page.iterationAddButton().isPresent()).toBe(true);
      page.iterationAddButton().click();
      expect(page.getIterationDialogTitle()).toBe('Create Iteration');
      page.clickCancelIteration();
      page.clickIterationCreateLabel();
      expect(page.getIterationDialogTitle()).toBe('Create Iteration');
  });
  it('Verify Iteration helpbox is showing -phone ', function() {
      page.iterationAddButton().click();
      expect(page.getIterationDialogTitle()).toBe('Create Iteration');
      // TODO: This message only comes when there is an error
      // expect(page.getHelpBoxIteration()).toBe('Iteration names must be unique within a project');
  });
  it('Verify Iteration Set Iteration Title description -hit Create -phone ', function() {
      page.iterationAddButton().click();
      page.setIterationTitle('New Iteration',false);
      page.setIterationDescription('New Iteration',false);
      page.clickCreateIteration();
      /**This test will be complete when iteration functionality Implemented  */
  });


});
