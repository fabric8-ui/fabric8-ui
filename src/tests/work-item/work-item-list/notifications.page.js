/**
 * AlMighty page object example module for work item list page
 * See: http://martinfowler.com/bliki/PageObject.html,
 * https://www.thoughtworks.com/insights/blog/using-page-objects-overcome-protractors-shortcomings
 * @author ldimaggi@redhat.com
 * TODO - Complete the page object model pending completion of UI at: http://demo.almighty.io/
 */

'use strict';

/*
 * Chat Page Definition - placeholder
 */

let testSupport = require('./testSupport');
let CommonPage = require('./common.page');
let constants = require("./constants");
let until = protractor.ExpectedConditions;

class NotificationsPage {

 constructor(login) {
 };

}

module.exports = NotificationsPage;
