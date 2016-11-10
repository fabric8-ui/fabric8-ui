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

var until = protractor.ExpectedConditions;
var waitTime = 30000;

WorkItemDetailPage.prototype  = Object.create({}, {

//  workItemDetailPageTitle:  {
//    get: function ()
//    { return element(by.xpath(".//*[@id='workItemDetail_Wrapper']/h1")); }
//  },

/* Note - The order of UI element defintions in this page object are top-->bottom, left->right */

  workItemDetailTypeIcon:  {
    get: function ()
    { return element(by.css(".wi-type-icon")); }
  },

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
  workItemTitleEditIcon:  {
    get: function ()
    { return element(by.id("workItemTitle_btn_edit")); }
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

  workItemDetailAssignee:  {
    get: function ()
    { return element(by.css(".pull-left.margin0.paddingT5")); }
  },

  workItemDetailAvatar:  {
    get: function ()
    { return element(by.css(".pull-left.detail-assignee-avatar")); }
  },

  workItemDetailDescription:  {
    get: function ()
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

module.exports = WorkItemDetailPage;
