import { $$, browser, ElementFinder } from 'protractor';
import * as ui from '../../ui';
import { BaseElement } from './../base.element';

export class ToolbarHeader extends BaseElement {
  notificationToast = new ui.BaseElementArray($$('pfng-toast-notification'), 'Notification Toast');
  header = new BaseElement(this.$('.toolbar-pf-view-selector'), 'header div');
  showTree = new BaseElement(this.$('.toolbar-pf-view-selector #showTree'), 'show Tree');
  filterDropdown = new ui.Dropdown(
    this.$('.input-group-btn'),
    this.$('.input-group-btn .dropdown-menu'),
    'Filter-By dropdown'
  );
  selectFilterCondition = new ui.Dropdown(
    this.$('.filter-select'),
    this.$('.filter-select .dropdown-menu'),
    'Select Filter Condition'
  );
  private clearAllFilter = new ui.Clickable(this.$('.clear-filters'), 'Clear All filters');
  showCompleted = new BaseElement(this.$('.toolbar-pf-view-selector #showCompleted'), 'Show Completed');
  saveFilter = new ui.Clickable(this.$('.save-filters'), 'Save');
  saveFilterDialog = new BaseElement(this.$('.save-filter-dropdown'));
  saveFilterBtn = new ui.Button(this.saveFilterDialog.$('.save-cq-btn'), 'Save');
  closeBtn = new ui.Button(this.$('.cancel-cq-btn'), 'Cancel');
  titleTextInput = new ui.TextInput(this.saveFilterDialog.$('input.form-control'), 'Query Title');
  activeFiltersList = new ui.BaseElementArray(this.$$('.f8-filters--active li'), 'Active filters div');

  constructor(el: ElementFinder, name = 'ToolBar Header') {
    super(el, name);
  }

  async ready() {
    await super.ready();
    await this.header.untilPresent();
  }

  async clickShowTree() {
    await this.ready();
    while (true) {
      try {
        await this.showTree.clickWhenReady();
        break;
      } catch (e) {
        await browser.sleep(1000);
        await this.notificationToast.untilCount(0);
      }
    }
  }

  async selectFilter(Label: string, LabelTest: string) {
    await this.ready();
    await this.filterDropdown.clickWhenReady();
    await this.filterDropdown.select(Label);
    await this.selectFilterCondition.clickWhenReady();
    await this.selectFilterCondition.select(LabelTest);
  }

  async clickClearAllFilters() {
    await this.clearAllFilter.clickWhenReady();
  }

  async clickShowCompleted() {
    await this.ready();
    await this.showCompleted.untilDisplayed();
    while (true) {
      try {
        await this.showCompleted.clickWhenReady();
        break;
      } catch (e) {
        await browser.sleep(1000);
        await this.notificationToast.untilCount(0);
      }
    }
  }

  async saveFilters(title: string) {
    await this.saveFilter.clickWhenReady();
    await this.titleTextInput.enterText(title);
    await this.saveFilterBtn.clickWhenReady();
  }

  async getFilterConditions() {
    return this.activeFiltersList.getTextWhenReady();
  }
}
