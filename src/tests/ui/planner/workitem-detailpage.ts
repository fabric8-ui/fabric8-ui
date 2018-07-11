import * as ui from '../../ui';
import { WorkItemQuickPreview } from './workitem-quickpreview';

export class WorkItemDetailPage extends WorkItemQuickPreview {
  detailPageDiv = new ui.BaseElement(this.$('#wi-detail-form'), 'wi detail page');
  stateToggle = new ui.BaseElement(this.$('#wi-detail-state'), 'WorkItem State toggle');
  stateDropdownDetail = new ui.Dropdown(this.stateToggle, this.$('.open .dropdown-menu'), 'WorkItem State dropdown');

  async changeState(state: string) {
    await this.stateDropdownDetail.clickWhenReady();
    await this.stateDropdownDetail.select(state);
  }
}
