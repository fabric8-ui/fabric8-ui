import { Clickable } from './../base.element';
import { ElementFinder, $, $$, browser } from 'protractor';
import * as ui from './../../ui';
import * as support from './../../support';

export class WorkItemQuickPreview extends ui.BaseElement {
  // TODO - move loading animation out of here. It doesn't belong here.
  loadingAnimation = new ui.BaseElementArray($$('.spinner'), 'Loading spinner animation');
  /* UI elements of the Top section of the workitem preview */
  closeButton = new ui.Button(this.$('.f8-quick-preview--close'), 'WorkItem Quick Preview close button');
  stateDropdown = new ui.Dropdown(this.$('.dropdown-toggle'), this.$('#wi-status-dropdown'), 'WorkItem State dropdown');
  fullDetailButton = new ui.Clickable(this.$('span.dib'), 'View full details button');
  titleDiv = new ui.BaseElement(this.$('#wi-title-div'));
  titleInput = new ui.TextInput(this.titleDiv.$('textarea'), 'WorkItem Title Input');
  titleSaveButton = new ui.Button(this.titleDiv.$('.inlineinput-btn-save'), 'WorkItem Title Save button');
  titleCancelButton = new ui.Button(this.titleDiv.$('.inlineinput-btn-cancel'), 'Workitem Title cancel button');

  /* UI elements for the middle section of the workitem preview */
  assigneeDropdown = new ui.Dropdown(
    this.$('#f8-add-assignee'),
    this.$('assignee-selector ul.select-dropdown-menu'),
    'Assignee Select dropdown');
  assigneeDropdownCloseButton = new ui.Button(
    this.$('#f8-add-assignee-dropdown .close-pointer'),
    'Assignee dropdown close button');
  assigneeDiv = new ui.BaseElement(this.$('f8-assignee'), 'Assignee List Div');
  areaDropdown = new ui.Dropdown(
    this.$('#area-dropdown > div > span'),
    this.$('ul.item-ul.dropdown-list'),
    'Area select dropdown'
  );
  areaSaveButton = new ui.Button(this.$('#area-dropdown .save-button'), 'Area save button');
  areaCancelButton = new ui.Button(this.$('#area-dropdown .cancel-button'), 'Area cancel button');

  iterationDropdown = new ui.Dropdown(
    this.$('#iteration-dropdown > div > span'),
    this.$('ul.item-ul.dropdown-list'),
    'Iteration select dropdown'
  );
  iterationSaveButton = new ui.Button(this.$('#iteration-dropdown .save-button'), 'Iteration save button');
  iterationCancelButton = new ui.Button(this.$('#iteration-dropdown .cancel-button'), 'Iteration cancel button');

  // TODO
  labelDropdown: ui.Dropdown;
  descriptionDiv = new ui.BaseElement(this.$('.description-fields-wrap'), 'WorkItem Description Div');
  descriptionTextarea = new ui.TextInput(this.descriptionDiv.$('.editor-box'), 'WorkItem Description Input');
  descriptionSaveButton =  new ui.Button(
    this.descriptionDiv.$('.action-btn.btn-save'),
    'WorkItem Description Save Button');
  descriptionCancelButton =  new ui.Button(
    this.descriptionDiv.$$('.action-btn.btn').first(),
    'WorkItem Description Save Button');
  creatorusername = new ui.BaseElement(this.$('#WI_details_reporter_user'), 'WorkItem creator div');
  creatorAvatar = new ui.BaseElement(this.$('#WI_details_reporter_img'), 'Creator Avatar URL')
  /* UI elements for the bottom section of the workitem preview */
  linksToggleButton = new ui.Clickable($('#wi-link .f8-toggle-caret'), 'WorkItem Links toggle button');
  commentsToggleButton = new ui.Clickable($('#wi-comment .f8-toggle-caret'), 'WorkItem Comments toggle button');
  creationTimeDiv = new ui.BaseElement(this.$('#created_at'), 'WorkItem creation time div');

  constructor(ele: ElementFinder, name: string = '') {
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

  async addAssignee(assignee: string) {
    await this.assigneeDropdown.clickWhenReady();
    await this.assigneeDropdown.select(assignee)
    await this.assigneeDropdownCloseButton.clickWhenReady();
  }

  async addArea(areaTitle: string) {
    await this.loadingAnimation.untilAbsent();
    await this.areaDropdown.clickWhenReady();
    await this.areaDropdown.select(areaTitle);
    await this.areaSaveButton.clickWhenReady();
  }

  async addIteration(iterationTitle: string) {
    await this.loadingAnimation.untilAbsent();
    await this.iterationDropdown.clickWhenReady();
    await this.iterationDropdown.select(iterationTitle);
    await this.iterationSaveButton.clickWhenReady();
  }

  async close() {
    await this.closeButton.clickWhenReady();
  }

  async hasArea(areaName: string) {
    await this.loadingAnimation.untilAbsent();
    let area = await this.areaDropdown.getText();
    return area === areaName;
  }

  async hasCreator(name: string): Promise<Boolean> {
    await this.loadingAnimation.untilAbsent();
    let creator = await this.creatorusername.getText();
    return creator === name;
  }

  async hasCreatorAvatar(avatarUrl: string): Promise<Boolean> {
    await this.loadingAnimation.untilAbsent();
    let creator = await this.creatorAvatar.getAttribute('src');
    return creator === avatarUrl;
  }

  async hasAssignee(name: string): Promise<Boolean> {
    await this.loadingAnimation.untilAbsent();
    await this.assigneeDiv.untilDisplayed();
    let assigneeList = await this.assigneeDiv.getText();
    return assigneeList.indexOf(name) > -1;
  }

  async hasCreationTime(time: string): Promise<Boolean> {
    let origTime = await this.creationTimeDiv.getText()
    return time === origTime;
  }

  async hasDescription(description: string): Promise<Boolean> {
    return await this.descriptionTextarea.getText() == description;
  }

  async hasIteration(iterationTitle: string): Promise<Boolean> {
    await this.loadingAnimation.untilAbsent();
    let iteration = await this.iterationDropdown.getText();
    return iteration === iterationTitle;
  }

  async updateTitle(title: string, append: boolean = false) {
    await this.titleDiv.clickWhenReady();
    if(!append) {
      await this.titleInput.clear();
    }
    await this.titleInput.sendKeys(title);
    await this.titleSaveButton.clickWhenReady();
  }

  async updateDescription(description: string, append: boolean = false) {
    await this.descriptionDiv.clickWhenReady();
    if(!append) {
      await this.descriptionTextarea.clear();
    }
    await this.descriptionTextarea.sendKeys(description);
    await this.descriptionSaveButton.clickWhenReady();
  }

  async removeAssignee(assignee: string) {
    // Removing the assignee is exactly similar to adding an assignee
    await this.addAssignee(assignee);
  }

}
