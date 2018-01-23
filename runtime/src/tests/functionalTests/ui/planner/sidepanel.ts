import { $, ElementFinder, by} from 'protractor';
import  *  as ui from './../../ui';
import * as support from '../../support';

export class SidePanel extends ui.BaseElement {
  showHideSidePanelButton = new ui.Button(this.$('.f8-sidepanel--toggle'), 'show/hide side panel button');
  scenarioButton = new ui.Clickable(this.element(by.cssContainingText('.f8-group-filter__type', ' Scenarios')),'Side panel Scenario button');
  experienceButton = new ui.Clickable(this.element(by.cssContainingText('.f8-group-filter__type', ' Experiences')),'Side panel Experiences button');
  requirementsButton = new ui.Clickable(this.element(by.cssContainingText('.f8-group-filter__type', ' Requirements')),'Side panel Requirements button');
  createIterationButton = new ui.Button(this.$('#add-iteration-icon'), 'Side panel Add Iteration Button');  
  
  // TODO - Add iterations section

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

  async createNewIteration() {
    // TODO
  }
}
