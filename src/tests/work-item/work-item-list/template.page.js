/**
 * AlMighty page object example module for work item list page
 * See: http://martinfowler.com/bliki/PageObject.html,
 * https://www.thoughtworks.com/insights/blog/using-page-objects-overcome-protractors-shortcomings
 * @author ldimaggi@redhat.com
 * TODO - Complete the page object model pending completion of UI at: http://demo.almighty.io/
 */

'use strict';

/*
 * Work Item List Page Definition - template
 */

var TemplatePage = function () {
};

var testSupport = require('./testSupport'),
  WorkItemDetailPage = require('./work-item-detail.page'),
  WorkItemBoardPage = require('./work-item-board.page'),
  CommonPage = require('./common.page'),
  constants = require("./constants");

var until = protractor.ExpectedConditions;

TemplatePage.prototype  = Object.create({}, {

/* Example UI elements from workitempage - Page elements - top of the page */

  workItemListButton:  {
    get: function ()
    { return element(by.id("header_menuWorkItemList")); }
  },

  clickWorkItemListButton:   {
    value: function ()
    {
      browser.wait(until.presenceOf(this.workItemListButton), constants.WAIT, 'Failed to find workItemListButton');
      return this.workItemListButton.click(); }
  }

});

module.exports = TemplatePage;
