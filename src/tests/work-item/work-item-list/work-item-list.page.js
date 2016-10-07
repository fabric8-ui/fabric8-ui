/*
* AlMighty page object example module for work item list page
* See: http://martinfowler.com/bliki/PageObject.html
* @author ldimaggi@redhat.com
* TODO - Complete the page object mdel pending completion of UI at: http://demo.almighty.io/
*/

'use strict';

var WorkItemListPage = function () {
  browser.get("http://localhost:8088/");
};

WorkItemListPage.prototype  = Object.create({}, {

  workItemListButton:  {   
		get: function ()     
			{ return element(by.id("header_menuWorkItemList")); }
	},

  boardButton:  {   
		get: function ()     
			{ return element(by.id("header_menuBoard")); }
	},

  workItemTitle:  {   
		value: function (workItemElement)
			{ return workItemElement.element(by.css(".workItemList_title")).getText(); }
	},

  workItemDescription:  {   
		value: function (workItemElement)     
			{ return workItemElement.element(by.css(".workItemList_description")).getText(); }
	},

  workItemQuickAddTitle:  {   
		get: function ()     
			{ return element(by.css("#workItemQuickAdd_title input")); }
	},

  workItemQuickAddDescription:  {   
		get: function ()     
			{ return element(by.css("#workItemQuickAdd_desc input")); }
	},

  saveButton:  {   
		get: function ()     
			{ return element(by.id("workItemQuickAdd_saveBtn")); }
	},

  cancelButton:  {   
		get: function ()     
			{ return element(by.id("workItemQuickAdd_goBackBtn")); }
	},

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

  workItemByNumber:  {   
		value: function (itemNumber)     
			{ 
				var xPathString = "workItemList_OuterWrap_" + itemNumber;		
				return element(by.id(xPathString)); 
		}
	},

  typeQuickAddWorkItemTitle:  { 
		value: function (keys) 
			{ return this.workItemQuickAddTitle.sendKeys(keys); }
	},

  typeQuickAddWorkItemDescription:  { 
		value: function (keys) 
			{ return this.workItemQuickAddDescription.sendKeys(keys); }
	},

  clickQuickAddSave:   {
		value: function () 
			{ return this.saveButton.click(); }
	},

  clickQuickAddCancel:   {
		value: function () 
			{ return this.cancelButton.click(); }
	},

  clickWorkItemListButton:   {
		value: function () 
			{ return this.workItemListButton.click(); }
	},

  clickBoardButton:   {
		value: function () 
			{ return this.boardButton.click(); }
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

module.exports = WorkItemListPage;


