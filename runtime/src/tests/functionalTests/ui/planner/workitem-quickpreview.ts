import { Clickable } from './../base.element';
import { ElementFinder, $ } from 'protractor';
import * as ui from './../../ui';
import * as support from './../../support';

class StateDropdown extends ui.Dropdown {
  selectButton = new ui.Button($('.dropdown-toggle'), 'Workitem state dropdown toggle');
  newState = this.item('new');
  openState = this.item('open');
  inProgressState = this.item('in progress');
  resolvedState = this.item('resolved');
  closedState = this.item('closed');

  constructor(element: ElementFinder = $('.dropdown-menu'), name: string = 'WorkItem state dropdown') {
    super(element, name);
  }

  async ready() {
    support.debug('... check if State Dropdown is ready');
    await super.ready();
    await this.selectButton.ready();
    await this.newState.ready();
    await this.openState.ready();
    await this.inProgressState.ready();
    await this.resolvedState.ready();
    await this.closedState.ready();
    support.debug('... check if State Dropdown is ready - OK');
  }

  // Override select function to click on selectButton before selecting item
  async select(text: string) {
    await this.selectButton.clickWhenReady();
    await super.select(text);
  }
}

// TODO - Implement a generic dynamic dropdown that can be used to model assignee, iteration, area dropdown
class DynamicDropdown extends ui.BaseElement {
  constructor(element: ElementFinder, name: string) {
    super(element, name);
  }

  async ready() {
    await super.ready();
  }
}

export class WorkItemQuickPreview extends ui.BaseElement {
  /* UI elements of the Top section of the workitem preview */
  closeButton = new ui.Button(this.$('.f8-quick-preview--close'));
  stateDropdown = new StateDropdown();
  fullDetailButton = new ui.Clickable(this.$('span.dib'), 'View full details button');
  titleDiv = new ui.BaseElement(this.$('#wi-title-div'));
  titleInput = new ui.TextInput(this.titleDiv.$('textarea'), 'WorkItem Title Input');
  titleSave = new ui.Button(this.titleDiv.$('.inlineinput-btn-save'), 'WorkItem Title Save button');
  titleCancel = new ui.Button(this.titleDiv.$('.inlineinput-btn-cancel'), 'Workitem Title cancel button');

  /* UI elements for the middle section of the workitem preview */
  // TODO - Implement Dynamicdropdown
  assigneeDropdown: DynamicDropdown;
  areadDropdown: DynamicDropdown;
  iterationDropdown: DynamicDropdown;
  labelDropdown: DynamicDropdown;
  descriptionDiv = new ui.BaseElement(this.$('.description-fields-wrap'), 'WorkItem Description Div');
  descriptionTextarea = new ui.TextInput(this.descriptionDiv.$('.editor-box'), 'WorkItem Description Input');
  descriptionSaveButton =  new ui.Button(
    this.descriptionDiv.$('.action-btn.btn-save"'),
    'WorkItem Description Save Button');
  descriptionCancelButton =  new ui.Button(
    this.descriptionDiv.$$('.action-btn.btn"').first(),
    'WorkItem Description Save Button');

  /* UI elements for the bottom section of the workitem preview */
  linksToggleButton = new ui.Clickable($('#wi-link .f8-toggle-caret'), 'WorkItem Links toggle button');
  commentsToggleButton = new ui.Clickable($('#wi-comment .f8-toggle-caret'), 'WorkItem Comments toggle button');

  constructor(ele: ElementFinder = $('work-item-preview'), name: string = 'WorkItem Preview') {
    super(ele, name);
  }

  async ready() {
    support.debug('... check if WorkItem preview is Ready');
    await super.ready();
    await this.closeButton.ready();
    await this.titleDiv.ready();
    await this.descriptionDiv.ready();
    await this.linksToggleButton.ready();
    await this.commentsToggleButton.ready();
    support.debug('... check if WorkItem preview is Ready - OK');
  }

  async close() {
    await this.closeButton.clickWhenReady();
  }
}
