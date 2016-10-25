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

var WorkItemListPage = function () {
  browser.get("http://localhost:8088/?token=justarandomtokenfortest");
};

var until = protractor.ExpectedConditions;

WorkItemListPage.prototype  = Object.create({}, {

/* Page elements - top of the page */

  workItemListButton:  {
    get: function ()
    { return element(by.id("header_menuWorkItemList")); }
  },

  clickWorkItemListButton:   {
    value: function ()
    { 
      browser.wait(until.presenceOf(this.workItemListButton), 30000, 'Failed to find workItemListButton');
      return this.workItemListButton.click(); }
  },

  boardButton:  {
    get: function ()
    { return element(by.id("header_menuBoard")); }
  },

  clickBoardButton:   {
    value: function ()
    {
      this.boardButton.click();
      return new WorkItemBoardPage();
    }
  },

  userToggle:  {
    get: function ()
    { return element(by.id("header_dropdownToggle")); }
  },

  clickUserToggle:   {
    value: function ()
    { return this.userToggle.click(); }
  },

/* Page elements - bottom of the page - work item quick add */

  workItemQuickAddTitle:  {
    get: function ()
    { return element(by.css(".workItemQuickAdd_storyInput input")); }
  },

  typeQuickAddWorkItemTitle:  {
     value: function (keys)
     { 
       browser.wait(until.presenceOf(this.workItemQuickAddTitle), 30000, 'Failed to find workItemQuickAddTitle');
       return this.workItemQuickAddTitle.sendKeys(keys); }
   },

  quickAddWorkItemTitleButton:  {
    get: function ()
    { return element(by.css('.pficon-add-circle-o.dib.font18')); }
  },

  clickQuickAddWorkItemTitleButton:  {
    value: function ()
    { 
      browser.wait(until.presenceOf(this.quickAddWorkItemTitleButton), 30000, 'Failed to find quickAddWorkItemTitleButton');
      return this.quickAddWorkItemTitleButton.click(); }
  },

  quickAddWorkItemTitleText:  {
    get: function ()
    { return element(by.id("exampleInput")); }  
  },

  typeQuickAddWorkItemTitleText:  {
    value: function (keys)
    { 
      browser.wait(until.presenceOf(this.quickAddWorkItemTitleText), 30000, 'Failed to find quickAddWorkItemTitleText');
      return this.quickAddWorkItemTitleText.sendKeys(keys); }
  },

  addVisibleopenButton:  {
    get: function ()
    { return element(by.css(".fr.font16.workItemQuickAdd_Add.icon-btn")); }
  },

  clickWorkItemQuickAddButton:   {
    value: function ()
    { 
      browser.wait(until.presenceOf(this.addVisibleopenButton), 30000, 'Failed to find addVisibleopenButton');
      return this.addVisibleopenButton.click(); }
  },

  /* Access the Kebab element relative to its parent workitem */
   clickWorkItemKebabButton:  {
    value: function (parentElement)
    { 
      browser.wait(until.presenceOf(parentElement.element(by.id("dropdownKebabRight"))), 30000, 'Failed to find clickWorkItemKebabButton');
      return parentElement.element(by.id("dropdownKebabRight")).click(); }
  },

 /* Access the Kebab element relative to its parent workitem */
   clickWorkItemKebabDeleteButton:   {
    value: function (parentElement)
    { 
      browser.wait(until.presenceOf(parentElement.element(by.css('.workItemList_Delete'))), 30000, 'Failed to find clickWorkItemKebabButton');
      return parentElement.element(by.css('.workItemList_Delete')).click(); }
  },
  
  workItemPopUpDeleteConfirmButton:   {
    get: function ()
    { return element(by.buttonText('Confirm')); }
  },

  clickWorkItemPopUpDeleteConfirmButton:   {
    value: function ()
    { 
      browser.wait(until.presenceOf(this.workItemPopUpDeleteConfirmButton), 30000, 'Failed to find workItemPopUpDeleteConfirmButton');
      return this.workItemPopUpDeleteConfirmButton.click(); }
  },

  workItemPopUpDeleteCancelConfirmButton:   {
    get: function ()
    { return element(by.buttonText('Cancel')); }
  },

  clickWorkItemPopUpDeleteCancelConfirmButton:   {
    value: function ()
    { 
      browser.wait(until.presenceOf(this.workItemPopUpDeleteCancelConfirmButton), 30000, 'Failed to find clickWorkItemPopUpDeleteCancelConfirmButton');
      return this.workItemPopUpDeleteCancelConfirmButton.click(); }
  },

  typeQuickAddWorkItemDescription:  {
    value: function (keys)
    { 
      browser.wait(until.presenceOf(this.workItemQuickAddDescription), 30000, 'Failed to find workItemQuickAddDescription');
      return this.workItemQuickAddDescription.sendKeys(keys); }
  },

  openButton:  {
    get: function ()
    { return element(by.css(".workItemQuickAdd_saveBtn")); }
  },

  clickWorkItemQuickAdd:   {
    value: function ()
    { 
      browser.wait(until.presenceOf(this.openButton), 30000, 'Failed to find the open button');
      return this.openButton.click(); }
  },

 saveButton:  {
    get: function ()
    { return element(by.css(".workItemQuickAdd_Add")); }
  },

  clickQuickAddSave:   {
    value: function ()
    { 
      browser.wait(until.presenceOf(this.saveButton), 30000, 'Failed to find the saveButton');
      return this.saveButton.click(); }
  },

  cancelButton:  {
    get: function ()
    { return element(by.id(".workItemQuickAdd_goBackBtn")); }
  },

  clickQuickAddCancel:   {
    value: function ()
    { 
      browser.wait(until.presenceOf(this.cancelButton), 30000, 'Failed to find the cancelButton');
      return this.cancelButton.click(); }
  },

/* Page elements - work item list */

  allWorkItems:  {
    get: function ()
    { return element.all(by.css(".work-item-list-entry")); }
  },

  firstWorkItem:  {
    get: function ()
    { return element.all(by.css(".work-item-list-entry")).first(); }
  },

  lastWorkItem:  {
    get: function ()
    { return element.all(by.css(".work-item-list-entry")).last(); }
  },

  /* Title element relative to a workitem */
   workItemTitle:  {
    value: function (workItemElement)
    { return workItemElement.element(by.css(".workItemList_title")).getText(); }
  },

  /* Description element relative to a workitem */
  workItemDescription:  {
    value: function (workItemElement)
    { return workItemElement.element(by.css(".workItemList_description")).getText(); }
  },

  workItemByIndex:  {
    value: function (itemNumber)
    { return element.all(by.css(".work-item-list-entry")).get(itemNumber); }
  },

  workItemByNumber:  {
    value: function (itemNumber)
    {
      var xPathString = "workItemList_OuterWrap_" + itemNumber;
      return element(by.id(xPathString));
    }
  },

  kebabByNumber:{
  value: function (itemNumber)
  {
    var XPathString = "workItemList_OuterWrap_" + itemNumber +"/div/div[2]/div";
    return element(by.id(XPathString));
  }
},

  /*
   * To access a work item's view/delete buttons and related fields - example code:
   *
    var parentElement = page.firstWorkItem;
    page.workItemViewButton(parentElement).getText().then(function (text) {
      console.log("text = " + text);
    });
    page.clickWorkItemViewButton(page.workItemViewButton(parentElement));
   *
   */

  workItemViewButton:  {
    value: function (parentElement)
    { return parentElement.element(By.css( ".btn.btn-default.workItemList_ViewItemDetailBtn" )); }
  },

  workItemViewId:  {
    value: function (parentElement)
    { return parentElement.element(By.css( ".list-view-pf-left.type.workItemList_workItemType" )); }
  },

  workItemViewTitle:  {
    value: function (parentElement)
    { return parentElement.element(By.css( ".list-group-item-heading.workItemList_title" )); }
  },

  workItemViewDescription:  {
    value: function (parentElement)
    { return parentElement.element(By.css( ".list-group-item-text.workItemList_description" )); }
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
      browser.wait(until.presenceOf(theDetailPage.workItemDetailPageTitle), 30000, 'Detail page title taking too long to appear in the DOM');
      browser.wait(waitForText(theDetailPage.workItemDetailTitle), 30000, "Title text is still not present");
      return theDetailPage;
    }
  },

  workItemDeleteButton:  {
    value: function (parentElement)
    { return parentElement.element(By.css( ".btn.btn-default.delete-button.workItemList_deleteListItemBtn" )); }
  },

  clickWorkItemDeleteButton:   {
    value: function (button)
    { 
      browser.wait(until.presenceOf(button), 30000, 'Failed to find the button');
      return button.click(); }
  },

});


