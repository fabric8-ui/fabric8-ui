/**
 * AlMighty page object example module for work item list page
 * See: http://martinfowler.com/bliki/PageObject.html,
 * https://www.thoughtworks.com/insights/blog/using-page-objects-overcome-protractors-shortcomings
 * @author ldimaggi@redhat.com
 * TODO - Complete the page object model pending completion of UI at: http://demo.almighty.io/
 */

'use strict';

/*
 * Work Item List Page Definition
 */

let testSupport = require('../testSupport');
let WorkItemDetailPage = require('./work-item-detail.page');
let WorkItemBoardPage = require('./work-item-board.page');
let CommonPage = require('./common.page');
let constants = require("../constants");
let until = protractor.ExpectedConditions;

class WorkItemListPage {

 constructor(login) {
   if(login==true) {
     browser.get("http://localhost:8088/?token=justarandomtokenfortest");
     }
   else {
     browser.get("http://localhost:8088/");
   }
 };

 get workItemListButton () {
     return element(by.id("header_menuWorkItemList"));
 }

 clickWorkItemListButton() {
   browser.wait(until.presenceOf(this.workItemListButton), constants.WAIT, 'Failed to find workItemListButton');
   return this.workItemListButton.click(); 
 }

 get boardButton () {
     return element(by.id("header_menuBoard"));
 }
 
 get clickBoardButton () {
   this.boardButton.click();
   return new WorkItemBoardPage();
 }

 get userToggle () {
     return element(by.id("header_dropdownToggle"));
 }
 
 clickUserToggle () {
   return this.userToggle.click(); 
 }

/* Page elements - bottom of the page - work item quick add */

 get workItemQuickAddTitle () {
   return element(by.id("exampleInput"));
  } 

 typeQuickAddWorkItemTitle (keys) {
   browser.wait(until.presenceOf(this.workItemQuickAddTitle), constants.WAIT, 'Failed to find workItemQuickAddTitle');
   return this.workItemQuickAddTitle.sendKeys(keys); 
 }

 get workItemQuickAddDesc () {
   return element(by.id("exampleDesc"));
 }
 
 typeQuickAddWorkItemDesc (keys) {
   browser.wait(until.presenceOf(this.workItemQuickAddDesc), constants.WAIT, 'Failed to find workItemQuickAddDesc');
   return this.workItemQuickAddDesc.sendKeys(keys); 
 }

 /* Access the Kebab element relative to its parent workitem */
 clickWorkItemKebabButton (parentElement) {
   browser.wait(until.presenceOf(parentElement.element(by.id("dropdownKebabRight"))), constants.WAIT, 'Failed to find clickWorkItemKebabButton');
   return parentElement.element(by.id("dropdownKebabRight")).click(); 
 }

 KebabButtonById () {
   return element(by.id("dropdownKebabRight"));
 }

 /* Login functions */

 clickLoginButton () {
   return element(by.id('header_rightDropdown')).all(By.tagName('a')).get(0).click(); 
 }

 clickLogoutButton () {
   return element(by.xpath('.//*[@id="header_rightDropdown"]/li[5]/a'));
 }

 signInGithub (gitusername,gitpassword) {
   element(By.css('.fa.fa-github')).click();
   browser.ignoreSynchronization = true;
   var until = protractor.ExpectedConditions;
   browser.wait(until.presenceOf(element(by.xpath('.//*[@id="login"]/form/div[3]/div/p'))), 80000, 'Sign into');
   element(By.id('login_field')).sendKeys(gitusername);
   element(By.id('password')).sendKeys(gitpassword);
   return  element(By.css('.btn.btn-primary.btn-block')).click();
 }

  /* Access the Kebab element relative to its parent workitem */
  clickWorkItemKebabDeleteButton (parentElement) {
    browser.wait(until.presenceOf(parentElement.element(by.css('.workItemList_Delete'))), constants.WAIT, 'Failed to find clickWorkItemKebabButton');
    return parentElement.element(by.css('.workItemList_Delete')).click(); 
  }

  get workItemPopUpDeleteConfirmButton () {
    return element(by.buttonText('Confirm'));
  } 

  clickWorkItemPopUpDeleteConfirmButton () {
    browser.wait(until.presenceOf(this.workItemPopUpDeleteConfirmButton), constants.WAIT, 'Failed to find workItemPopUpDeleteConfirmButton');
    return this.workItemPopUpDeleteConfirmButton.click(); 
  }

