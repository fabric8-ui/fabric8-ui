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

class Fabric8MainPage {

  constructor() {
  };

  get startCollaboratingButton () {
    return element(by.xpath(".//*//button[.//text()[contains(.,'Start Collaborating')]]"));    
  }

  clickStartCollaboratingButton () {
    return this.startCollaboratingButton.click();
  }

  get learnButton () {
    return element(by.xpath(".//*//a[.//text()[contains(.,'Learn Collaborating')]]"));    
  }

  clickLearnButton () {
    return this.learnButton.click();
  }

  get spaceName () {
     return element(by.id("spaceName"));
  }

  clickSpaceName () {
     return this.spaceName.click();
  }

  typeSpaceName (spaceNameString) {
     return this.spaceName.sendKeys(spaceNameString);
  }

  get nextButton () {
    return element(by.xpath(".//*//a[.//text()[contains(.,'Next')]]"));    
  }

  clickNextButton () {
    return this.nextButton.click();
  }

  get wizardButton () {
    return element(by.xpath(".//*//a[.//text()[contains(.,'Wizard')]]"));    
  }

  clickWizardButton () {
    return this.wizardButton.click();
  }

  get quickstartButton () {
    return element(by.xpath(".//*//a[.//text()[contains(.,'QuickStart')]]"));    
  }

  clickQuickstartButton () {
    return this.quickstartButton.click();
  }

  get projectName () {
    return element.all(by.id('projectName')).get(0);
  }

  clickProjectName () {
     return this.projectName.click();
  }

  typeProjectName (projectNameString) {
     return this.projectName.sendKeys(projectNameString);
  }

  get topLevelPackage () {
    return element(by.id("topLevelPackage"));
  }

  clickTopLevelPackage () {
     return this.topLevelPackage.click();
  }

  typeTopLevelPackage (topLevelPackageString) {
     return this.projectName.sendKeys(topLevelPackageString);
  }

  get projectVersion () {
    return element(by.id("projectVersion"));
  }

  clickProjectVersion () {
     return this.projectVersion.click();
  }

  typeProjectVersion (projectVersionString) {
     return this.projectName.sendKeys(projectVersionString);
  }

  get finishButton () {
     return element.all(by.xpath(".//*//a[.//text()[contains(.,'Finish')]]")).get(1);  
  }

  clickFinishButton () {
    return this.finishButton.click();
  }

}

module.exports = Fabric8MainPage;
