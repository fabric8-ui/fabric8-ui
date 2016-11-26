/**
 * AlMighty page object example module for work item list page
 * See: http://martinfowler.com/bliki/PageObject.html,
 * https://www.thoughtworks.com/insights/blog/using-page-objects-overcome-protractors-shortcomings
 * @author ldimaggi@redhat.com
 * TODO - Complete the page object model pending completion of UI at: http://demo.almighty.io/
 */

'use strict';

/*
 * Work Item Detail Page Definition
 */

var WorkItemDetailPage = function (idValue) {
};

var testSupport = require('./testSupport'),
  constants = require("./constants");

var until = protractor.ExpectedConditions;

WorkItemDetailPage.prototype  = Object.create({}, {

//  workItemDetailPageTitle:  {
//    get: function ()
//    { return element(by.xpath(".//*[@id='workItemDetail_Wrapper']/h1")); }
//  },

/* Note - The order of UI element defintions in this page object are top-->bottom, left->right */

  workItemDetailId:  {
    get: function ()
    { return element(by.id("wi-detail-id")); }
  },

  workItemDetailCloseButton:  {
    get: function ()
    { return element(by.css(".pficon-close.detail-close")); }
  },

  clickWorkItemDetailCloseButton:   {
    value: function ()
    {
      return this.workItemDetailCloseButton.click(); }
  },

  workItemDetailType:  {
    get: function ()
    { return element(by.id("wi-detail-type")); }
  },

  setWorkItemDetailType:  {
    value: function (newTypeString, append)
    {   return this.workItemDetailType.sendKeys(newTypeString); }
  },

  clickWorkItemDetailTitle:  {
    get: function ()
    { return element(by.id("wi-detail-title-click")); }
  },

  clickWorkItemDetailTitleClick:  {
    value: function ()
    { return this.clickWorkItemDetailTitle.click(); }
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

  /* Icon edit buttons */
  workItemTitleClick: {
    value: function(){
      this.editHover().click();
    }
  },

  workItemTitleDiv:  {    
    get: function ()    
    { 
      return element(by.id("title-click-div")); }
  },

  clickWorkItemTitleDiv:   {
    value: function ()
    { 
      return this.workItemTitleDiv.click(); }
  },
clickWorkItemTitleById:   {
  value:  function()
  {
    return element(by.id("wi-detail-title-ne")); 
  }
},
  workItemTitleEditIcon:  {    
    get: function ()    
    { 
      return element(by.id("workItemTitle_btn_edit")); }
  },
  workItemTitleEditIconById:  {    
    value: function ()    
    { 
      return element(by.id("workItemTitle_btn_edit")); }
  },
  clickWorkItemTitleEditIcon:   {
    value: function ()
    {
      return this.workItemTitleEditIcon.click(); }
  },

  workItemTitleSaveIcon:  {
    get: function ()
    { return element(by.id("workItemTitle_btn_save")); }
  },
  workItemTitleSaveIconById:  {
    value: function ()
    { return element(by.id("workItemTitle_btn_save")); }
  },

  clickWorkItemTitleSaveIcon:   {
    value: function ()
    {
      return this.workItemTitleSaveIcon.click(); }
  },

  workItemTitleCancelIcon:  {
    get: function ()
    { return element(by.id("workItemTitle_btn_cancel")); }
  },

  clickWorkItemTitleCancelIcon:   {
    value: function ()
    {
      return this.workItemTitleCancelIcon.click(); }
  },

  workItemDetailState:  {
    get: function ()
    { return element(by.id("wi-detail-state")); }
  },

  setWorkItemDetailState:  {
    value: function (newStateString)
    {   return this.workItemDetailState.sendKeys(newStateString); }
  },
  workItemDetailAvatar:  {
    get: function ()
    { return element(by.css(".pull-left.detail-assignee-avatar")); }
  },

  workItemDetailDescription:  {
    get: function ()
    { return element(by.id("wi-detail-desc")); }
  },
  workItemDetailDescriptionById:  {
    value: function ()
    { return element(by.id("wi-detail-desc")); }
  },
  clickWorkItemDetailDescription:  {
    value: function ()
    { return this.workItemDetailDescription.click(); }
  },

  setWorkItemDetailDescription:  {
    value: function (newDescriptionString, append)
    {   if (!append) {this.workItemDetailDescription.clear(newDescriptionString)};
    return this.workItemDetailDescription.sendKeys(newDescriptionString); }
  },

  workItemDescriptionEditIcon:  {
    get: function ()
    { return element(by.id("workItemDesc_btn_edit")); }
  },

  clickWorkItemDescriptionEditIcon:   {
    value: function ()
    {
      return this.workItemDescriptionEditIcon.click(); }
  },

  workItemDescriptionSaveIcon:  {
    get: function ()
    { return element(by.id("workItemdesc_btn_save")); }
  },
  workItemDescriptionSaveIconById:  {
    value: function ()
    { return element(by.id("workItemdesc_btn_save")); }
  },
  clickWorkItemDescriptionSaveIcon:   {
    value: function ()
    {
      return this.workItemDescriptionSaveIcon.click(); }
  },

  workItemDescriptionCancelIcon:  {
    get: function ()
    { return element(by.id("workItemdesc_btn_cancel")); }
  },

  clickWorkItemDescriptionCancelIcon:   {
    value: function ()
    {
      return this.workItemDescriptionCancelIcon.click(); }
  },
  titleValidation:   {
    value: function ()
    { 
      return element(by.css(".clearfloat.alert.alert-danger")); }
  },
  titleAlert:   {
    value: function ()
    { 
      return element(by.xpath(".//[@id='wi-title-div'][.//[contains(@class, 'alert-danger')]]")); }
  },
  titleAlertValidation:   {
    value: function ()
    { 
      return element(by.xpath(".//*[@id='wi-title-div']//p[.//text()[contains(.,'Title is required')]]")); }
  },
  /*
    UI elements for workitem types detail page
  */
  WorkItemTypeDropDownList:  {
    value: function ()
    { return element.all(by.css(".dropdown-menu.mobMarginL20 li a ")); }
  },
  clickWorkItemTypeDropDownList:   {
    value: function (number)
    {
       return element.all(by.css(".dropdown-text")).get(number); }
  },
  WorkItemTypeDropDownListCount:   {
    value: function ()
    {
      return element.all(by.css(".dropdown-menu.mobMarginL20 li a")).count(); }
  },
  clickWorkItemButton:   {
    value: function ()
    { return element(by.css(".wi-type-icon")).click();}
      //return element(by.xpath('.//*[@id="workItemList_OuterWrap_0"]/div/div[2]/div/ul/li[2]/a')).click(); }
  },
clickworkItemDetailTypeIcon: {
value: function ()
{ return element(by.css(".pull-left.dropdown-kebab-pf.detail-type-dropdown")).click(); }
},
  userstroyIcon:   {
    value: function ()
    {
    return element(by.xpath('//*[@id="workItemList_OuterWrap_0"]/div/div[1]/div[1]/span[2]'));}
   },
  valuepropositionIcon:   {
    value: function ()
    {
      return element(by.css(".color-grey.fa.fa-gift")); }
  },
  fundamentalIcon:   {
    value: function ()
    {
      return element(by.css(".color-grey.fa.fa-bank")); }
  },
  experienceIcon:   {
    value: function ()
    {
      return element(by.css(".color-grey.fa.fa-map")); }
  },
  feautureIcon:   {
    value: function ()
    {
      return element(by.css(".color-grey.fa.fa-mouse-pointer")); }
  },
  bugIcon:   {
    value: function ()
    {
      return element(by.css(".color-grey.fa.fa-bug")); }
  },
  detailUserstroyIcon2:   {
    value: function (classString)
    {
      return element(by.xpath("//*[@id='wi-detail-form'][.//*[contains(@class, '" + classString + "')]]")); }
  },
  workItemTypeDropDownListString:  {
  value: function (typeString)
  {
    return element(by.xpath("//*[@id='wi-detail-form']//li[.//text()[contains(.,'" + typeString + "')]]"));
  }
},
/*UI elements for State WorkItems*/
  checkWorkItemStateDropDownList:  {
  value: function (typeString)
  {
    return element(by.xpath('.//*[@id="wi-detail-form"]/fieldset/div[2]/div[2]/div/ul/li['+typeString+']/a/span[2]')).getText();
  }
},
  clickWorkItemStateDropDownButton:   {
    value: function ()
    {
      return element(by.id("wi-detail-state")).click(); }
  },
  WorkItemStateDropDownListCount:  {
    value: function ()
    { return element.all(by.css(".dropdown-menu.dropdown-menu-right.dropdown-ul li a")).count(); }
  },
  WorkItemStateDropDownList:  {
    value: function (item)

    {  return element.all(by.css(".dropdown-menu.dropdown-menu-right.dropdown-ul li a")); }
  },
  newStateIcon:   {
  value: function ()
  {
    return element(by.css(".color-grey.fa.fa-arrow-down")); }
  },
  openStateIcon:   {
  value: function ()
  {
    return element(by.css(".color-grey.fa.fa-fire")); }
  },
  inprogressStateIcon:   {
  value: function ()
  {
    return element(by.css(".color-grey.pficon.pficon-resources-almost-full")); }
  },
  resolvedStateIcon:   {
  value: function ()
  {
    return element(by.css(".color-grey.pficon.pficon-resources-full")); }
  },
  closedStateIcon:   {
  value: function ()
  {
    return element(by.css(".color-grey.fa.fa-remove")); }
  },
  genericCssIcon:   {
    value: function (classString)
    {
      return element(by.xpath("//*[@id='workItemList_OuterWrap_0'][.//*[contains(@class, '" + classString + "')]]")); }
  },
/* The following UI elements were removed from the WorkItem Detail page on November 7, 2016. We
   are not deleting these elements from the page object in the event that they are restored
   to the page in the future */

/*
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
*/

  /* The following UI elements support the assignment of a user to a work item */

  /* Icon for the user assigned to the workitem */
  workItemDetailAssigneeIcon:  {
    get: function ()
    { return element(by.css(".user-assign-icon")); }
  },

  clickworkItemDetailAssigneeIcon:   {
    value: function ()
    { return this.workItemDetailAssigneeIcon.click(); }
  },

  /* The user assigned to the workitem */
  workItemDetailAssignee:  {
    get: function ()
    { return element(by.xpath(".//*[contains(@class,'detail-assignee-name')]")); }
  },

  clickWorkItemDetailAssignee:  {
    get: function ()
    { return this.workItemDetailAssignee.click(); }
  },

  /* Search string box for the user to assign to the workitem */
  workItemDetailAssigneeSearch:  {
    get: function ()
    { return element(by.css(".list-container>input")); }
  },

  setWorkItemDetailAssigneeSearch: {
    value: function (newSearchString, append)
    {   
      if (!append) { this.workItemDetailAssigneeSearch.clear(newSearchString) };
      return this.workItemDetailAssigneeSearch.sendKeys(newSearchString); }
  },

  /* The list of users to whom work items can be assigned */
  workItemDetailAssigneeList:  {
    get: function ()
    { return element(by.css(".user-list")); }
  },

  clickworkItemDetailAssigneeList:  {
    get: function ()
    { return this.workItemDetailAssigneeList.click(); }
  },

  /* The first username in the list of users */
  workItemDetailFirstUser:  {
    get: function ()
    { return element(by.css(".item-li.first-item")); }
  },

  clickworkItemDetailFirstUser:  {
    get: function ()
    { return this.workItemDetailFirstUser.click(); }
  },

  /* Select the assigned user by name */
  assignedUserDropDownList:  {
    value: function (userName)
    {
      return element(by.xpath(".//*[@id='wi-detail-form']//li[.//text()[contains(.,'" + userName + "')]]"));
    }
  },

  clickAssignedUserDropDownList:  {
    value: function (userName)
    {
      return this.assignedUserDropDownList(userName).click();
    }
  },

  /* The Unassign button */
  workItemDetailUnassignButton:  {
    get: function ()
    { return element(by.xpath(".//*[contains(@class,'action-item') and contains(text(),'Unassign')]")); }
  },

  clickworkItemDetailUnassignButton:   {
    value: function ()
    { return this.workItemDetailUnassignButton.click(); }
  },

  /* The Cancel button */
  workItemDetailCancelButton:  {
    get: function ()
    { return element(by.xpath(".//*[contains(@class,'action-item') and contains(text(),'Cancel')]")); }
  },

  clickworkItemDetailCancelButton:   {
    value: function ()
    { return this.workItemDetailCancelButton.click(); }
  }

});

module.exports = WorkItemDetailPage;
