/**
 * POC test for automated UI tests for ALMighty
 *  Story: Display and Update Work Item Details
 *  https://github.com/almighty/almighty-core/issues/298
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

var WorkItemListPage = require('./work-item-list.page'),
  testSupport = require('./testSupport');

describe('Work item list', function () {
  var page, items, startCount, browserMode;

var until = protractor.ExpectedConditions;
var waitTime = 30000;

  beforeEach(function () {
    testSupport.setBrowserMode('phone');
    page = new WorkItemListPage();
    page.allWorkItems.count().then(function(originalCount) { startCount = originalCount; });
  });

/* Create a new workitem, fill in the details, save, retrieve, update, save, verify updates are saved */
  it('should find and update the workitem through its detail page.', function() {

    /* Create a new workitem */
    var workItemTitle = "The test workitem title";
    var workItemUpdatedTitle = "The test workitem title - UPDATED";
    var workItemDescription = "The test workitem description";
    var workItemUpdatedDescription = "The test workitem description - UPDATED";
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(workItemTitle);
    page.clickQuickAddSave().then(function() {
      expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);

      /* Fill in/update the new work item's title and details field */
      expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);
      page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
        var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);
        
        detailPage.clickWorkItemTitleDiv();
        //detailPage.clickWorkItemTitleEditIcon();
        detailPage.setWorkItemDetailTitle (workItemUpdatedTitle, false);
        detailPage.clickWorkItemTitleSaveIcon();
        detailPage.clickWorkItemDetailCloseButton();
        browser.wait(until.presenceOf(page.firstWorkItem), waitTime, 'Failed to find workItemList');
        expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemUpdatedTitle);
      });

    });

  });

  /* Create a new workitem, fill in the details, save, retrieve, update, save, verify updates are saved */
  it('should find and update the workitem through its detail page - desktop.', function() {
    testSupport.setBrowserMode('desktop');

    /* Create a new workitem */
    var workItemTitle = "The test workitem title";
    var workItemUpdatedTitle = "The test workitem title - UPDATED";
    var workItemDescription = "The test workitem description";
    var workItemUpdatedDescription = "The test workitem description - UPDATED";
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(workItemTitle);
    page.typeQuickAddWorkItemDesc(workItemDescription);
    page.clickQuickAddSave().then(function() {
      expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);
      expect(page.workItemDescription(page.firstWorkItem)).toBe(workItemDescription);

      /* Fill in/update the new work item's title and details field */
      expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);
      page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
        var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

        detailPage.clickWorkItemTitleDiv();
        //detailPage.clickWorkItemTitleEditIcon();
        detailPage.setWorkItemDetailTitle (workItemUpdatedTitle, false);
        detailPage.clickWorkItemTitleSaveIcon();
//        detailPage.clickWorkItemDescriptionEditIcon();
        detailPage.clickWorkItemDetailDescription()
        detailPage.setWorkItemDetailDescription (workItemUpdatedDescription, false);
        detailPage.clickWorkItemDescriptionSaveIcon();

        detailPage.clickWorkItemDetailCloseButton();
        browser.wait(until.presenceOf(page.firstWorkItem), waitTime, 'Failed to find workItemList');
        expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemUpdatedTitle);
        expect(page.workItemDescription(page.firstWorkItem)).toBe(workItemUpdatedDescription);
      });

    });

  });

