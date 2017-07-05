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
 * These tests are commented out as, while they run cleanly on firefox and chrome, phantomJS is unable to
 * recognize when the "move" dropdown is active:
 * https://github.com/fabric8-ui/fabric8-planner/issues/319#issuecomment-272997188
 * We can uncomment the tests when we migrate the tetss to run on CI with firefox and chrome (or when
 * we can find a bug fix for PhantomJS).
 *
 * @author ldimaggi
 */

/*
Drag and drop testing is blocked on PhantomJS. The behavior seen is:
*/

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  testSupport = require('./testSupport'),
  WorkItemDetailPage = require('./page-objects/work-item-detail.page'),
  CommonPage = require('./page-objects/common.page');

describe('Drag and drop Test', function () {
  var page, browserMode;
  var until = protractor.ExpectedConditions;
  var waitTime = 30000;

/* For Chrome and Firefox */
defaultWorkitems =
  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map((i) => {
    return 'id' + i + '\nTitle Text ' + i;
  });

/* For PhantomJS */
defaultWorkitemsPhantomJS = [
  'id0\nTitle Text 0',
  'id1\nTitle Text 1',
  'id2\nTitle Text 2',
  'id3\nTitle Text 3',
  'id4\nTitle Text 4',
  'id5\nTitle Text 5',
  'id6\nTitle Text 6',
  'id7\nTitle Text 7',
  'id8\nTitle Text 8',
  'id9\nTitle Text 9',
  'id10\nTitle Text 10' ];

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage(true);
    testSupport.setTestSpace(page);
  });

  it('should move workitem down/up - phone.', function() {

    page.allWorkItems.count().then(function (text) {
      var totalCount = text

     /* First, verify that the workitems are displayed in the expected order */
      page.allWorkItems.getText().then(function (text) {
        if (totalCount = "11") {
          expect(compareWorkitemArray (text, defaultWorkitems)).toBe(true);
        }
        else {
          expect(compareWorkitemArray (text, defaultWorkitems)).toBe(true);
        }
      });

      /* Verify that the first work item is in the correct position */
      expect(page.workItemTitle(page.workItemByIndex(0))).toBe("Title Text 0");
      compareWorkitems (page, 0, "Title Text 0");

      /* Move the workitem down and up */
      page.isWorkItemCheckboxSelected (page.workItemByIndex(0)).then(function(selected) {
        if (!selected){
           page.clickWorkItemCheckbox (page.workItemByIndex(0)).then(function() {

             /* Walk the workitem down the list */
//             for (i = 0; i < totalCount - 1; i++) {
//               compareWorkitems (page, i, "Title Text 0");
//               page.clickWorkItemMovePulldown().then(function() {
//                 browser.wait(until.elementToBeClickable(page.workItemMovePulldownDown(page.workItemMovePulldown)), waitTime);
//                 page.clickWorkItemMovePulldownDown(page.workItemMovePulldown);
                 // commented out due to: https://github.com/fabric8-ui/fabric8-planner/issues/762
//               });
//             }

             /* And back up the list */
             for (i = totalCount - 1; i > 0; i--) {
//               compareWorkitems (page, i, "Title Text 0");
//               page.clickWorkItemMovePulldown().then(function() {
//                 browser.wait(until.elementToBeClickable(page.workItemMovePulldownUp(page.workItemMovePulldown)), waitTime);
//                 page.clickWorkItemMovePulldownUp(page.workItemMovePulldown);
                 // commented out due to: https://github.com/fabric8-ui/fabric8-planner/issues/762
//               });
             }
           });
        }

      });

    });

  }); /* 'it' test */

  it('should top workitem to the bottom and back up to the top - phone.', function() {

    page.allWorkItems.count().then(function (text) {
      var totalCount = text

      /* First, verify that the workitems are displayed in the expected order */
      page.allWorkItems.getText().then(function (text) {
        if (totalCount = "11") {
          expect(compareWorkitemArray (text, defaultWorkitems)).toBe(true);
        }
        else {
          expect(compareWorkitemArray (text, defaultWorkitems)).toBe(true);
        }
      });

      /* Verify that the first work item is in the correct position */
      expect(page.workItemTitle(page.workItemByIndex(0))).toBe("Title Text 0");
      compareWorkitems (page, 0, "Title Text 0");

      /* Move the workitem down and up */
      page.isWorkItemCheckboxSelected (page.workItemByIndex(0)).then(function(selected) {
        if (!selected){
            page.clickWorkItemCheckbox (page.workItemByIndex(0)).then(function() {

            page.clickWorkItemMovePulldown().then(function() {
//                 browser.wait(until.elementToBeClickable(page.workItemMovePulldownBottom(page.workItemMovePulldown)), waitTime);
//                 page.clickWorkItemMovePulldownBottom(page.workItemMovePulldown);
                 //compareWorkitems (page, totalCount - 1, "Title Text 0");
                 // commented out due to: https://github.com/fabric8-ui/fabric8-planner/issues/762
               });

            page.clickWorkItemMovePulldown().then(function() {
//                 browser.wait(until.elementToBeClickable(page.workItemMovePulldownTop(page.workItemMovePulldown)), waitTime);
//                 page.clickWorkItemMovePulldownTop(page.workItemMovePulldown);
                 //compareWorkitems (page, 0, "Title Text 0");
                 // commented out due to: https://github.com/fabric8-ui/fabric8-planner/issues/762
               });

           });
        }

      });

    });

  }); /* "it" test */

  it('should top workitem to the bottom and back to the top via the workitem kebab - phone.', function() {

    page.allWorkItems.count().then(function (text) {
      var totalCount = text

      /* Verify that the first work item is in the correct position */
      expect(page.workItemTitle(page.workItemByIndex(0))).toBe("Title Text 0");
      compareWorkitems (page, 0, "Title Text 0");

      /* Move the workitem to the bottom */
      page.clickWorkItemKebabButton (page.workItemByTitle("Title Text 0")).then(function() {
        page.clickWorkItemKebabMoveToBottomButton(page.workItemByTitle("Title Text 0"));
        compareWorkitems (page, totalCount - 1, "Title Text 0");
      });
      /* And then move it back to the top */
      page.clickWorkItemKebabButton (page.workItemByTitle("Title Text 0")).then(function() {
        page.clickWorkItemKebabMoveToTopButton(page.workItemByTitle("Title Text 0"));
        compareWorkitems (page, 0, "Title Text 0");
      });

    });

  }); /* "it" test */

  it('should top workitem to the bottom and back to the top via the workitem kebab - desktop.', function() {
    testSupport.setBrowserMode('desktop');

    page.allWorkItems.count().then(function (text) {
      var totalCount = text

      /* Verify that the first work item is in the correct position */
      expect(page.workItemTitle(page.workItemByIndex(0))).toBe("Title Text 0");
      compareWorkitems (page, 0, "Title Text 0");

      /* Move the workitem to the bottom */
      page.clickWorkItemKebabButton (page.workItemByTitle("Title Text 0")).then(function() {
        page.clickWorkItemKebabMoveToBottomButton(page.workItemByTitle("Title Text 0"));
        compareWorkitems (page, totalCount - 1, "Title Text 0");
      });
      /* And then move it back to the top */
      page.clickWorkItemKebabButton (page.workItemByTitle("Title Text 0")).then(function() {
        page.clickWorkItemKebabMoveToTopButton(page.workItemByTitle("Title Text 0"));
        compareWorkitems (page, 0, "Title Text 0");
      });

    });

  }); /* "it" test */

});

/* Compare an expected and actual work item - the offset values enable us to track
   workitems after they have been moved. */
  var compareWorkitems = function(page, targetIndex, expectedTitle) {
    expect(page.workItemTitle(page.workItemByIndex(targetIndex))).toBe(expectedTitle);
  }

/* Compare the full list of workitems to determine whether a workitem move was successful */
var compareWorkitemArray = function(array1, array2) {
  returnValue = true;
  if (array1.length != array2.length) {
    returnValue = false;
    //console.log("length mismatch" + array1.length + array2.length + returnValue);
  }
  for (i = 0; i < array1.length; i++) {
    //console.log (array1[i], array2[i]);
    if (array1[i] != array2[i]) {
      returnValue = false;
      break;
    }
    //console.log(returnValue);
  }
  return returnValue;
};
