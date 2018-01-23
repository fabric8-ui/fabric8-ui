import { $, $$, ElementFinder } from 'protractor';
import { WorkItemQuickPreview } from './workitem-quickpreview';
import * as ui from '../../ui';

export class WorkItemListEntry extends ui.BaseElement {
  cellSelector = $$('.datatable-body-cell');
  inlineQuickAdd = new ui.BaseElement($('.quick-add-icon'), 'Inline quick add button');
  id = new ui.BaseElement(this.$('span.margin-0'), 'WorkItem ID');
  type = new ui.BaseElement(this.$('datatable-body-cell:nth-child(3) work-item-cell > div'), 'WorkItem Type');
  title = new ui.BaseElement(this.$('.wi-detail-title p'), 'WorkItem Title');
  labels = new ui.BaseElement(this.$('f8-label'), 'WorkItem Labels');
  // TODO
  status: ui.BaseElement;
  iteration: ui.BaseElement;
  creator: ui.BaseElement;
  assignees: ui.BaseElement;

  constructor(element: ElementFinder, name: string = '') {
    super(element);
  }

  async openQuickPreview() {
    await this.title.clickWhenReady();
  }
}