/* Verify that edits made to a workitem in the detail page, if cancelled, are discarded */
 it('should cancel edits to the workitem through its detail page - desktop.', function() {
    testSupport.setBrowserMode('desktop');

    /* Create a new workitem */
    var workItemTitle = "The test workitem title";
    var workItemUpdatedTitle = "The test workitem title - UPDATED";
    var workItemDescription = "The test workitem description";
    var workItemUpdatedDescription = "The test workitem description - UPDATED";
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(workItemTitle);
    page.typeQuickAddWorkItemDesc(workItemDescription);
    page.clickQuickAddSave().then(function() {
      expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);
      expect(page.workItemDescription(page.firstWorkItem)).toBe(workItemDescription);

      /* Fill in/update the new work item's title and details field */
      expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);
      page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
        var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

        detailPage.clickWorkItemTitleDiv();
        //detailPage.clickWorkItemTitleEditIcon();
        detailPage.setWorkItemDetailTitle (workItemUpdatedTitle, false);
        detailPage.clickWorkItemTitleCancelIcon();
        detailPage.clickWorkItemDetailDescription()
        //detailPage.clickWorkItemDescriptionEditIcon();
        detailPage.setWorkItemDetailDescription (workItemUpdatedTitle, false);
        detailPage.clickWorkItemDescriptionCancelIcon();

        detailPage.clickWorkItemDetailCloseButton();
        browser.wait(until.presenceOf(page.workItemByTitle(workItemTitle)), waitTime, 'Failed to find workItemList');
        expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);
        expect(page.workItemDescription(page.firstWorkItem)).toBe(workItemDescription);
      });

    });

  });

