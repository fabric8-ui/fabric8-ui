/**
 * AlMighty page object example module for work item list page
 * See: http://martinfowler.com/bliki/PageObject.html,
 * https://www.thoughtworks.com/insights/blog/using-page-objects-overcome-protractors-shortcomings
 * @author ldimaggi@redhat.com
 * TODO - Complete the page object model pending completion of UI at: http://demo.almighty.io/
 */

'use strict';

/*
 * Common Page Definition - Elements common to all pages
 */

var CommonPage = function () {
};

var testSupport = require('./testSupport'),
  HomePage = require('./home.page'),
  CodePage = require('./code.page'),
  TestPage = require('./test.page'),
  PipelinePage = require('./pipeline.page'),
  HypothesisPage = require('./hypothesis.page'),
  SettingsPage = require('./settings.page'),
  ChatPage = require('./chat.page'),
  NotificationsPage = require('./notifications.page'),
  WorkItemListPage = require('./work-item-list.page');

var until = protractor.ExpectedConditions;
var waitTime = 30000;

CommonPage.prototype  = Object.create({}, {

/* Page elements - top of the page */

/* Home page */
  homeMenuTab:  {
    get: function ()
    { return element(by.id("header_menuHome")); }
  },

  clickHomeMenuTab:   {
    value: function ()
    {
      browser.wait(until.presenceOf(this.homeMenuTab), waitTime, 'Failed to find homeMenuTab');
      this.homeMenuTab.click(); 
      return new HomePage(); }
  },

/* Work (workitems) page */
  workMenuTab:  {
    get: function ()
    { return element(by.id("header_menuWork")); }
  },

  clickWorkMenuTab:   {
    value: function ()
    {
      browser.wait(until.presenceOf(this.workMenuTab), waitTime, 'Failed to find workMenuTab');
      this.workMenuTab.click(); 
      return new WorkItemListPage(); }
  },

/* Code page */
  codeMenuTab:  {
    get: function ()
    { return element(by.id("header_menuCode")); }
  },

  clickCodeMenuTab:   {
    value: function ()
    {
      browser.wait(until.presenceOf(this.codeMenuTab), waitTime, 'Failed to find codeMenuTab');
      this.codeMenuTab.click(); 
      return new CodePage(); }
  },

/* Test page */
  testMenuTab:  {
    get: function ()
    { return element(by.id("header_menuTest")); }
  },

  clickTestMenuTab:   {
    value: function ()
    {
      browser.wait(until.presenceOf(this.testMenuTab), waitTime, 'Failed to find testMenuTab');
      this.testMenuTab.click(); 
      return new TestPage(); }
  },

/* Pipeline page */
  pipelineMenuTab:  {
    get: function ()
    { return element(by.id("header_menuPipeline")); }
  },

  clickPipelineMenuTab:   {
    value: function ()
    {
      browser.wait(until.presenceOf(this.pipelineMenuTab), waitTime, 'Failed to find pipelineMenuTab');
      this.pipelineMenuTab.click(); 
      return new PipelinePage(); }
  },

/* Hypothesis page */
  hypothesisMenuTab:  {
    get: function ()
    { return element(by.id("header_menuHypothesis")); }
  },

  clickHypothesisMenuTab:   {
    value: function ()
    {
      browser.wait(until.presenceOf(this.hypothesisMenuTab), waitTime, 'Failed to find hypothesisMenuTab');
      this.hypothesisMenuTab.click(); 
      return new HypothesisPage(); }
  },

/* Settings page */
  settingsMenuTab:  {
    get: function ()
    { return element(by.id("header_menuSettings")); }
  },

  clickSettingsMenuTab:   {
    value: function ()
    {
      browser.wait(until.presenceOf(this.settingsMenuTab), waitTime, 'Failed to find settingsMenuTab');
      this.settingsMenuTab.click(); 
      return new SettingsPage(); }
  },

/* Chat page */
  chatMenuTab:  {
    get: function ()
    { return element(by.id("header_menuChat")); }
  },

  clickChatMenuTab:   {
    value: function ()
    {
      browser.wait(until.presenceOf(this.chatMenuTab), waitTime, 'Failed to find chatMenuTab');
      this.chatMenuTab.click(); 
      return new ChatPage(); }
  },

/* Notifications page */
  notificationsMenuTab:  {
    get: function ()
    { return element(by.id("header_menuNotifications")); }
  },

  clickNotificationsMenuTab:   {
    value: function ()
    {
      browser.wait(until.presenceOf(this.notificationsMenuTab), waitTime, 'Failed to find notificationsMenuTab');
      this.notificationsMenuTab.click(); 
      return new NotificationsPage(); }
  }


});

module.exports = CommonPage;