  get workItemPopUpDeleteCancelConfirmButton () {
    return element(by.buttonText('Cancel'));
  } 

  clickWorkItemPopUpDeleteCancelConfirmButton () {
    browser.wait(until.presenceOf(this.workItemPopUpDeleteCancelConfirmButton), constants.WAIT, 'Failed to find clickWorkItemPopUpDeleteCancelConfirmButton');
    return this.workItemPopUpDeleteCancelConfirmButton.click(); 
  }

  get openButton () {
    return element(by.css(".workItemQuickAdd_saveBtn"));
  } 

  quickAddbuttonById () {
    return element(by.id("workItemQuickAdd_container"));
  }

  clickWorkItemQuickAdd () {
    browser.wait(until.presenceOf(this.openButton), constants.WAIT, 'Failed to find the open button');
    return this.openButton.click();  
  }

  get saveButton () {
    return  element(by.css(".workItemQuickAdd_Add"));
  } 

  clickQuickAddSave () {
    browser.wait(until.presenceOf(this.saveButton), constants.WAIT, 'Failed to find the saveButton');
    return this.saveButton.click(); 
  }

  get cancelButton () {
    return element(by.id(".workItemQuickAdd_goBackBtn"));
  } 

  clickQuickAddCancel () {
    browser.wait(until.presenceOf(this.cancelButton), constants.WAIT, 'Failed to find the cancelButton');
    return this.cancelButton.click(); 
  }

  /* Page elements - work item list */

  get allWorkItems () {
    return element.all(by.css(".work-item-list-entry"));
  } 

  /* xpath = //alm-work-item-list-entry[.//text()[contains(.,'Some Title 6')]]   */
  workItemByTitle (titleString) {
    return element(by.xpath("//alm-work-item-list-entry[.//text()[contains(.,'" + titleString + "')]]")); 
  }

  get firstWorkItem () {
    return element.all(by.css(".work-item-list-entry")).first();
  } 

  get lastWorkItem () {
    return element.all(by.css(".work-item-list-entry")).last();
  } 

  /* Title element relative to a workitem */
  workItemTitle (workItemElement) {
    return workItemElement.element(by.css(".workItemList_title")).getText(); 
  }

  clickWorkItemTitle (workItemElement, idText) {
    workItemElement.element(by.css(".workItemList_title")).click();
    var theDetailPage = new WorkItemDetailPage (idText);
    var until = protractor.ExpectedConditions;
    //browser.wait(until.presenceOf(theDetailPage.workItemDetailPageTitle), constants.WAIT, 'Detail page title taking too long to appear in the DOM');
    browser.wait(testSupport.waitForText(theDetailPage.clickWorkItemDetailTitle), constants.WAIT, "Title text is still not present");
    return theDetailPage;
  }
 
  /* Description element relative to a workitem */
  workItemDescription (workItemElement) {
    return workItemElement.element(by.css(".workItemList_description")).getText(); 
  }

  workItemByIndex (itemNumber) { 
    return element.all(by.css(".work-item-list-entry")).get(itemNumber); 
  }

  workItemByNumber (itemNumber) {
    var xPathString = "workItemList_OuterWrap_" + itemNumber;
    return element(by.id(xPathString));
  }
  
  kebabByNumber (itemNumber) {
    var XPathString = "workItemList_OuterWrap_" + itemNumber +"/div/div[2]/div";
    return element(by.id(XPathString));
  }

  workItemViewButton (parentElement) { 
    return parentElement.element(By.css( ".list-view-pf-main-info" )); 
  }

  workItemViewId (parentElement) { 
    return parentElement.element(By.css( ".list-view-pf-left.type.workItemList_workItemType" )); 
  }

  workItemViewTitle (parentElement) { 
    return parentElement.element(By.css( ".list-group-item-heading.workItemList_title" )); 
  }
  
  workItemViewDescription (parentElement) { 
    return parentElement.element(By.css( ".list-group-item-text.workItemList_description" )); 
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
  
  workItemDeleteButton (parentElement) { 
    return parentElement.element(By.css( ".btn.btn-default.delete-button.workItemList_deleteListItemBtn" )); 
  }
  
  clickWorkItemDeleteButton (button) {
    browser.wait(until.presenceOf(button), constants.WAIT, 'Failed to find the button');
    return button.click(); 
  }
  
}

module.exports = WorkItemListPage;
