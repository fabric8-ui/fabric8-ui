import { Clickable } from './../base.element';
import { ElementFinder, $, $$, browser } from 'protractor';
import * as ui from './../../ui';
import * as support from './../../support';

export class WorkItemQuickPreview extends ui.BaseElement {
  // TODO - move loading animation out of here. It doesn't belong here.
  loadingAnimation = new ui.BaseElementArray($$('.spinner'), 'Loading spinner animation');
  /* UI elements of the Top section of the workitem preview */
  closeButton = new ui.Button(this.$('.f8-detail--close'), 'WorkItem Quick Preview close button');
  stateDropdown = new ui.Dropdown(this.$('.dropdown-toggle'), this.$('#wi-status-dropdown'), 'WorkItem State dropdown');
  fullDetailButton = new ui.Clickable(this.$('span.dib'), 'View full details button');
  titleDiv = new ui.BaseElement(this.$('#wi-title-div'), 'Workitem title div');
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

  labelDropdown = new ui.Dropdown(
    this.$('#labelSelector .add-label'),
    this.$('#labelSelector ul.select-dropdown-menu'),
    'Label Select dropdown');
  labelListDiv = new ui.BaseElementArray(this.$$('f8-label .label-wrapper>span'), 'label list Div');
  labelDropDownDiv = new ui.BaseElement(this.$('#labelSelector .select-dropdown'), 'dropdown div');
  labelDropdownCloseButton = new ui.Clickable(this.labelDropDownDiv.$('.close-pointer'),'label dropdown close Button');
  createLabelButton = new ui.Clickable(this.labelDropDownDiv.$('.create-label-button'),'Create new label');
  createLabelDiv = new ui.BaseElement(this.$('.create-label'),'create label div');
  createLabelInput = new ui.TextInput(this.createLabelDiv.$('.create-label-input'),'create label input');
  createLabelCancel = new ui.Button(this.createLabelDiv.$('.pficon-close'),'create label cancel');
  createLabelSaveButton = new ui.Button(this.createLabelDiv.$('.fa-check'),'create label save button');

  descriptionDiv = new ui.BaseElement(this.$('#wi-desc-div'), 'WorkItem Description Div');
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
  linksDiv = new ui.BaseElement($('#wi-link'),'WorkItem links div')
  linksToggleButton = new ui.Clickable(this.linksDiv.$('.f8-toggle-caret'), 'WorkItem Links toggle button');
  createLinkButton = new ui.Button(this.linksDiv.$('#create-link-button'),'Create link Button');
  linkTypeDropdown = new ui.Dropdown(
    this.$('#wi-link-type'),
    this.$('.typeahead-long.dropdown-menu'),
    'select link type dropdown'
  );
  searchWorkItem = new ui.TextInput(this.linksDiv.$('#workitem-link-search'),'Workitem search');
  workItemDropdown = new ui.Dropdown(
    this.searchWorkItem,
    this.$('.dropdown-menu.dropdown-ul'),
    'select workitem'
  );
  linkButton = new ui.Button(this.linksDiv.$('#bind-link'),'link Button');
  linklistItem = new ui.BaseElement(this.$('#wi-link .f8-link__list-item'), 'link lst item');

  commentsToggleButton = new ui.Clickable($('#wi-comment .f8-toggle-caret'), 'WorkItem Comments toggle button');
  creationTimeDiv = new ui.BaseElement(this.$('#created_at'), 'WorkItem creation time div');

