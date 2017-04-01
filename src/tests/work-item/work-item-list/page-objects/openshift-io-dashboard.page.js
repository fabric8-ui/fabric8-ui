/**
 * AlMighty page object example module for openshift.io start page
 * See: http://martinfowler.com/bliki/PageObject.html,
 * https://www.thoughtworks.com/insights/blog/using-page-objects-overcome-protractors-shortcomings
 * @author ldimaggi@redhat.com
 */

'use strict';

/*
 * Fabric8 Start Page Definition
 */

var testSupport = require('../testSupport'),
    constants = require("../constants");

var until = protractor.ExpectedConditions;

  const devProcesses  = {
    Agile: 0,
    Scrum: 1,
    IssueTracking: 2,
    ScenarioDrivenPlanning: 3
  }

class OpenShiftIoDashboardPage {

  constructor() {
  };

  get newSpaceButton () {
    browser.wait(until.presenceOf(element(by.xpath(".//a[contains(text(),'New')]"))), constants.WAIT, 'Failed to find new space buton');
    return element(by.xpath(".//a[contains(text(),'New')]"));
//    return element(by.cssContainingText('div.card-pf-title', 'New'));
  }
  clickNewSpaceButton () {
    browser.wait(until.presenceOf(this.newSpaceButton), constants.WAIT, 'Failed to find new space buton');
    return this.newSpaceButton.click();
  }

  get newSpaceName () {
    return element(by.id("name"));
   }
  typeNewSpaceName (nameString) {
    browser.wait(until.elementToBeClickable(this.newSpaceName), constants.WAIT, 'Failed to find new space name field');
    return this.newSpaceName.sendKeys(nameString);
  }

  get devProcessPulldown () {
    return element(by.id("developmentProcess"));
  }
  clickDevProcessPulldown () {
    return this.devProcessPulldown.click();
  }
  typeDevProcess (processString) {
    browser.wait(until.elementToBeClickable(this.devProcessPulldown), constants.WAIT, 'Failed to find new space name dev process');
    return this.devProcessPulldown.sendKeys(processString);
  }

  get createSpaceButton () {
    return element(by.buttonText('Create Space'));
  }
  clickCreateSpaceButton () {

    browser.wait(until.elementToBeClickable(this.createSpaceButton), constants.WAIT, 'Failed to find element');
    return this.createSpaceButton.click();
  }

  get cancelButton () {
    return element(by.buttonText('Cancel'));
  }
  clickCancelButton () {
    return this.cancelButton.click();
  }

  get noThanksButton () {
    return element(by.xpath(".//a[contains(text(),'No thanks, just take me to')]"));
  }
  clickNoThanksButton () {
    return this.noThanksButton.click();
  }

  get wizardButton () {
    return element(by.xpath(".//a[contains(text(),'Wizard')]"));
  }
  clickWizardButton () {
    return this.wizardButton.click();
  }

 get devProcessPulldownElements () {
   return element.all(by.css(".developmentProcess.option"));
 }

searchByLinkText(text){
  return element(by.linkText(text));
}

}

module.exports = OpenShiftIoDashboardPage;
