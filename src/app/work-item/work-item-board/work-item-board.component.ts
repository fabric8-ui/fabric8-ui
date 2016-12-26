import { Response } from '@angular/http';
import {
  Component,
  OnInit,
  animate,
  trigger,
  state,
  style,
  transition
} from '@angular/core';
import { Router }            from '@angular/router';

import { WorkItem } from './../../models/work-item';
import { WorkItemService } from './../work-item.service';

import { AuthenticationService } from './../../auth/authentication.service';

@Component({
  selector: 'alm-board',
  templateUrl: './work-item-board.component.html',
  styleUrls: ['./work-item-board.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(0)'
      })),
      state('out', style({
        transform: 'translateX(100%)'
      })),
      transition('in => out', animate('300ms ease-in-out')),
      transition('out => in', animate('500ms ease-in-out'))
    ]),
  ]
})

export class WorkItemBoardComponent implements OnInit {
  workItems: WorkItem[] = [];
  lanes: Array<any> = [];
  loggedIn: Boolean = false;
  panelState: String = 'out';

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private workItemService: WorkItemService) {
      this.subScribeDetailNavigation();
  }

  ngOnInit() {
    this.loggedIn = this.auth.isLoggedIn();
    this.workItemService.getWorkItems()
      .then(workItems => {
        this.workItems = workItems;
        // console.log(this.workItems);
        // need push lane data here once the backend data is available
        /*this.lanes.push({title: 'Backlog', cards: workItems});
        this.lanes.push({title: 'In-Progress', cards: [{'id': 211, fields: {'system.title': 'Item A'}}, {'id': 212, fields: {'system.title': 'Item B'}}, {'id': 213, fields: {'system.title': 'Item C'}}, {'id': 214, fields: {'system.title': 'Item D'}}]});
        this.lanes.push({title: 'Done', cards: [{'id': 311, fields: {'system.title': 'Item 1'}}, {'id': 312, fields: {'system.title': 'Item 2'}}, {'id': 313, fields: {'system.title': 'Item 3'}}, {'id': 314, fields: {'system.title': 'Item 4'}}]});*/
     });
     this.workItemService.getStatusOptions()
      .then((response) => {
        this.lanes = response;
      });
  }

  // Event listener for URL change
  // On change to details page slide out the layover
  // On change back to home slide in layover
  subScribeDetailNavigation(): void {
    this.router.events.subscribe((val: any) => {
      if (val.id == 1 && val.url.indexOf('detail') > -1) {
        this.panelState = 'in';
      }
      if (val.id > 1) {
        if (val.url.indexOf('detail') > -1) {
          this.panelState = 'in';
        } else {
          // this.broadcaster.broadcast('activeWorkItem', 0);
          this.panelState = 'out';
        }
      }
    });
  }

  gotoDetail(workItem: WorkItem) {
    let link = ['/work-item-board/detail', workItem.id];
    this.router.navigate(link);
  }
}
