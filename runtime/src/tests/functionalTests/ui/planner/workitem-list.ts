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
    await this.workItem(title).openQuickPreview();
  }

  async hasWorkItem(title: string): Promise<boolean> {
      return this.workItem(title).isPresent();
  }

  workItem(title: string): WorkItemListEntry {
    return new WorkItemListEntry(this.element(by.xpath("//datatable-body-row[.//p[text()=' " + title + " ']]")));
  }

}
