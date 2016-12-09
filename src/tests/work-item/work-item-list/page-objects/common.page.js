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

let testSupport = require('../testSupport');
let constants = require("../constants");
let HomePage = require('./home.page');
let CodePage = require('./code.page');
let TestPage = require('./test.page');
let PipelinePage = require('./pipeline.page');
let HypothesisPage = require('./hypothesis.page');
let SettingsPage = require('./settings.page');
let ChatPage = require('./chat.page');
let NotificationsPage = require('./notifications.page');
let MicroservicesPage = require('./microservices.page');
let WorkItemListPage = require('./work-item-list.page');
let until = protractor.ExpectedConditions;
let waitTime = 30000;

class CommonPage {

 constructor() {
 };

/* Page elements - top of the page */

/* Home page */
  get homeMenuTab () {
    return element(by.id("header_menuHome"));
  }

  clickHomeMenuTab () {
    browser.wait(until.presenceOf(this.homeMenuTab), waitTime, 'Failed to find homeMenuTab');
    this.homeMenuTab.click(); 
    return new HomePage();
  }

/* Work (workitems) page */
  get workMenuTab () {
    return element(by.id("header_menuWork")); 
  }

  clickWorkMenuTab () {
    browser.wait(until.presenceOf(this.workMenuTab), waitTime, 'Failed to find workMenuTab');
    this.workMenuTab.click(); 
    return new WorkItemListPage();
  }

/* Code page */
  get codeMenuTab () {
    return element(by.id("header_menuCode"));
  }

  clickCodeMenuTab () {
    browser.wait(until.presenceOf(this.codeMenuTab), waitTime, 'Failed to find codeMenuTab');
    this.codeMenuTab.click(); 
    return new CodePage();
  }

/* Test page */
  get testMenuTab () {
    return element(by.id("header_menuTest")); 
  }

  clickTestMenuTab () {
    browser.wait(until.presenceOf(this.testMenuTab), waitTime, 'Failed to find testMenuTab');
    this.testMenuTab.click(); 
    return new TestPage();
  }

/* Pipeline page */
  get pipelineMenuTab () {
    return element(by.id("header_menuPipeline"));
  }

  clickPipelineMenuTab () {
    browser.wait(until.presenceOf(this.pipelineMenuTab), waitTime, 'Failed to find pipelineMenuTab');
    this.pipelineMenuTab.click(); 
    return new PipelinePage();
  }

/* Hypothesis page */
  get hypothesisMenuTab () {
    return element(by.id("header_menuHypothesis"));
  }

  clickHypothesisMenuTab () {
    browser.wait(until.presenceOf(this.hypothesisMenuTab), waitTime, 'Failed to find hypothesisMenuTab');
    this.hypothesisMenuTab.click(); 
    return new HypothesisPage();
  }

/* Settings page */
  get settingsMenuTab () {
    return element(by.id("header_menuSettings"));
  }

  clickSettingsMenuTab () {
    browser.wait(until.presenceOf(this.settingsMenuTab), waitTime, 'Failed to find settingsMenuTab');
    this.settingsMenuTab.click(); 
    return new SettingsPage();
  }

/* Chat page */
  get chatMenuTab () {
    return element(by.id("header_menuChat"));
  }

  clickChatMenuTab () {
    browser.wait(until.presenceOf(this.chatMenuTab), waitTime, 'Failed to find chatMenuTab');
    this.chatMenuTab.click(); 
    return new ChatPage();
  }

/* Notifications page */
  get notificationsMenuTab () {
    return element(by.id("header_menuNotifications"));
  }

  clickNotificationsMenuTab () {
    browser.wait(until.presenceOf(this.notificationsMenuTab), waitTime, 'Failed to find notificationsMenuTab');
    this.notificationsMenuTab.click(); 
    return new NotificationsPage();
  }

/* Microservices page */
  get microservicesMenuTab () {
    return element(by.id("header_menuWizard"));
  }

  clickMicroServicesMenuTab () {
    browser.wait(until.presenceOf(this.microservicesMenuTab), waitTime, 'Failed to find microservicesMenuTab');
    this.microservicesMenuTab.click(); 
    return new MicroservicesPage();
  }

}

module.exports = CommonPage;
