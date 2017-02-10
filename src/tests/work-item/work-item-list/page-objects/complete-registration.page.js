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
let until = protractor.ExpectedConditions;
let Fabric8MainPage = require('./fabric8-main.page');

class CompleteRegistrationPage {

  constructor() {
  };

  get fullName () {
     return element(by.id("fullName"));
  }

  clickFullName () {
     return this.fullName.click();
  }

  typeFullName (fullNameString) {
     return this.fullName.sendKeys(fullNameString);
  }

  get bio () {
     return element(by.id("bio"));
  }

  clickBio () {
     return this.bio.click();
  }

  typeBio (bioString) {
     return this.bio.sendKeys(bioString);
  }

  get userName () {
     return element(by.id("username"));
  }

  clickUserName () {
     return this.userName.click();
  }

  typeUserName (userNameString) {
     return this.userName.sendKeys(userNameString);
  }

  get urlField () {
     return element(by.id("url"));
  }

  clickUrlField () {
     return this.urlField.click();
  }

  typeUrlField (urlString) {
     return this.urlField.sendKeys(urlString);
  }

  get emailField () {
     return element(by.id("email"));
  }

  clickEmailField () {
     return this.emailField.click();
  }

  typeEmailField (emailString) {
     return this.emailField.sendKeys(emailString);
  }

  get confirmRegistrationButton () {
     return element(by.css(".btn.marginR10.pull-right.btn-primary"));
  }

  clickConfirmRegistrationButton () {
    this.confirmRegistrationButton.click();
    return new Fabric8MainPage();
  }

}

module.exports = CompleteRegistrationPage;
