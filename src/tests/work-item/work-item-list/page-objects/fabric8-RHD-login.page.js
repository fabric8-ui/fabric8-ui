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
let GithubLoginPage = require("./github-login.page");
let until = protractor.ExpectedConditions;

class Fabric8RHDLoginPage {

  constructor() {
  };

  get githubLoginButton () {
     return element(by.id("social-github"));
  }

  clickGithubLoginButton () {
//    browser.wait(until.presenceOf(this.githubLoginButton), constants.WAIT, 'Failed to find github login');
    this.githubLoginButton.click();
    return new GithubLoginPage();
  }

}

module.exports = Fabric8RHDLoginPage;
