import { $, $$, ElementFinder } from 'protractor';
import { WorkItemQuickPreview } from './workitem-quickpreview';
import * as ui from '../../ui';

export class WorkItemListEntry extends ui.BaseElement {
  cellSelector = $$('.datatable-body-cell');
  inlineQuickAdd = new ui.Clickable(this.$('.quick-add-icon'), 'Inline quick add button');
  id = new ui.BaseElement(this.$('span.margin-0'), 'WorkItem ID');
  type = new ui.BaseElement(this.$('datatable-body-cell:nth-child(3) work-item-cell > div'), 'WorkItem Type');
  title = new ui.Clickable(this.$('.wi-detail-title p'), 'WorkItem Title');
  labels = new ui.BaseElement(this.$('f8-label'), 'WorkItem Labels');
  inlineCloseButton = new ui.Clickable(this.$('.pficon-close'),'inline close');
  // TODO
  status: ui.BaseElement;
  iteration= new ui.BaseElement(this.$('#table-iteration'), 'Table Workitem Iteration Name');
  creator: ui.BaseElement;
  assignees: ui.BaseElement;

  constructor(element: ElementFinder, name: string = '') {
    super(element);
  }

  async openQuickPreview() {
    await this.title.clickWhenReady();
  }

  async clickInlineQuickAdd() {
    await this.inlineQuickAdd.clickWhenReady();
  }

  async clickInlineClose() {
    await this.inlineCloseButton.clickWhenReady();
  }

  async getInlineQuickAddClass() {
    return await this.inlineQuickAdd.getAttribute('className');
  }

  async getIterationText() {
    return await this.iteration.getTextWhenReady();
  }
}
