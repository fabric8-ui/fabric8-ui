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
  var until = protractor.ExpectedConditions;

/* Jasmine beforeEach function is executed before each test spec function. */
  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);
    testSupport.setTestSpace(page);
    browser.wait(until.elementToBeClickable(page.firstWorkItem), constants.WAIT, 'Failed to find first work item');    
  });

/* Jasmine test specs. The string in the spec definition is concatenated with the describe string to
   make a full sentence in BDD style. */

  it('Scenario link is displayed on the side panel', function() {
    expect(page.getWorkItemGroup().get(0).getText()).toContain('Scenarios');
  });

  it('Scenario link is clickable', function() {
    let clickEvent = page.clickScenario();
    expect(clickEvent).toBeDefined();
  });

  it('Experiences link is displayed on the side panel', function() {
    expect(page.getWorkItemGroup().get(1).getText()).toContain('Experiences')
  });

  it('Experience link is clickable', function() {
    let clickEvent = page.clickExperience();
    expect(clickEvent).toBeDefined();
  });

  it('Requirements link is displayed on the side panel', function() {
    expect(page.getWorkItemGroup().get(2).getText()).toContain('Requirements')
  });

  it('Requirements link is clickable', function() {
    let clickEvent = page.clickRequirements();
    expect(clickEvent).toBeDefined();
  });

  it('click hide panel Button and WIT group name should not be displayed', function() {
    page.clickHidePanelBtn();
    expect(page.getWorkItemGroup().getText()).not.toContain('Scenarios'); 
    expect(page.getWorkItemGroup().getText()).not.toContain('Experiences')    
    expect(page.getWorkItemGroup().getText()).not.toContain('Requirements')
  });

  it("Scenario-Quick Add should support Scenario, papercuts and fundamentals", function() {
    page.clickScenario();
    page.clickWorkItemQADropDown();
    expect(page.getWorkItemType().count()).toBe(3);
    expect(page.getWorkItemType().get(0).getText()).toContain(' Scenario');
    expect(page.getWorkItemType().get(1).getText()).toContain(' Papercuts');
    expect(page.getWorkItemType().get(2).getText()).toContain(' Fundamental');
  });

  it("Experiences-Quick Add should support Experience and Value proposition", function() {
    page.clickExperience();
    page.clickWorkItemQADropDown();
    expect(page.getWorkItemType().count()).toBe(2);
    expect(page.getWorkItemType().get(0).getText()).toContain(' Experience');
    expect(page.getWorkItemType().get(1).getText()).toContain(' Value Proposition');
  });

  // Commented out since the first item in dropdown should be feature and not bug in requirement context.
  // Uncomment when https://openshift.io/openshiftio/openshiftio/plan/detail/1789 is resolved.
  /*
  it("Requirements-Quick Add should contain Bug and Feature", function() {
    page.clickRequirements();
    page.clickWorkItemQADropDown();
    expect(page.getWorkItemType().count()).toBe(2);
    expect(page.getWorkItemType().get(0).getText()).toContain(' Feature');
    expect(page.getWorkItemType().get(1).getText()).toContain(' Bug');
  });
  */

  it("Url should contain query typegroup.name:Scenarios on clicking Scenarios", function() {
    page.clickScenario();    
    expect(browser.getCurrentUrl()).toContain('typegroup.name:Scenarios');  
  });

  it("Url should contain query typegroup.name:Experiences on clicking Experiences", function() {
    page.clickExperience();    
    expect(browser.getCurrentUrl()).toContain('typegroup.name:Experiences');  
  });

  it("Url should contain query typegroup.name:Requirements on clicking Requirements", function() {
    page.clickRequirements();    
    expect(browser.getCurrentUrl()).toContain('typegroup.name:Requirements');  
  });
});
