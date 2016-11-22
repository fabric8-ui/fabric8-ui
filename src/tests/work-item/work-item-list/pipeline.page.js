/**
 * AlMighty page object example module for work item list page
 * See: http://martinfowler.com/bliki/PageObject.html,
 * https://www.thoughtworks.com/insights/blog/using-page-objects-overcome-protractors-shortcomings
 * @author ldimaggi@redhat.com
 * TODO - Complete the page object model pending completion of UI at: http://demo.almighty.io/
 */

'use strict';

/*
 * Pipeline Page Definition - placeholder
 */

var PipelinePage = function () {
};

var testSupport = require('./testSupport'),
  commonPage = require('./common.page'),
  constants = require("./constants");

var until = protractor.ExpectedConditions;

PipelinePage.prototype  = Object.create({}, {

});

module.exports = PipelinePage;
