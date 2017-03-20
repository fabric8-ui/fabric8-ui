/**
 * AlMighty page object example module for Fabric8 start page
 * See: http://martinfowler.com/bliki/PageObject.html,
 * https://www.thoughtworks.com/insights/blog/using-page-objects-overcome-protractors-shortcomings
 * @author ldimaggi@redhat.com
 */

'use strict';

/*
 * openshidt.io Start Page Object Model Definition
 */

let testSupport = require('../testSupport');
let constants = require("../constants");
let until = protractor.ExpectedConditions;

class OpenShiftIoStartPage {

  constructor() {
    browser.get("http://prod-preview.openshift.io/");
  };

  /* Navigation panel UI objects */

  /* The navigation bar  */
  get navBar () {
     return element(by.css(".navbar-header"));
  }
  clickNavBar () {
     return this.navBar.click();
  }

  /* OpenShift.io image */
  get openShiftIoImage () {
     return element(by.css(".navbar-brand>img"));
  }
  clickOpenShiftIoImage () {
     return this.openShiftIoImage.click();
  }

  /* The navigation bar  */
  get navBar () {
     return element(by.css(".navbar-header"));
  }
  clickNavBar () {
     return this.navBar.click();
  }

  /* Sign in button in nav bar */
  get signIn () {
     return element(by.css("#login"));
  }
  clickSignIn () {
     return this.signIn.click();
  }

  /* UI Element for new users to register */

  /* Email address */
  get email () {
     return element(by.css("#email"));
  }
  clickEmail () {
     return this.email.click();
  }
  setEmail (emailString) {
    return this.email.sendKeys(emailString);
  }

  /* Access code (voucher code) */
  get voucherCode () {
     return element(by.css("#vouchercode"));
  }
  clickVouchercode () {
     return this.vouchercode.click();
  }
  setVoucherCode (vouchercodeString) {
    return this.voucherCode.sendKeys(vouchercodeString);
  }

  /* Register button */
  get registerButton () {
     return element(by.css("#register"));
  }
  clickRegisterButton () {
     return this.registerButton.click();
  }

  /* Toaster alert that registration was submitted */

  /* Text in toaster alert */
  get toastMessage () {
     return element(by.css("#toastMessage"));
  }

  /* The "X" close button for the toaster alert */
  get toastMessageCloseButton () {
     return element(by.css(".pficon.pficon-close"));
  }
  clickToastMessageCloseButton () {
     browser.wait(until.elementToBeClickable(this.toastMessageCloseButton), constants.WAIT, 'Failed to find toastMessageCloseButton');
     return this.toastMessageCloseButton.click();
  }

  /* The circle "X" close icon for the toaster alert */
  get toastMessageCloseIcon () {
     return element(by.css(".pficon.pficon-error-circle-o"));
  }
  clickToastMessageCloseIcon () {
     browser.wait(until.elementToBeClickable(this.toastMessageCloseIcon), constants.WAIT, 'Failed to find toastMessageCloseIcon');
     return this.toastMessageCloseIcon.click();
  }

}

module.exports = OpenShiftIoStartPage;
