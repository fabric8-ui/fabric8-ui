import { Clickable } from './../base.element';
import { ElementFinder, $, $$, browser } from 'protractor';
import * as ui from './../../ui';
import * as support from './../../support';

export class WorkItemQuickPreview extends ui.BaseElement {
  // TODO - move loading animation out of here. It doesn't belong here.
  loadingAnimation = new ui.BaseElementArray($$('.spinner'), 'Loading spinner animation');
  notificationToast = new ui.BaseElementArray($$('pfng-toast-notification'), 'Notification Toast');
  /* UI elements of the Top section of the workitem preview */
  closeButton = new ui.Button(this.$('.f8-detail--close'), 'WorkItem Quick Preview close button');
  iterationDropdownCloseButton = new ui.Button(this.$('.iteration-dropdown .close-pointer'),'Iteration dropdown close button');
  areaDropdownCloseButton = new ui.Button(this.$('.area-dropdown .close-pointer'),'Area dropdown close button');
  stateDropdown = new ui.Dropdown(this.$('.dropdown-toggle'), this.$('#wi-status-dropdown'), 'WorkItem State dropdown');
  fullDetailButton = new ui.Clickable(this.$('span.dib'), 'View full details button');
  titleDiv = new ui.BaseElement(this.$('#wi-title-div'), 'Workitem title div');
  titleInput = new ui.TextInput(this.titleDiv.$('textarea'), 'WorkItem Title Input');
  titleSaveButton = new ui.Button(this.titleDiv.$('.inlineinput-btn-save'), 'WorkItem Title Save button');
  titleCancelButton = new ui.Button(this.titleDiv.$('.inlineinput-btn-cancel'), 'Workitem Title cancel button');
  titleErrorMessage = new ui.BaseElement(this.$('.error-message small'), 'WorkItem Title error message');

  /* UI elements for the middle section of the workitem preview */
  assigneeDropdown = new ui.Dropdown(
    this.$('#f8-add-assignee'),
    this.$('assignee-selector ul.select-dropdown-menu'),
    'Assignee Select dropdown');
  assigneeDropdownCloseButton = new ui.Button(
    this.$('#f8-add-assignee-dropdown .close-pointer'),
    'Assignee dropdown close button');
  assigneeDropdownMenu = new ui.BaseElement(
    this.$('assignee-selector div.select-dropdown'),
    'Assignee dropdown menu');
  assigneeDiv = new ui.BaseElement(this.$('f8-assignee'), 'Assignee List Div');
  areaDiv = new ui.BaseElement(this.$('.area-dropdown'), 'Assignee List Div');
  areaDropdown = new ui.Dropdown(
    this.areaDiv.$('f8-select-dropdown>div>span'),
    this.areaDiv.$('.select-dropdown-menu'),
    'Area select dropdown'
  );
  iterationDiv = new ui.BaseElement(this.$('.iteration-dropdown'), 'Iteration List Div');
  