/* Verify that edits made to a workitem in the detail page, if cancelled, are discarded */
 it('should cancel edits to the workitem through its detail page - phone.', function() {
    /* Create a new workitem */
    var workItemTitle = "The test workitem title";
    var workItemUpdatedTitle = "The test workitem title - UPDATED";

    var workItemDescription = "The test workitem description";
    var workItemUpdatedDescription = "The test workitem description - UPDATED";
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(workItemTitle);

    page.clickQuickAddSave().then(function() {
      expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);
      /* Fill in/update the new work item's title and details field */
      expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);
      page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
        var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

        detailPage.clickWorkItemTitleDiv();
        //detailPage.clickWorkItemTitleEditIcon();
        detailPage.setWorkItemDetailTitle (workItemUpdatedTitle, false);
        detailPage.clickWorkItemTitleCancelIcon();
        detailPage.clickWorkItemDetailCloseButton();
        browser.wait(until.presenceOf(page.workItemByTitle(workItemTitle)), waitTime, 'Failed to find workItemList');
        expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);

      });

    });

  });


  /*Edit with blank title - Mobile Should show validation message*/
    it('Edit with blank title - Mobile Should show validation message. -phone', function() {

      /* Create a new workitem */
      var workItemTitle = "The test workitem title";
      var workItemUpdatedTitle = "               ";
      var workItemDescription = "";
      var workItemUpdatedDescription = " - UPDATED";
      page.clickWorkItemQuickAdd();
      page.typeQuickAddWorkItemTitle(workItemTitle);
      page.clickQuickAddSave().then(function() {
        expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);

        /* Fill in/update the new work item's title with blank and details field */
        expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);
        page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
          var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

          detailPage.clickWorkItemTitleDiv();
          detailPage.setWorkItemDetailTitle (workItemUpdatedTitle, false);
          detailPage.clickWorkItemTitleSaveIcon();
          expect(detailPage.titleValidation().isPresent()).toBeTruthy();
          expect(detailPage.titleAlert()).toBeTruthy();
          expect(detailPage.titleAlertValidation()).toBeTruthy();
        });

      });

    });

    /*Edit with blank title - Desktop Should show validation message*/
      it('Edit with blank title - Mobile Should show validation message. -Desktop', function() {
        testSupport.setBrowserMode('desktop');
        /* Create a new workitem */
        var workItemTitle = "The test workitem title";
        var workItemUpdatedTitle = "               ";
        var workItemDescription = "";
        var workItemUpdatedDescription = " - UPDATED";
        page.clickWorkItemQuickAdd();
        page.typeQuickAddWorkItemTitle(workItemTitle);
        page.clickQuickAddSave().then(function() {
          expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);

          /* Fill in/update the new work item's title with blank and details field */
          expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);
          page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
            var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

            detailPage.clickWorkItemTitleDiv();
            detailPage.setWorkItemDetailTitle (workItemUpdatedTitle, false);
            detailPage.clickWorkItemTitleSaveIcon();
            expect(detailPage.titleValidation().isPresent()).toBeTruthy();
            expect(detailPage.titleAlert()).toBeTruthy();
            expect(detailPage.titleAlertValidation()).toBeTruthy();

          });

        });

      });
  /*Edit title and description by hitting Enter key Mobile - phone.*/
  it('Edit title and description by hitting Enter key Mobile - phone.', function() {
    testSupport.setBrowserMode('phone');
    /* Create a new workitem */
    var workItemTitle = "The test workitem title";
    var workItemUpdatedTitle = "something";
    var workItemDescription = "Some description";
    var workItemUpdatedDescription = " - UPDATED";
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(workItemTitle);
    page.clickQuickAddSave().then(function() {
      expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);

      /* Fill in/update the new work item's title with blank and details field */
      expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);
      page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
        var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

        detailPage.clickWorkItemTitleDiv();
        detailPage.setWorkItemDetailTitle(workItemUpdatedTitle, false);
        detailPage.workItemDetailTitle.sendKeys(protractor.Key.ENTER);
        detailPage.clickWorkItemDetailCloseButton();
        browser.wait(until.presenceOf(page.firstWorkItem), waitTime, 'Failed to find workItemList');
        expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemUpdatedTitle);
      });

    });
  });
  /*Edit title and description by hitting Enter key Mobile - desktop.*/
      it('Edit title and description by hitting Enter key  - desktop.', function() {
        testSupport.setBrowserMode('desktop');
        /* Create a new workitem */
        var workItemTitle = "The test workitem title";
        var workItemUpdatedTitle = "something";
        var workItemDescription = "";
        var workItemUpdatedDescription = " - UPDATED";
        page.clickWorkItemQuickAdd();
        page.typeQuickAddWorkItemTitle(workItemTitle);
        page.clickQuickAddSave().then(function() {
          expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);

          /* Fill in/update the new work item's title with blank and details field */
          expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);
          page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
            var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

            detailPage.clickWorkItemTitleDiv();
            detailPage.setWorkItemDetailTitle(workItemUpdatedTitle, false);
            detailPage.workItemDetailTitle.sendKeys(protractor.Key.ENTER);


            detailPage.clickWorkItemDetailCloseButton();
            browser.wait(until.presenceOf(page.firstWorkItem), waitTime, 'Failed to find workItemList');
            expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemUpdatedTitle);
          });

        });
  });
  /* Verify how many work item type exists in drop down - phone*/
   it('Verify how many work item type exists in drop down - phone', function() {
      testSupport.setBrowserMode("phone");
      var workItemTitle = "The test workitem title";
      var workItemUpdatedTitle = "The test workitem title - UPDATED";
      page.clickWorkItemQuickAdd();
      page.typeQuickAddWorkItemTitle(workItemTitle);
      page.clickQuickAddSave().then(function() {
        expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);
        expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);
        page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
          var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);
          expect(detailPage.WorkItemTypeDropDownListCount()).toBe(6);
          detailPage.clickWorkItemDetailCloseButton();
        });
      });
    });
/* Verify how many work item type exists in drop down - desktop*/
it('Verify how many work item type exists in drop down - desktop', function() {
        testSupport.setBrowserMode("desktop");
        var workItemTitle = "The test workitem title";
        var workItemUpdatedTitle = "The test workitem title - UPDATED";
        page.clickWorkItemQuickAdd();
        page.typeQuickAddWorkItemTitle(workItemTitle);
        page.clickQuickAddSave().then(function() {
          expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);
          expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);
          page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
            var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);
            expect(detailPage.WorkItemTypeDropDownListCount()).toBe(6);
            detailPage.clickWorkItemDetailCloseButton();
          });
        });
      });
      /* Verify the name display of workitem types are correct  - phone*/
           it('Verify the name display of workitem types are correct ', function() {
              var workItemTitle = "The test workitem title";
              var workItemUpdatedTitle = "The test workitem title - UPDATED";
              page.clickWorkItemQuickAdd();
              page.typeQuickAddWorkItemTitle(workItemTitle);
              page.clickQuickAddSave().then(function() {
                expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);
                expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);
                page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
                  var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);
                  detailPage.clickworkItemDetailTypeIcon();
                  var wi_types = ["userstory", "valueproposition", "fundamental","experience","feature","bug"];
                  for(var i=0;i<wi_types.length;i++){
                 // expect(detailPage.WorkItemTypeDropDownList().get(i).getText()).toBe(wi_types[i]);
                  expect(detailPage.workItemTypeDropDownListString(wi_types[i]).getAttribute('innerHTML')).toContain(wi_types[i]);
                  }
                  detailPage.clickWorkItemDetailCloseButton();
                });

              });

      });

