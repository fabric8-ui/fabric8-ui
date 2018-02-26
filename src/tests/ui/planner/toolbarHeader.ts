import { BaseElement } from './../base.element';
import { ElementFinder } from 'protractor';
import * as ui from '../../ui';


export class ToolbarHeader extends BaseElement {
  header = new BaseElement(this.$('.toolbar-pf-view-selector'), 'header div');
  showTree = new BaseElement(this.$('.toolbar-pf-view-selector #showTree'), 'show Tree');

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
}