import { BaseElement } from './../base.element';
import { ElementFinder, browser, $$ } from 'protractor';
import * as ui from '../../ui';

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
  saveFilterBtn = new ui.Button(this.$('.save-cq-btn'),'Save');
  closeBtn = new ui.Button(this.$('.cancel-cq-btn'),'Cancel');
  titleTextInput = new ui.TextInput(this.saveFilterDialog.$('input.query-title'), 'Query Title');

  constructor(el: ElementFinder, name = 'ToolBar Header') {
    super(el, name);
  }

  async ready() {
    await super.ready();
    await this.header.untilPresent();
  }

  async clickShowTree() {
    await this.ready();
    await this.showTree.untilDisplayed();
    await this.showTree.clickWhenReady();
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
    while(true) {
      try {
        await this.showCompleted.clickWhenReady();
        break;
      } catch(e) {
        await browser.sleep(1000);
        await this.notificationToast.untilCount(0);
      }
    }
  }

  async saveFilters(title) {
    await this.saveFilter.clickWhenReady();
    await this.titleTextInput.enterText(title);
    await this.saveFilterBtn.clickWhenReady();
  }
}