  commentDiv = new ui.BaseElement(this.$('.f8-comment--input'), 'comments div field');
  commentsField = new ui.Clickable(this.commentDiv.$('.editor-box.editor-preview.placeholder'), 'comments clickable field');
  commentsInputField = new ui.TextInput(this.commentDiv.$('.editor-box.editor-markdown'), 'comment input field');
  commentSaveButton = new ui.Button(this.commentDiv.$('.btn-save'), 'Comment save button');
  commentCancelButton = new ui.Button(this.commentDiv.$$('.fl.btn.btn-primary.pull-right.action-btn').first(), 'Comment cancel button');
  commentsText = new ui.BaseElementArray(this.$$('.f8-comment-body .editor-box.editor-preview'), 'Comment List');

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
    await this.loadingAnimation.untilCount(0);
    await this.areaDropdown.clickWhenReady();
    await this.areaDropdown.select(areaTitle);
    await this.areaSaveButton.clickWhenReady();
  }

  async addIteration(iterationTitle: string) {
    await this.loadingAnimation.untilCount(0);
    await this.iterationDropdown.clickWhenReady();
    await this.iterationDropdown.select(iterationTitle);
    await this.iterationSaveButton.clickWhenReady();
  }

  private async addComment(comment: string) {
    await this.loadingAnimation.untilCount(0);
    await this.commentsField.clickWhenReady();
    await this.commentsInputField.enterText(comment);
  }

  async addCommentAndSave(comment: string) {
    await this.addComment(comment);
    await this.commentSaveButton.clickWhenReady();
  }

  async addCommentAndCancel(comment: string) {
    await this.addComment(comment);
    await this.commentCancelButton.clickWhenReady();
  }

  async addLabel(label: string) {
    await this.labelDropdown.clickWhenReady()
    await this.labelDropdown.select(label);
    await this.labelDropdownCloseButton.clickWhenReady();
  }

  async addLink(link: string, workItem: string) {
    await this.linksToggleButton.clickWhenReady();
    await this.createLinkButton.clickWhenReady();
    await this.linkTypeDropdown.clickWhenReady();
    await this.linkTypeDropdown.select(link);
    await this.searchWorkItem.enterText(workItem);
    await this.workItemDropdown.select(workItem);
    await this.linkButton.isPresent();
    await this.linkButton.clickWhenReady();
  }

  async close() {
    await this.closeButton.clickWhenReady();
    await browser.sleep(1000);
  }

  async createNewLabel(label: string) {
    await this.labelDropdown.clickWhenReady()
    await this.createLabelButton.clickWhenReady();
    await this.createLabelInput.enterText(label);
    await this.createLabelSaveButton.clickWhenReady();
    await this.labelDropdown.select(label);
    await this.labelDropdownCloseButton.clickWhenReady();
  }

  async hasArea(areaName: string) {
    await this.loadingAnimation.untilCount(0);
    let area = await this.areaDropdown.getTextWhenReady();
    return area === areaName;
  }

  async hasCreator(name: string): Promise<Boolean> {
    await this.loadingAnimation.untilCount(0);
    let creator = await this.creatorusername.getTextWhenReady();
    return creator === name;
  }

  async hasCreatorAvatar(avatarUrl: string): Promise<Boolean> {
    await this.loadingAnimation.untilCount(0);
    let creator = await this.creatorAvatar.getAttribute('src');
    return creator === avatarUrl;
  }

  async hasAssignee(name: string): Promise<Boolean> {
    await this.loadingAnimation.untilCount(0);
    await this.assigneeDiv.untilDisplayed();
    let assigneeList = await this.assigneeDiv.getTextWhenReady();
    return assigneeList.indexOf(name) > -1;
  }

  async hasComment(comment: string): Promise<Boolean> {
    let commentList = await this.commentsText.getTextWhenReady();
    return commentList.indexOf(comment) > -1;
  }

  async hasCreationTime(time: string): Promise<Boolean> {
    let origTime = await this.creationTimeDiv.getTextWhenReady()
    return time === origTime;
  }

  async hasDescription(description: string): Promise<Boolean> {
    return await this.descriptionTextarea.getTextWhenReady() == description;
  }

  async hasIteration(iterationTitle: string): Promise<Boolean> {
    await this.loadingAnimation.untilCount(0);
    let iteration = await this.iterationDropdown.getTextWhenReady();
    return iteration === iterationTitle;
  }

  async hasLabel(label: string) : Promise<Boolean> {
    let labelList = await this.labelListDiv.getTextWhenReady();
    return labelList.indexOf(label) > -1;
  }

  async hasLinkedItem(linkItem:string) : Promise<Boolean> {
    let linkList = await this.linklistItem.getTextWhenReady();
    return linkList.indexOf(linkItem) > -1;
  }

  async updateTitle(title: string, append: boolean = false) {
    await this.titleDiv.clickWhenReady();
    if(!append) {
      await this.titleInput.clear();
    }
    await this.titleInput.enterText(title);
    await this.titleSaveButton.clickWhenReady();
  }

  async updateDescription(description: string, append: boolean = false) {
    await this.descriptionDiv.clickWhenReady();
    if(!append) {
      await this.descriptionTextarea.clear();
    }
    await this.descriptionTextarea.enterText(description);
    await this.descriptionSaveButton.clickWhenReady();
  }

  async removeAssignee(assignee: string) {
    // Removing the assignee is exactly similar to adding an assignee
    await this.addAssignee(assignee);
  }

}
