import { $, browser } from 'protractor';
import { AppPage } from '../app.page';
import * as planner from './../../ui/planner';
import * as support from './../../support';

// this is what you see when you click on the Plan Tab button
export class PlannerPage extends AppPage {
  workItemList = new planner.WorkItemList($('alm-work-item-list'));
  quickAdd =  new planner.WorkItemQuickAdd($('alm-work-item-quick-add'));
  sidePanel = new planner.SidePanel($('aside.f8-sidepanel'));
  quickPreview = new planner.WorkItemQuickPreview($('work-item-preview'));

  constructor(url: string){
    super();
    this.url = url;
    this.openInBrowser();
  }

  async ready() {
    support.debug(' ... check if Planner page is Ready');
    await super.ready();
    await this.workItemList.ready();
    await this.quickAdd.ready();
    await this.sidePanel.ready();
    support.debug(' ... check if Planner page is Ready - OK');
  }

  async createWorkItem(item: planner.WorkItem) {
    this.debug('create item', JSON.stringify(item));
    await this.quickAdd.addWorkItem(item);
  }

}
