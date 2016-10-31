/**
 * AlMighty page object example module for work item list page
 * See: http://martinfowler.com/bliki/PageObject.html,
 * https://www.thoughtworks.com/insights/blog/using-page-objects-overcome-protractors-shortcomings
 * @author ldimaggi@redhat.com
 * TODO - Complete the page object model pending completion of UI at: http://demo.almighty.io/
 */

'use strict';

/*
/*
 * Work Item Board Page Definition
 */

var WorkItemBoardPage = function () {
  browser.get("http://localhost:8088/#/board/?token=justarandomtokenfortest");
};

var until = protractor.ExpectedConditions;
var waitTime = 30000;

WorkItemBoardPage.prototype  = Object.create({}, {

  workItemListButton:  {
    get: function ()
    { return element(by.id("header_menuWorkItemList")); }
  },

  boardButton:  {
    get: function ()
    { return element(by.id("header_menuBoard")); }
  },

  workItemBoardSearchBox:  {
    get: function ()
    { return element(by.css("#search-box input")); }
  },

  typeworkItemBoardSearchBox:  {
    value: function (keys)
    { return this.workItemBoardSearchBox.sendKeys(keys); }
  },

  allWorkItemCards:  {
    get: function ()
    { return element.all(by.css("#board_topWorkItems")); }
  },

  firstWorkItem:  {
    get: function ()
    { return element.all(by.css("#board_topWorkItems")).first(); }
  },

  lastWorkItem:  {
    get: function ()
    { return element.all(by.css("#board_topWorkItems")).last(); }
  },

  workItemByIndex:  {
    value: function (itemNumber)
      { return element.all(by.css("#board_topWorkItems")).get(itemNumber); }
    },

  workItemByNumber:  {
    value: function (itemNumber)
    {
      var xPathString = "board_topWorkItemList_" + itemNumber;
      return element(by.id(xPathString));
    }
  },

  /*
   * When the Work Item 'View Detail' page is opened, there can be a delay of a few seconds before
   * the page contents are displayed - the browser.wait statement covers this wait for the title
   * of the page - there is a further delay before the values of the elements on the page are displayed.
   */
  clickWorkItemViewButton:   {
    value: function (button, idValue)
    {
      button.click();
      var theDetailPage = new WorkItemDetailPage (idValue);
      var until = protractor.ExpectedConditions;
      browser.wait(until.presenceOf(theDetailPage.workItemDetailPageTitle), waitTime, 'Detail page title taking too long to appear in the DOM');
      browser.wait(waitForText(theDetailPage.workItemDetailTitle), waitTime, "Title text is still not present");
      return theDetailPage;
    }
  },

  userToggle:  {
    get: function ()
    { return element(by.id("header_dropdownToggle")); }
  },

  clickUserToggle:   {
    value: function ()
    { return this.userToggle.click(); }
  }
});

/*
 * Custom wait function - determine if ANY text appears in a field's value
 */
function waitForText(elementFinder) {
  return function () {
    return elementFinder.getAttribute("value").then(function(text) {
//      console.log("text = " + text);
      return text !== "";  // could also be replaced with "return !!text;"
    });
  };
};

module.exports = WorkItemBoardPage;
