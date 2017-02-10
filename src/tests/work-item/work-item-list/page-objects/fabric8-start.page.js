/**
 * AlMighty page object example module for Fabric8 start page
 * See: http://martinfowler.com/bliki/PageObject.html,
 * https://www.thoughtworks.com/insights/blog/using-page-objects-overcome-protractors-shortcomings
 * @author ldimaggi@redhat.com
 */

'use strict';

/*
 * Fabric8 Start Page Definition
 */

let testSupport = require('../testSupport');
let constants = require("../constants");
let Fabric8RHDLoginPage = require("./fabric8-RHD-login.page");
let until = protractor.ExpectedConditions;

class Fabric8StartPage {

  constructor(login) {
    browser.get("http://prod-preview.openshift.io/public");
  };

  get githubLoginButton () {
     return element(by.css(".fa.fa-github"));
  }

  clickGithubLoginButton () {
    browser.wait(until.presenceOf(this.githubLoginButton), constants.WAIT, 'Failed to find github login');
    this.githubLoginButton.click();
    return new Fabric8RHDLoginPage();
  }

}

module.exports = Fabric8StartPage;
