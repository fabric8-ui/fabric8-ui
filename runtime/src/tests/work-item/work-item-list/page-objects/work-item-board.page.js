/**
 * Planner page object example module for work item list page
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

let testSupport = require('../testSupport');
let CommonPage = require('./common.page');
let constants = require("../constants");
let until = protractor.ExpectedConditions;

class WorkItemBoardPage {

 constructor(login) {
   if(login==true) {
    let url = encodeURIComponent(JSON.stringify({
      access_token: 'somerandomtoken',
      expires_in: 1800,
      refresh_expires_in: 1800,
      refresh_token: 'somerandomtoken',
      token_type: "bearer"
    }));
    browser.get("http://localhost:8088/plan/board?token_json="+url);
    }
   else {
     browser.get("http://localhost:8088/plan/board");
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
  getTypesOfStates  (index){
    return element(by.xpath('.//*[@id="board_topWorkItems"]/div/div['+ index +']/section/div[1]/span[1]')).getText();
  }
  getTotalCountPerStateType (index){
    return element(by.xpath('.//*[@id="board_topWorkItems"]/div/div['+ index +']/section/div[1]/span[2]')).getText();
  }
  clickWithId(index){
    //For new Coulumn
    return element(by.xpath('.//*[@id="board_topWorkItems"]/div/div[1]/section/div[2]/div[2]/div['+ index +']/div[1]/div/span[2]')).click();
  }
  clickWithIdAnyColumn(column,index){
    //For any Coulumn
    return element(by.xpath('.//*[@id="board_topWorkItems"]/div/div['+ column  +']/section/div[2]/div/div[' + index + ']/div[1]/div/span[2]')).click();
  }
  getFilterWITButton (){
    return element(by.id('wi-board-type'));
  }
  clickFilterWITButton (){
    return this.getFilterWITButton().click();
  }
  getTextFilterWITButton  (){
    return this.getFilterWITButton().getText();
  }
  clickWITFilterDropDownElements  (text){
    return element(by.linkText(text)).click();
  }
  getByLinkText(text){
    return element(by.linkText(text)).click();
  }
  getBoardById(text){
    return element(by.id(text)).click();
  }
  
}

module.exports = WorkItemBoardPage;
