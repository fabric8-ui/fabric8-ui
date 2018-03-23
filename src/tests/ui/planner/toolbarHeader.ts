import { BaseElement } from './../base.element';
import { ElementFinder } from 'protractor';
import * as ui from '../../ui';

export class ToolbarHeader extends BaseElement {
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

  constructor(el: ElementFinder, name = 'ToolBar Header') {
    super(el, name);
  }

  async ready() {
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
}