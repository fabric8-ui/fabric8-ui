import { $, ElementFinder, by, By, element} from 'protractor';
import  *  as ui from './../../ui';
import * as support from '../../support';

export class SidePanel extends ui.BaseElement {
  showHideSidePanelButton = new ui.Button(this.$('.f8-sidepanel--toggle'), 'show/hide side panel button');
  scenarioButton = new ui.Clickable(this.element(by.cssContainingText('.f8-group-filter__type', ' Scenarios')),'Side panel Scenario button');
  experienceButton = new ui.Clickable(this.element(by.cssContainingText('.f8-group-filter__type', ' Experiences')),'Side panel Experiences button');
  requirementsButton = new ui.Clickable(this.element(by.cssContainingText('.f8-group-filter__type', ' Requirements')),'Side panel Requirements button');
  iterationDiv = new ui.BaseElement(this.$('.f8-itr'),'Iteration div');
  createIterationButton = new ui.Button(this.iterationDiv.$('#add-iteration-icon'), 'Side panel Add Iteration Button');
  iterationList = new ui.BaseElementArray(this.$$('.f8-itr__tree .f8-itr-name'),'Iteration list');
  iterationKebab = new ui.Button(this.$('.dropdown-toggle'), 'Side panel Iteration Kebab Dropdown');
  editIteration = new ui.Clickable(this.element(by.cssContainingText('.f8-itr .dropdown.open ul>li','Edit')), 'Iteration Dropdown Edit Option');

  constructor(ele: ElementFinder, name: string = 'WorkItem List page Side Panel') {
    super(ele, name);
  }

  async ready() {
    support.debug('... check if Side panel is Ready');
    await super.ready();
    await this.showHideSidePanelButton.ready();
    await this.scenarioButton.ready();
    await this.experienceButton.ready();
    await this.requirementsButton.ready();
    await this.createIterationButton.ready();
    support.debug('... check if Side panel is Ready - OK');
  }

  async clickScenarios() {
    await this.scenarioButton.clickWhenReady();
  }

  async clickExperience() {
    await this.experienceButton.clickWhenReady();
  }

  async clickRequirement() {
    await this.requirementsButton.clickWhenReady();
  }

  async createNewIteration() {
    await this.createIterationButton.clickWhenReady();
  }

  async hasIteration(iteration: string): Promise<Boolean> {
    await this.ready();
    let iterationList = await this.iterationList.getTextWhenReady();
    return iterationList.indexOf(iteration) > -1;
  }

  async selectIterationKebab(iterationName: string) {
    return this.element(By.xpath("//iteration-list-entry[.//span[text()='"+ iterationName +"']]")).$('.dropdown-toggle').click();
  }

  async openIterationDialogue() {
    await this.editIteration.clickWhenReady();
  }

}
