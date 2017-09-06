/**
 * Template for automated UI tests for Planner
 *
 * This template file provides the starting point for writing a new UI test for the Planner.
 * To create a new test, copy this file, change the name to reflect the new test that you want
 * to write, and fill in the details for your new test.
 *
 * Notes on these tests:
 *
 * 1) Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 *
 * By default, the "beforeEach" function sets the screen resolution to desktop. If you want to run
 * the same test on multiple screen resolutions, it is best to write a separate test function. Doesn't
 * this result in duplicate tests? Not necessarily, as some UI elements will only be present/usable on
 * selected screen resolutions.
 *
 * 2) Note on test design - Should the same test function run against all the resolutions in a loop?
 * Probably not as it is always preferable (in order to aid test reporting and debugging) to always try
 * to limit each test function to a single test.
 *
 * 3) Note on test technologies used in these tests - These UI tests make use of:
 * - JavaScript: So that no additional stack elements have to be added
 * - Protractor: Wrapper for Jasmine/Selenium, provides easy to use UI selectors, http://www.protractortest.org
 * - Jasmine: Framework provides testcases/suites, https://jasmine.github.io
 *
 *
 * @author
 */

/* Define variables for page objects */
var WorkItemListPage = require('./page-objects/work-item-list.page'),
  constants = require('./constants'),
  testSupport = require('./testSupport');

/* Start of Jasmine test suite. The string parameter is used in logging as a prefix for the test specs */
describe('Type group tests', function () {
  var page, browserMode;

  /* Test data */
  //const UI_ELEMENT_TITLE = "the title";

/* Jasmine beforeEach function is executed before each test spec function. */
  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);
    testSupport.setTestSpace(page);
  });

/* Jasmine test specs. The string in the spec definition is concatenated with the describe string to
   make a full sentence in BDD style. */

  it('Portfolio link is displayed on the side panel', function() {
    expect(page.getPortfolio().isPresent()).toBe(true);
  });

  it('Portfolio link is clickable', function() {
    let clickEvent = page.clickPortfolio();
    expect(clickEvent).toBeDefined();
  });

  // it('Clicking on portfolio should only display the portfolio level work item', function() {
  //   //page.clickPortfolio();
  //   //expect list to display only portfolio work items

  // });

  it('Requirements link is displayed on the side panel', function() {
    expect(page.getRequirements().isPresent()).toBe(true);
  });

  it('Requirements link is clickable', function() {
    let clickEvent = page.clickRequirements();
    expect(clickEvent).toBeDefined();
  });

  // it('Clicking on requirements should only display the reqirement level work item', function() {
  //   //page.clickPortfolio();
  //   //expect list to display only portfolio work items

  // });

  it('Execution link is displayed on the side panel', function() {
    expect(page.getRequirements().isPresent()).toBe(true);
  });


});
