import { ElementFinder } from 'protractor';
import { WorkItemQuickPreview } from './workitem-quickpreview';
import * as ui from '../../ui';

export class Iteration extends ui.BaseElement {

  iterationDialog = new ui.BaseElement(this.$('.modal-content'),'iteration Dialog');
  iterationName = new ui.TextInput(this.iterationDialog.$('#iteration-name'),'Iteration text input');
  parentIteration = new ui.TextInput(this.iterationDialog.$('#parent-iteration'),'parent iteration');
  parentDropdown = new ui.Dropdown(
   this.parentIteration,
   this.iterationDialog.$('.f8-iteration-modal-list'),
   'parent iteration dropdown'
  );
  createIterationButton = new ui.Button(this.iterationDialog.$('#create-iteration-button'),'Create Iteration button');

  async addNewIteration(iterationName: string, parentIteration: string ) {
    await this.iterationName.enterText(iterationName);
    await this.parentIteration.enterText(parentIteration);
    await this.parentDropdown.select(parentIteration);
    await this.createIterationButton.clickWhenReady();
  }

  async editIteration(iterationName: string) {
    await this.iterationName.enterText(iterationName);
    await this.createIterationButton.clickWhenReady();
  }
}