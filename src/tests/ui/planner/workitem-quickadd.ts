import { ElementFinder, $ } from 'protractor';
import { WorkItem } from './index';
import * as ui from '../../ui';

export class WorkItemQuickAdd extends ui.BaseElement {
  titleTextInput = new ui.TextInput(this.$('input.f8-quickadd-input'), 'Work item Title');
  buttonsDiv = this.$('div.f8-quickadd__wiblk-btn.pull-right');
  addButton = new ui.Button(this.buttonsDiv.$$('button.btn.btn-primary').first(), 'Add Button');
  addAndOpenButton = new ui.Button(this.buttonsDiv.$$('button.btn.btn-primary').last(), 'Add and Open Button');
  workItemTypeDropdown = new ui.Dropdown(
    this.$('.f8-quickadd__wiblk button.dropdown-toggle'),
    this.$('.f8-quickadd__wiblk .dropdown-menu'),
    'WorkItem Type dropdown'
  );
  constructor(el: ElementFinder, name = 'Work Item Quick Add') {
    super(el, name);
  }

  async ready() {
    await super.ready();
    await this.addAndOpenButton.ready();
  }

  async addWorkItem({ title, description = '', type = 'feature' }: WorkItem) {
    await this.clickWhenReady();
    await this.titleTextInput.ready();
    await this.titleTextInput.enterText(title);
    await this.addAndOpenButton.untilClickable();
    await this.addButton.clickWhenReady();

    // TODO add more confirmation that the item has been added
    this.log('New WorkItem created', `${title} added`);
  }

  async workItemTypes(): Promise<string[]>{
    await this.workItemTypeDropdown.clickWhenReady();
    let array = await this.workItemTypeDropdown.menu.getTextWhenReady();
    // Split array, remove invalid entries and trim the result
    return array.split("\n").reduce<string[]>((filtered ,current) => {
      if(current) {
        filtered.push(current.trim());
      }
      return filtered;
    }, []);
  }
}
