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
  testSupport = require('./testSupport'),
  constants = require("./constants");

describe('Iteration CRUD tests :: ', function () {
  var page, items, browserMode;

var until = protractor.ExpectedConditions;
var waitTime = 30000;

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);
    testSupport.setTestSpace(page);
  });

  it('Verify Iteration add button and label are clickable + dialoge label is present', function() {
      expect(page.iterationAddButton.isPresent()).toBe(true);
      page.clickIterationAddButton();
      expect(page.getIterationDialogTitle()).toBe('Create Iteration');
      page.clickCancelIteration();
  });

  it('Verify Iteration Set Iteration Title description -hit Create -phone ', function() {
      page.iterationAddButton().click();
      page.setIterationTitle('New Iteration',false);
      page.setIterationDescription('New Iteration',false);
      page.clickCreateIteration();
      expect(page.getHelpBoxIteration()).toBe('Iteration names must be unique within a project');
  });

  it('Verify Iteration Set Iteration Title description -hit Create ', function() {

    /* Create a new iteration */ 
    page.clickIterationAddButton();
    page.setIterationTitle('New Iteration',false);
    page.setIterationDescription('New Iteration',false);
    page.clickCreateIteration();

    /* Verify the new iteration is present */
    page.expandFutureIterationIcon.click();
    browser.wait(until.presenceOf(page.firstFutureIteration), constants.WAIT, 'Failed to find thefirstIteration');
   
    /* Verify that the new iteration was successfully added */ 
    expect(page.firstFutureIteration.getText()).toContain('New Iteration');


  }); 



// Create new iteration 
// Query/Edit iteration 
// Delete iteration 
// Start and then close iteration 
// Associate work items with iteration 



});
