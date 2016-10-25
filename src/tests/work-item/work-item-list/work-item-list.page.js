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
  browser.get("http://localhost:8088/");
};

WorkItemListPage.prototype  = Object.create({}, {

/* Page elements - top of the page */

  workItemListButton:  {
    get: function ()
    { return element(by.id("header_menuWorkItemList")); }
  },

  clickWorkItemListButton:   {
    value: function ()
    { return this.workItemListButton.click(); }
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
     { return this.workItemQuickAddTitle.sendKeys(keys); }
   },
  clickQuickAddWorkItemTitleButton:  {
    value: function (keys)
    { return element(by.css('.pficon-add-circle-o.dib.font18')).click(); }
  },
  typeQuickAddWorkItemTitleText:  {
    value: function (keys)
    { return element(by.id("exampleInput")).sendKeys(keys); }
  },

  ClickAddVisibleopenButton:  {
    get: function ()
    { return element(by.css(".fr.font16.workItemQuickAdd_Add.icon-btn")); }
  },
  clickWorkItemQuickAddButton:   {
    value: function ()
    { return this.ClickAddVisibleopenButton.click(); }
  },

  clickWorkItemKebabButton:   {
    value: function ()
    { return element(by.id("dropdownKebabRight")).click(); }
  },

  clickWorkItemKebabDeleteButton:   {
    value: function ()
    { return element(by.css('.workItemList_Delete')).click(); }
  },
  clickWorkItemPopUpDeleteConfirmButton:   {
    value: function ()
    { return element(by.css('.btn.btn-primary.alm-dialog-btn.float-left')).click(); }
  },
  clickWorkItemPopUpDeleteCancelConfirmButton:   {
    value: function ()
    { return element(by.buttonText('Cancel')).click(); }
  },

  /*workItemQuickAddDescription:  {
    get: function ()
    { return element(by.css("#workItemQuickAdd_desc input")); }
  },*/

  typeQuickAddWorkItemDescription:  {
    value: function (keys)
    { return this.workItemQuickAddDescription.sendKeys(keys); }
  },

  openButton:  {
    get: function ()
    { return element(by.css(".workItemQuickAdd_saveBtn")); }
  },

  clickWorkItemQuickAdd:   {
    value: function ()
    { return this.openButton.click(); }
  },

 saveButton:  {
    get: function ()
    { return element(by.css(".workItemQuickAdd_Add")); }
  },

  clickQuickAddSave:   {
    value: function ()
    { return this.saveButton.click(); }
  },

  cancelButton:  {
    get: function ()
    { return element(by.id(".workItemQuickAdd_goBackBtn")); }
  },

  clickQuickAddCancel:   {
    value: function ()
    { return this.cancelButton.click(); }
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
    { return button.click(); }
  },

  /*
   * In order to locate a workitem by its ID in the UI, it is necessary to search
   * for the ID after extracting the workitems out of the UI - and then access the
   * correct workitem as displayed in the UI through the unique ID.
   */
  findWorkItemByIdDesktop:   {
    value: function (page, targetWorkItemIndex)
    {
      var returnWorkItem;
      /* Retrieve the text of all the workitems from the Desktop UI */
      page.allWorkItems.getText().then(function (text) {

      /* Add a space so that the text can be accessed as a string */
      var str = text + ' ';

      /* Split the string into an array */
      var res = str.split('new\n');

      /* And then convert that string array into an array of workitem objects, discard the
      * first object as it only contains column titles */
      var workitems = [];
      for (var i = 1; i < res.length; i++) {

        /* Remove the new line chars from the workitem text
         * [ 'new', '13', 'Some Title 13', 'Some Description 13,' ] */
        var temp = res[i].split('\n');

        /* And create the workitem objects */
        workitems[i-1] = {
          workItemIndex:temp[1],
          workItemTitle:temp[2],
          workItemDescription:temp[3],
          workItemState:temp[0]
        };
      }

      /* Finally - find and return the workitem object that contains the intended index */
      var returnWorkItem;
        for (var i = 0; i < workitems.length; i++) {
          if (workitems[i].workItemIndex == targetWorkItemIndex){
            returnWorkItem = page.workItemByIndex(i);
            break;
          }
        }
      });
      return returnWorkItem;
    }
  },

  /*
   * In order to locate a workitem by its ID in the UI, it is necessary to search
   * for the ID after extracting the workitems out of the UI - and then access the
   * correct workitem as displayed in the UI through the unique ID.
   */
  findWorkItemByIdPhone:   {
    value: function (page, targetWorkItemIndex)
    {
      var returnWorkItem;
      /* Retrieve the text of all the workitems from the Desktop UI */
      page.allWorkItems.getText().then(function (text) {

        /* Add a space so that the text can be accessed as a string */
        var str = text + ' ';

        /* Split the string into an array */
        var res = str.split(',');
        for (var i = 0; i < res.length; i++) {
          var tmp = res[i].replace("\n", ",");
        }

        /* And then convert that string array into an array of workitem objects */
        var workitems = [];
        for (var i = 0; i < res.length; i++) {

          /* Remove the new line chars from the workitem text
           * [ '13', 'Some Title 13' ] */
          var temp = res[i].split('\n');

          /* And create the workitem objects */
          workitems[i] = {
            workItemTitle:temp[1],
            workItemIndex:temp[0]
            };
        }

        /* Finally - find and return the workitem object that contains the intended index */
        var returnWorkItem;
        for (var i = 0; i < workitems.length; i++) {
          if (workitems[i].workItemIndex == targetWorkItemIndex){
            returnWorkItem = page.workItemByIndex(i);
            break;
          }
        }
      });
      return returnWorkItem;
    }
  }

});


/*
 * Work Item Detail Page Definition
 */

var WorkItemDetailPage = function (idValue) {
  browser.get("http://localhost:8088/#/detail/" + idValue);
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
    { return this.workItemDetailSaveButton.click(); }
  },

  workItemDetailCancelButton:  {
    get: function ()
    { return element(by.css(".btn.btn-default")); }
  },

  clickWorkItemDetailCancelButton:   {
    value: function ()
    { return this.workItemDetailCancelButton.click(); }
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
