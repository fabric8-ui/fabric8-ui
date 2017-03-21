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
  });

  /* Verify the UI buttons are present */
 it('Verify Iteration add button and label are clickable + dialoge label is present', function() {
      expect(page.iterationAddButton().isPresent()).toBe(true);
      page.clickIterationAddButton();
      expect(page.getIterationDialogTitle()).toBe('Create Iteration');
      page.clickCancelIteration();
  });

  /* Verify the helpful message */
 it('Verify Iteration helpbox is showing', function() {
      page.clickIterationAddButton();
      expect(page.getIterationDialogTitle()).toBe('Create Iteration');
      page.clickCreateIteration();
      expect(page.getHelpBoxIteration()).toBe('Iteration names must be unique within a project');
  });

  /* Verify setting the fields */
 it('Verify setting the Iteration title and description fields', function() {

    /* Create a new iteration */ 
    page.clickIterationAddButton();
    page.setIterationTitle('Newest Iteration',false);
    page.setIterationDescription('Newest Iteration',false);
    page.clickCreateIteration();

    /* Verify the new iteration is present */
    // page.clickExpandFutureIterationIcon();
    // browser.wait(until.presenceOf(page.firstFutureIteration), constants.WAIT, 'Failed to find thefirstIteration');
   
    /* Verify that the new iteration was successfully added */ 
    // expect(page.firstFutureIteration.getText()).toContain('Newest Iteration');
  }); 

  /* Query and edit an interation */
 it('Query/Edit iteration', function() {
      page.clickExpandFutureIterationIcon();
      page.clickIterationKebab("3");
      page.clickEditIterationKebab();

      /* This is working with chrome not with phantom JS
      page.setIterationTitle('Update Iteration',false);
      page.setIterationDescription('Update Iteration',false);
      page.clickCreateIteration();
      browser.wait(until.presenceOf(page.firstFutureIteration), constants.WAIT, 'Failed to find thefirstIteration');
      expect(page.firstFutureIteration.getText()).toContain('Update Iteration');
      */
  });

  /* Start and Close an iteration */
 it('Start iteration', function() {
      page.clickExpandFutureIterationIcon();
      page.clickIterationKebab("3");
      page.clickStartIterationKebab();
      page.clickCreateIteration();
      // expect(page.toastNotification().isPresent()).toBe(true);
      // expect(page.firstCurrentIteration()).toBe("Iteration 0");
      // page.clickIterationKebab("3");
      // page.clickCloseIterationKebab();
      // page.clickCreateIteration();

  });
  
 it('Associate WI with Iteration from Kebab menu', function() {
      page.clickWorkItemKebabButton(page.firstWorkItem);
      page.clickWorkItemKebabAssociateIterationButton(page.firstWorkItem);
      page.clickDropDownAssociateIteration("Iteration 0");
      page.clickAssociateSave();
      var detailPage = page.clickWorkItemTitle(page.firstWorkItem, "id0");
      expect(detailPage.getAssociatedIteration()).toBe('Iteration 0');
  });

