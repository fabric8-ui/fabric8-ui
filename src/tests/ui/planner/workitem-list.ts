import { BaseElement } from './../base.element';
import { ElementFinder, by } from 'protractor';
import { WorkItemQuickAdd } from './workitem-quickadd';
import { WorkItemListEntry } from './workitem-list-entry';
import * as ui from '../../ui';

export class WorkItemList extends BaseElement {
  overlay = new BaseElement(this.$('div.lock-overlay-list'));
  datatableHeaderdiv = new ui.BaseElement(this.$('.datatable-header'),'datatable header div');
  datatableHeaderCell = new ui.BaseElementArray(this.$$('datatable-header-cell'),'datatable header cell');
  datatableHeaderCellLabel = new ui.BaseElementArray(this.$$('datatable-header-cell-label'));
  childWorkItemTypeDropdown = new ui.Dropdown(
    this.$('.f8-quick-add-inline .dropdown-toggle'),
    this.$('.f8-quick-add-inline .dropdown-menu'),
    'Child WorkItem Type dropdown'
  );

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

  async clickInlineQuickAdd(title: string) {
    await this.workItem(title).clickInlineQuickAdd();
  }

  async getInlineQuickAddClass(title: string) {
    return await this.workItem(title).getInlineQuickAddClass();
  }

  async getDataTableHeaderCellCount() {
    await this.datatableHeaderdiv.untilDisplayed();
    return await this.datatableHeaderCell.count();
  }

  async selectChildWorkItemType(type: string){
    await this.childWorkItemTypeDropdown.clickWhenReady();
    await this.childWorkItemTypeDropdown.select(type);
  }

  async iterationText(title: string) {
    return await this.workItem(title).getIterationText();
  }
};
