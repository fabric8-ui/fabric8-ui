/**
 * AlMighty page object example module for work item list page
 * See: http://martinfowler.com/bliki/PageObject.html,
 * https://www.thoughtworks.com/insights/blog/using-page-objects-overcome-protractors-shortcomings
 * @author naverma@redhat.com
 * TODO - Complete the page object model pending completion of UI at: http://demo.almighty.io/
 */

'use strict';

/*
 * Code Page Definition - placeholder
 */

let testSupport = require('../testSupport');
let CommonPage = require('./common.page');
let constants = require("../constants");
let until = protractor.ExpectedConditions;

class DashboardPage {

 constructor(login) {
 };
 welcomeWrapper () {
    return element(by.css("welcomeWrapper"));
  }
 recentChatsWrapper () {
    return element(by.css("recentChatsWrapper"));
  }
 recentProjectsWrapper () {
    return element(by.css("recentProjectsWrapper"));
  }
 newsUpdateWrapper () {
    return element(by.css("newsUpdateWrapper"));
  }
 resourceUsageWrapper () {
    return element(by.css("resourceUsageWrapper"));
  }

}


module.exports = DashboardPage;