/*Verfify on selecting workitem it should display in list and detail view both pages - Desktop  */
       it('Verfify on selecting workitem it should display in list and detail view both pages -Desktop ', function() {
          testSupport.setBrowserMode('desktop');
          var workItemTitle = "The test workitem title";
          var workItemUpdatedTitle = "The test workitem title - UPDATED";
          page.clickWorkItemQuickAdd();
          page.typeQuickAddWorkItemTitle(workItemTitle);
          page.clickQuickAddSave().then(function() {
             page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
              var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);
      //        detailPage.clickworkItemDetailTypeIcon();
      //        detailPage.clickWorkItemTypeDropDownList(0).click();
      //        detailPage.clickWorkItemDetailCloseButton();
      //        expect(detailPage.detailUserstroyIcon().isPresent()).toBeTruthy();
              expect(detailPage.detailUserstroyIcon2("fa-bookmark").isPresent()).toBeTruthy();
           });
          });
          });
  /*Verfify on selecting workitem it should display in list and detail view both pages - Desktop  */
   it('Verfify on selecting workitem it should display in list and detail view both pages -Desktop ', function() {
      testSupport.setBrowserMode('phone');
      var workItemTitle = "The test workitem title";
      var workItemUpdatedTitle = "The test workitem title - UPDATED";
      page.clickWorkItemQuickAdd();
      page.typeQuickAddWorkItemTitle(workItemTitle);
      page.clickQuickAddSave().then(function() {
         page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
          var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);
          detailPage.clickworkItemDetailTypeIcon();
        //  detailPage.clickWorkItemTypeDropDownList("2").click();
        //  detailPage.clickWorkItemDetailCloseButton();
       });
      });

    });



  /*Edit with blank description - desktop Should show "No description available for this work item.".*/
      it('Edit title and description by hitting Enter key - desktop.', function() {
        testSupport.setBrowserMode('desktop');
        /* Create a new workitem */
        var workItemTitle = "The test workitem title";
        var workItemUpdatedTitle = "something";
        var workItemDescription = "   ";
        var workItemUpdatedDescription ="             ";
        var nodescription="No description available for this work item.";
        page.clickWorkItemQuickAdd();
        page.typeQuickAddWorkItemTitle(workItemTitle);
        page.typeQuickAddWorkItemDesc(workItemDescription);
        page.clickQuickAddSave().then(function() {
          expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);

          /* Fill in/update the new work item's title with blank and details field */
          expect(page.workItemTitle(page.firstWorkItem)).toBe(workItemTitle);
          page.workItemViewId(page.workItemByTitle(workItemTitle)).getText().then(function (text) {
            var detailPage = page.clickWorkItemTitle(page.firstWorkItem, text);

            detailPage.clickWorkItemTitleDiv();
            detailPage.setWorkItemDetailTitle(workItemUpdatedTitle, false);
            detailPage.workItemDetailTitle.sendKeys(protractor.Key.ENTER);
            detailPage.clickWorkItemDetailCloseButton();
            browser.wait(until.presenceOf(page.firstWorkItem), waitTime, 'Failed to find workItemList');
            expect(page.workItemDescription(page.firstWorkItem)).toBe(nodescription);
          });

        });
  });

/* Verify that a workitem's description cannot be edited in the detail page until the edit icon is clicked */



});