  iterationDropdown = new ui.Dropdown(
    this.iterationDiv.$('f8-select-dropdown>div>span'),
    this.iterationDiv.$('.select-dropdown-menu'),
    'Iteration select dropdown'
  );
  iterationInput = new ui.TextInput(this.iterationDiv.$('.select-dropdown-search-input'), 'Iteration input');

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
  descriptionEditIcon = new ui.Clickable(this.descriptionDiv.$('i'), 'WorkItem Description Edit icon');
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
    this.$('.dropdown.open .dropdown-menu.dropdown-ul'),
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
  commentCancelButton = new ui.Button(this.commentDiv.$('.fl.btn.btn-default.pull-right.action-btn'), 'Comment cancel button');
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
    await this.loadingAnimation.untilCount(0);
    await this.assigneeDropdown.clickWhenReady();
    await this.assigneeDropdown.select(assignee);
    await this.assigneeDropdownCloseButton.clickWhenReady();
    await this.loadingAnimation.untilCount(0);
  }

  async addArea(areaTitle: string) {
    await this.loadingAnimation.untilCount(0);
    await browser.sleep(2000);
    await this.areaDropdown.clickWhenReady();
    await this.areaDropdown.select(areaTitle);
    await this.areaDropdownCloseButton.clickWhenReady();
    await this.loadingAnimation.untilCount(0);
  }

  async addIteration(iterationTitle: string) {
    await this.loadingAnimation.untilCount(0);
    await browser.sleep(2000);
    await this.iterationDropdown.clickWhenReady();
    await this.iterationDropdown.select(iterationTitle);
    await this.iterationDropdownCloseButton.clickWhenReady();
    await this.notificationToast.untilCount(1);
  }

  async typeaHeadSearch(iterationTitle: string) {
    await this.loadingAnimation.untilCount(0);
    await this.iterationDropdown.clickWhenReady();
    await this.iterationInput.enterText(iterationTitle);
  }

  private async addComment(comment: string) {
    await this.loadingAnimation.untilCount(0);
    await this.commentsField.clickWhenReady();
    await this.commentsInputField.enterText(comment);
  }

  async addCommentAndSave(comment: string) {
    await this.ready()
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
    await browser.sleep(1000);
    await this.workItemDropdown.select(workItem);
    await this.linkButton.isPresent();
    await this.linkButton.clickWhenReady();
  }

  async createNewLabel(label: string) {
    await this.labelDropdown.clickWhenReady()
    await this.createLabelButton.clickWhenReady();
    await this.createLabelInput.enterText(label);
    await this.createLabelSaveButton.clickWhenReady();
    await this.labelDropdown.select(label);
    await this.labelDropdownCloseButton.clickWhenReady();
  }

  // Try to click on the close button, if it fails, wait for notification to disappear
  async close() {
    while(true) {
      try {
        await this.closeButton.clickWhenReady();
        break;
      } catch(e) {
        await browser.sleep(1000);
        await this.notificationToast.untilCount(0);
      }
    }
  }

  async getArea() {
    await this.loadingAnimation.untilCount(0);
    let area = await this.areaDropdown.getTextWhenReady();
    return area;
  }

  async getCreator() {
    await this.loadingAnimation.untilCount(0);
    // We need the explicit sleep since the creator name doesn't load instantly
    await browser.sleep(3000);
    let creator = await this.creatorusername.getTextWhenReady();
    return creator;
  }

  async getCreatorAvatar() {
    await this.loadingAnimation.untilCount(0);
    let creator = await this.creatorAvatar.getAttribute('src');
    return creator;
  }

  async getAssignees() {
    await this.loadingAnimation.untilCount(0);
    await this.assigneeDiv.untilDisplayed();
    await browser.sleep(5000);
    let assigneeList = await this.assigneeDiv.getTextWhenReady();
    return assigneeList;
  }

  async getComments() {
    await this.ready();
    await this.commentDiv.scrollIntoView();
    let commentList:String = "" ;
    if (await this.commentsText.isPresent()) {
      commentList = await this.commentsText.getTextWhenReady();
    }
    return commentList;
  }

  async getCreationTime() {
    let origTime = await this.creationTimeDiv.getTextWhenReady()
    return origTime;
  }

  async getDescription() {
    return await this.descriptionTextarea.getTextWhenReady();
  }

  async getIteration() {
    await this.loadingAnimation.untilCount(0);
    await browser.sleep(1000);
    let iteration = await this.iterationDropdown.getTextWhenReady();
    return iteration;
  }

  async getLabels() {
    let labelList = await this.labelListDiv.getTextWhenReady();
    return labelList;
  }

  async getLinkedItems() {
    let linkList = await this.linklistItem.getTextWhenReady();
    return linkList;
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
    await this.openDescriptionBox();
    if(!append) {
      await this.descriptionTextarea.clear();
    }
    await this.descriptionTextarea.enterText(description);
    await this.descriptionSaveButton.scrollIntoView();
    await this.descriptionSaveButton.clickWhenReady();
    await this.descriptionSaveButton.untilHidden();
  }

  async openDescriptionBox(){
    await browser.actions().mouseMove(this.descriptionDiv).perform();
    await this.descriptionEditIcon.clickWhenReady();
  }

  async isSaveButtonDisplayed() {
    try {
      return await this.descriptionSaveButton.isDisplayed();
    }
    catch (exception) {
      return false;
    }
  }

  async removeAssignee(assignee: string) {
    // Removing the assignee is exactly similar to adding an assignee
    await this.addAssignee(assignee);
  }

  async getTitleError() {
    return await this.titleErrorMessage.getTextWhenReady();
  }

  async changeStateTo(state: string) {
    await this.stateDropdown.clickWhenReady();
    await this.stateDropdown.select(state);
  }
}