/*
 * Work Item Detail Page Definition
 */

var WorkItemDetailPage = function (idValue) {
  browser.get("http://localhost:8088/detail/" + idValue + "?token=justarandomtokenfortest");
};

WorkItemDetailPage.prototype  = Object.create({}, {

  workItemDetailPageTitle:  {
    get: function ()
    { return element(by.xpath(".//*[@id='workItemDetail_Wrapper']/h1")); }
  },

  workItemDetailTitle:  {
    get: function ()
    { return element(by.id("wi-detail-title")); }
  },

  setWorkItemDetailTitle:  {
    value: function (newTitleString, append)
    {   if (!append) {this.workItemDetailTitle.clear(newTitleString)};
    return this.workItemDetailTitle.sendKeys(newTitleString); }
  },

  workItemDetailDescription:  {
    get: function ()
    { return element(by.id("wi-detail-desc")); }
  },

  setWorkItemDetailDescription:  {
    value: function (newDescriptionString, append)
    {   if (!append) {this.workItemDetailDescription.clear(newDescriptionString)};
    return this.workItemDetailDescription.sendKeys(newDescriptionString); }
  },

  workItemDetailType:  {
    get: function ()
    { return element(by.id("wi-detail-type")); }
  },

  setWorkItemDetailType:  {
    value: function (newTypeString, append)
    {   return this.workItemDetailType.sendKeys(newTypeString); }
  },

  workItemDetailCreator:  {
    get: function ()
    { return element(by.id("wi-detail-creator")); }
  },

  setWorkItemDetailCreator:  {
    value: function (newCreatorString, append)
    {   if (!append) {this.workItemDetailCreator.clear(newCreatorString)};
    return this.workItemDetailCreator.sendKeys(newCreatorString); }
  },

  workItemDetailAssignee:  {
    get: function ()
    { return element(by.id("wi-detail-assignee")); }
  },

  setWorkItemDetailAssignee:  {
    value: function (newAssigneeString, append)
    {   if (!append) {this.workItemDetailAssignee.clear(newAssigneeString)};
    return this.workItemDetailAssignee.sendKeys(newAssigneeString); }
  },

  workItemDetailState:  {
    get: function ()
    { return element(by.id("wi-detail-state")); }
  },

  setWorkItemDetailState:  {
    value: function (newStateString, append)
    {   return this.workItemDetailState.sendKeys(newStateString); }
  },

  workItemDetailSaveButton:  {
    get: function ()
    { return element(by.css(".btn.btn-primary")); }
  },

  clickWorkItemDetailSaveButton:   {
    value: function ()
    { 
      browser.wait(until.presenceOf(this.workItemDetailSaveButton), 30000, 'Failed to find the workItemDetailSaveButton');
      return this.workItemDetailSaveButton.click(); }
  },

  workItemDetailCancelButton:  {
    get: function ()
    { return element(by.css(".btn.btn-default")); }
  },

  clickWorkItemDetailCancelButton:   {
    value: function ()
    { 
      browser.wait(until.presenceOf(this.workItemDetailCancelButton), 30000, 'Failed to find the workItemDetailCancelButton');
      return this.workItemDetailCancelButton.click(); }
  }

});

/*
 * Work Item Board Page Definition
 */

var WorkItemBoardPage = function () {
  browser.get("http://localhost:8088/#/board");
};

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
      browser.wait(until.presenceOf(theDetailPage.workItemDetailPageTitle), 30000, 'Detail page title taking too long to appear in the DOM');
      browser.wait(waitForText(theDetailPage.workItemDetailTitle), 30000, "Title text is still not present");
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

module.exports = WorkItemListPage;
