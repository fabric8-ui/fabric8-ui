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

/* Icons displayed after the detailed dialog button is clicked */
let detailedWorkItemIcons = [];
detailedWorkItemIcons["userstory"] = ".xl-font.fa.fa-bookmark";
detailedWorkItemIcons["valueproposition"] = ".xl-font.fa.fa-gift";
detailedWorkItemIcons["fundamental"] = ".xl-font.fa.fa-bank";
detailedWorkItemIcons["experience"] = ".xl-font.fa.fa-map";
detailedWorkItemIcons["feature"] = ".xl-font.fa.fa-mouse-pointer";
detailedWorkItemIcons["bug"] = ".xl-font.fa.fa-bug ";

class WorkItemListPage {

 constructor(login) {
   if(login==true) {
     browser.get("http://localhost:8088/?token=justarandomtokenfortest");
     }
   else {
     browser.get("http://localhost:8088/");
   }
 };
 workItemByURLId (workItemId) {
   browser.get("http://localhost:8088/work-item/list/detail/"+ workItemId);
 }
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

  /* Icon element relative to a workitem */
  workItemIcon (workItemElement) {
    return workItemElement.element(by.css(".type.workItemList_workItemType")).getText();
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

  /* User assignment dropdown */
  get filterDropdown () {
    return  element(by.id("wi_filter_dropdown"));
  }

  clickFilterDropdown () {
    return this.filterDropdown.click();
  }

  /* Adding a new workitem through the dialog */
  get detailedDialogButton () {
    return  element(by.css(".add-detailed-wi"));
  }

  clickDetailedDialogButton () {
    return this.detailedDialogButton.click();
  }

  /* Adding a new user story workitem through the dialog */
  detailedIcon (workItemIcon) {
    /* Usage: detailedUserStoryIcon("userstory")  */
    return  element(by.css(detailedWorkItemIcons[workItemIcon]));
  }

  clickDetailedIcon (workItemIcon) {
    /* Usage: clickDetailedUserStoryIcon("userstory")  */
    this.detailedIcon(workItemIcon).click();
    var theDetailPage = new WorkItemDetailPage ();
    return theDetailPage;


  }
  userStoryIconWIT  (){
    return element(by.css('.xl-font.fa.fa-bookmark'));
  }
  clickUserStoryWItype  ()  {
    return this.userStoryIconWIT.click();
  }
  valuePropositonWItype  ()  {
   return element(by.css('.xl-font.fa.fa-gift'));
  }
  clickValuePropositonWItype  ()  {
    return this.valuePropositonWItype.click();
  }
  fundamentalWItype  ()  {
   return element(by.css('.xl-font.fa.fa-bank'));
  }
  clickFundamentalWItype  ()  {
    return this.fundamentalWItype.click();
  }
  plannerWItype(){
    return element(by.css('.xl-font.fa.fa-paint-brush'));
  }
  clickPalnnerWItype  ()  {
    return this.plannerWItype.click();
  }
  featureWItype() {
    return element(by.css('.xl-font.fa.fa-mouse-pointer'));
  }
  clickFeatureWItype  ()  {
    return this.featureWItype.click();
  }
  bugWItype(){
    return element(by.css('.xl-font.fa.fa-bug'));
  }
  clickBugWItype  ()  {
    return this.bugWItype.click();
  }
  experienceWIType(){
    return element(by.css('.xl-font.fa.fa-map'));
  }
  clickExperienceWItype  ()  {
    return this.experienceWIType.click();
  }



  /* Checkbox relative to a workitem */
  workItemCheckbox (workItemElement) {
    return workItemElement.element(by.css(".row-cbh>input")); 
  }

 /* Click checkbox relative to a workitem */
  clickWorkItemCheckbox (workItemElement) {
    return this.workItemCheckbox (workItemElement).click(); 
  }

 /* Is checkbox relative to a workitem selected? */
  isWorkItemCheckboxSelected (workItemElement) {
    return this.workItemCheckbox (workItemElement).isSelected(); 
  }

  /* Workitem move pulldown */
  get workItemMovePulldown () {
    return element(by.css(".dropdown.move-dropdown")); 
  }

  /* Workitem move pulldown */
  clickWorkItemMovePulldown () {
    return this.workItemMovePulldown.click();  
  }

  workItemMovePulldownTop (parentElement) {
    return parentElement.element(by.xpath(".//*//li[.//text()[contains(.,'Move to Top')]]")); 
  } 

  clickWorkItemMovePulldownTop (parentElement) {
    return this.workItemMovePulldownTop(parentElement).click(); 
  }

  workItemMovePulldownBottom (parentElement) {
    return parentElement.element(by.xpath(".//*//li[.//text()[contains(.,'Move to Bottom')]]")); 
  }

  clickWorkItemMovePulldownBottom (parentElement) {
    return this.workItemMovePulldownBottom(parentElement).click(); 
  }

  workItemMovePulldownUp (parentElement) {
    return parentElement.element(by.xpath(".//*//li[.//text()[contains(.,'Move Up')]]")); 
  }

  clickWorkItemMovePulldownUp (parentElement) {
    return this.workItemMovePulldownUp(parentElement).click(); 
  }

  workItemMovePulldownDown (parentElement) {
    return parentElement.element(by.xpath(".//*//li[.//text()[contains(.,'Move Down')]]")); 
  }

  clickWorkItemMovePulldownDown (parentElement) {
    return this.workItemMovePulldownDown(parentElement).click(); 
  }

  /* Workitem filter pulldown */
  workItemFilterPulldown () {
    return workItemElement.element(by.css(".dropdown.filter-dropdown")); 
  }



}

module.exports = WorkItemListPage;
