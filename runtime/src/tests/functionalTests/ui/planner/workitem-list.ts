import { BaseElement } from './../base.element';
import { ElementFinder, by } from 'protractor';
import { WorkItemQuickAdd } from './workitem-quickadd';
import { WorkItemListEntry } from './workitem-list-entry';

export class WorkItemList extends BaseElement {
  overlay = new BaseElement(this.$('div.lock-overlay-list'));

  constructor(el: ElementFinder, name = 'Work Item List') {
    super(el, name);
  }

  async ready() {
    await super.ready();
    await this.overlay.untilAbsent();
  }

  async clickWorkItem(title: string) {
    let wiSelector = this.element(by.xpath("//datatable-body-row[.//p[contains(text(), '" + title + "')]]"));
    let wi = new WorkItemListEntry(wiSelector);
    await wi.openQuickPreview();
  }

  async hasWorkItem(title: string): Promise<boolean> {
    let wiSelector = this.element(by.xpath("//datatable-body-row[.//p[contains(text(), '" + title + "')]]"));
    return wiSelector.isPresent();
  }
}
