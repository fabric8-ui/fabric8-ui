import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';

import { AuthenticationService } from 'ngx-login-client';

import { WorkItem } from '../../models/work-item';
import { WorkItemService } from '../work-item.service';


@Component({
  selector: 'alm-board',
  templateUrl: './work-item-board.component.html',
  styleUrls: ['./work-item-board.component.scss']
})

export class WorkItemBoardComponent implements OnInit {
  workItems: WorkItem[] = [];
  lanes: Array<any> = [];
  loggedIn: Boolean = false;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private workItemService: WorkItemService) {}

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

  gotoDetail(workItem: WorkItem) {
    let link = ['/work-item/board/detail', workItem.id];
    this.router.navigate(link);
  }
}
