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
//  browser.get("http://localhost:8088/detail/" + idValue + "?token=justarandomtokenfortest");
};

var until = protractor.ExpectedConditions;
var waitTime = 30000;

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
      browser.wait(until.presenceOf(this.workItemDetailSaveButton), waitTime, 'Failed to find the workItemDetailSaveButton');
      return this.workItemDetailSaveButton.click(); }
  },

  workItemDetailCancelButton:  {
    get: function ()
    { return element(by.css(".btn.btn-default")); }
  },

  clickWorkItemDetailCancelButton:   {
    value: function ()
    { 
      browser.wait(until.presenceOf(this.workItemDetailCancelButton), waitTime, 'Failed to find the workItemDetailCancelButton');
      return this.workItemDetailCancelButton.click(); }
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

module.exports = WorkItemDetailPage;