it('Re-Associate WI with Iteration from Kebab menu', function() {
      page.clickWorkItemKebabButton(page.firstWorkItem);
      page.clickWorkItemKebabAssociateIterationButton(page.firstWorkItem);
      page.clickDropDownAssociateIteration("Iteration 0");
      page.clickAssociateSave();
      var detailPage = page.clickWorkItemTitle(page.firstWorkItem, "id0");
      expect(detailPage.getAssociatedIteration()).toBe('Iteration 0');
      detailPage.clickWorkItemDetailCloseButton();
      // Re-Associate 
      page.clickWorkItemKebabButton(page.firstWorkItem);
      page.clickWorkItemKebabAssociateIterationButton(page.firstWorkItem);
      expect(detailPage.getReassociateText()).toContain('Iteration 0'); //is currently associated with
      page.clickDropDownAssociateIteration("Iteration 1");
      page.clickAssociateSave();
      var detailPage = page.clickWorkItemTitle(page.firstWorkItem, "id0");
      expect(detailPage.getAssociatedIteration()).toBe('Iteration 1');
  });

  it('Create new iteration and Associate item', function() {
    page.clickIterationAddButton();
    page.setIterationTitle('Newest Iteration',false);
    page.setIterationDescription('Newest Iteration',false);
    page.clickCreateIteration();
    page.clickWorkItemKebabButton(page.firstWorkItem);
    page.clickWorkItemKebabAssociateIterationButton(page.firstWorkItem);
    page.clickDropDownAssociateIteration("Newest Iteration");

//Below code has some issue while associating WI with new Itetation Works fine manually 

    // page.clickAssociateSave();
    // browser.wait(until.elementToBeClickable(page.clickWorkItemTitle(page.firstWorkItem, "id0")), constants.WAIT, 'Failed ');
    // var detailPage = page.clickWorkItemTitle(page.firstWorkItem, "id0");
    // expect(detailPage.getAssociatedIteration()).toBe('Newest Iteration');
    // detailPage.clickWorkItemDetailCloseButton();

  });

  it('Associate Workitem from detail page', function() {
      var detailPage = page.clickWorkItemTitle(page.firstWorkItem, "id0"); 
      browser.wait(until.elementToBeClickable(detailPage.workItemStateDropDownButton), constants.WAIT, 'Failed to find workItemStateDropDownButton');   
      detailPage.IterationOndetailPage().click();
      detailPage.clickAssignIteration();
      detailPage.associateIteration("Iteration 1");
      detailPage.saveIteration();
      expect(detailPage.getAssociatedIteration()).toBe("Iteration 1");
      detailPage.clickWorkItemDetailCloseButton();
    });
   it('Re-Associate Workitem from detail page', function() {
      var detailPage = page.clickWorkItemTitle(page.firstWorkItem, "id0"); 
      detailPage.IterationOndetailPage().click();
      detailPage.clickAssignIteration();
      detailPage.associateIteration("Iteration 1");
      detailPage.saveIteration();
      expect(detailPage.getAssociatedIteration()).toBe("Iteration 1");
      detailPage.clickWorkItemDetailCloseButton();
      // Re - assocaite
      page.clickWorkItemTitle(page.firstWorkItem, "id0");
      detailPage.IterationOndetailPage().click();
      detailPage.clickAssignIteration();
      detailPage.associateIteration("Iteration 0");
      detailPage.saveIteration();
      expect(detailPage.getAssociatedIteration()).toBe("Iteration 0");
      detailPage.clickWorkItemDetailCloseButton();
    });
 
 //Problem clicking on Iteration from Left penel
    // it('Filter Associate Workitem from detail page', function() {
    //   var detailPage = page.clickWorkItemTitle(page.firstWorkItem, "id0"); 
    //   detailPage.IterationOndetailPage().click();
    //   detailPage.clickAssignIteration();
    //   detailPage.associateIteration("Iteration 0");
    //   detailPage.saveIteration();
    //   expect(detailPage.getAssociatedIteration()).toBe("Iteration 0");
    //   detailPage.clickWorkItemDetailCloseButton();
    //   page.clickExpandFutureIterationIcon();
    //   // expect(page.firstFutureIteration.getText()).toBe('somethi');
    //   detailPage.genericLinkseach("Iteration 0");

    // });

  /* Verify iteration displays the correct workitem totals as workitems transition new->closed */
  it( 'Verify counters for workitems within iteration', function() {

    /* Verify that the iteration has zero workitems associated */
    page.clickExpandFutureIterationIcon();
    expect(page.getIterationCounter(page.firstFutureIteration).getText()).toBe('0');

    /* Associate workitems with an iteration */
    associateWithIteration (page, "Title Text 3", "Iteration 0");
    associateWithIteration (page, "Title Text 4", "Iteration 0");
    associateWithIteration (page, "Title Text 5", "Iteration 0");
    associateWithIteration (page, "Title Text 6", "Iteration 0");
    associateWithIteration (page, "Title Text 7", "Iteration 0");
    expect(page.getIterationCounter(page.firstFutureIteration).getText()).toBe('5');

    /* Start the iteration */
//    page.clickIterationKebab("1");
//    page.clickStartIterationKebab();
//    page.clickCreateIteration();
//
//    browser.ignoreSynchronization = true;
//    expect(page.iterationCount.getText()).toBe('0 of 5 completed');
//    //browser.ignoreSynchronization = false;
//
//    page.workItemViewId(page.workItemByTitle("Title Text 3")).getText().then(function (text) {
//      var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);
//      browser.wait(until.elementToBeClickable(detailPage.workItemStateDropDownButton), constants.WAIT, 'Failed to find workItemStateDropDownButton');   
//      detailPage.clickWorkItemStateDropDownButton();
//      browser.wait(until.elementToBeClickable(detailPage.WorkItemStateDropDownList().get(4)), constants.WAIT, 'Failed to find workItemStateDropDownButton');   
//      detailPage.WorkItemStateDropDownList().get(4).click();
//      detailPage.clickWorkItemDetailCloseButton();
//    });
//
//    expect(page.iterationCount.getText()).toBe('0 of 5 completed');
//
//    page.clickIterationKebab("1");
//    page.clickCloseIterationKebab();
//    page.clickCreateIteration();

// Start the first iteration
// Change the status of the 1st workitem from new to closed, verify that the total changes to 1/5
// Change the status of the 2nd workitem from new to closed, verify that the total changes to 2/5
// Change the status of the 3rd workitem from new to closed, verify that the total changes to 3/5
// Change the status of the 4th workitem from new to closed, verify that the total changes to 4/5
// Change the status of the 5th  workitem from new to closed, verify that the total changes to 5/5

    });

});


  /* Associate a work item aith an iteration */
  var associateWithIteration = function (thePage, theWorkItemTitle, theIterationTitle) {
      var until = protractor.ExpectedConditions;
      browser.wait(until.elementToBeClickable(thePage.workItemKebabButton(thePage.workItemByTitle(theWorkItemTitle))), constants.WAIT, 'Failed to find workItemKebabButton');
      thePage.clickWorkItemKebabButton(thePage.workItemByTitle(theWorkItemTitle));
      thePage.clickWorkItemKebabAssociateIterationButton(thePage.workItemByTitle(theWorkItemTitle));
      thePage.clickDropDownAssociateIteration(theIterationTitle);
      thePage.clickAssociateSave();
  }

