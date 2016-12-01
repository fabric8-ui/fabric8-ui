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

let testSupport = require('./testSupport');
let CommonPage = require('./common.page');
let constants = require("./constants");
let until = protractor.ExpectedConditions;

class WorkItemBoardPage {

 constructor(login) {
   if(login==true) {
     browser.get("http://localhost:8088/#/board/?token=justarandomtokenfortest");
     }
   else {
     browser.get("http://localhost:8088/#/board");
   }
 };

  get workItemListButton () {
    return element(by.id("header_menuWorkItemList"));
  }

  get boardButton () {
    return element(by.id("header_menuBoard"));
  }

  get workItemBoardSearchBox () {
    return element(by.css("#search-box input"));
  }

  typeworkItemBoardSearchBox (keys) {
    return this.workItemBoardSearchBox.sendKeys(keys);
  }

  get allWorkItemCards () {
    return element.all(by.css("#board_topWorkItems"));
  }

  get firstWorkItem () {
    return element.all(by.css("#board_topWorkItems")).first();
  }

  get lastWorkItem () {
    return element.all(by.css("#board_topWorkItems")).last();
  }

  workItemByIndex (itemNumber) {
      return element.all(by.css("#board_topWorkItems")).get(itemNumber);
  }

  workItemByNumber (itemNumber) {
    var xPathString = "board_topWorkItemList_" + itemNumber;
    return element(by.id(xPathString));
  }

  /*
   * When the Work Item 'View Detail' page is opened, there can be a delay of a few seconds before
   * the page contents are displayed - the browser.wait statement covers this wait for the title
   * of the page - there is a further delay before the values of the elements on the page are displayed.
   */
  clickWorkItemViewButton (button, idValue) {
    button.click();
    var theDetailPage = new WorkItemDetailPage (idValue);
    var until = protractor.ExpectedConditions;
    browser.wait(until.presenceOf(theDetailPage.workItemDetailPageTitle), constants.WAIT, 'Detail page title taking too long to appear in the DOM');
    browser.wait(testSupport.waitForText(theDetailPage.workItemDetailTitle), constants.WAIT, "Title text is still not present");
    return theDetailPage;
  }

  get userToggle () {
    return element(by.id("header_dropdownToggle"));
  }

  clickUserToggle () {
    return this.userToggle.click();
  }

}

module.exports = WorkItemBoardPage;
