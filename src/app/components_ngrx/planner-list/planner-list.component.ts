import {
  Component,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': ''
  },
  selector: 'alm-work-item-list',
  templateUrl: './planner-list.component.html',
  styleUrls: ['./planner-list.component.less']
})
export class PlannerListComponent {
  private uiLockedAll: boolean = false;
  private sidePanelOpen: boolean = true;

  @ViewChild('plannerLayout') plannerLayout: any;

  constructor() {}

  togglePanelState(event) {
    console.log(event);
  }

  togglePanel() {
    this.plannerLayout.toggleSidePanel();
  }
}
