import { Space } from 'ngx-fabric8-wit';
import { Subscription } from 'rxjs/Subscription';
import { cloneDeep } from 'lodash';
import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';

import { AuthenticationService, Broadcaster } from 'ngx-login-client';
import { ArrayCount } from 'ngx-widgets';

import { WorkItem } from '../../models/work-item';
import { WorkItemService } from '../work-item.service';


@Component({
  host: {
     'class': 'app-component flex-container in-column-direction flex-grow-1'
  },
  selector: 'alm-board',
  templateUrl: './work-item-board.component.html',
  styleUrls: ['./work-item-board.component.scss']
})

export class WorkItemBoardComponent implements OnInit {
  workItems: WorkItem[] = [];
  lanes: Array<any> = [];
  loggedIn: Boolean = false;
  spaceSubscription: Subscription;
  contentItemHeight: number = 85;

  constructor(
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private router: Router,
    private workItemService: WorkItemService) {}

  ngOnInit() {
    this.loggedIn = this.auth.isLoggedIn();
    this.getSTates();
    this.spaceSubscription = this.broadcaster.on<Space>('spaceChanged').subscribe(space => {
      if (space) {
        console.log('[WorkItemBoardComponent] New Space selected: ' + space.attributes.name);
        this.getSTates();
      } else {
        console.log('[WorkItemBoardComponent] Space deselected');
        this.lanes = [];
        this.workItemService.resetWorkItemList();
      }
    });
  }

  getWorkItems(pageSize, lane) {
    this.workItemService.getWorkItems(pageSize, [{
      active: true,
      paramKey: 'filter[workitemstate]',
      value: lane.option
    }], true)
      .then(workItems => {
        lane.workItems = workItems;
        lane.nextLink = this.workItemService.getNextLink();
     });
  }

  getSTates() {
    this.workItemService.getStatusOptions()
      .then((response) => {
        this.lanes = response;
        this.lanes.forEach((value, index) => {
          this.lanes[index] = {
            option: value.option,
            workItems: [] as WorkItem[],
            nextLink: null
          };
        });
      });
  }

  initWiItems($event, lane) {
    this.getWorkItems($event.pageSize, lane);
  }

  fetchMoreWiItems(lane) {
    console.log('More for ' + lane.option);
    if (lane.nextLink) {
      this.workItemService.setNextLink(lane.nextLink);
      this.workItemService.getMoreWorkItems()
        .then((items) => {
          lane.workItems = [...lane.workItems, ...items];
          lane.nextLink = this.workItemService.getNextLink();
        });
    } else {
      console.log('No More for ' + lane.option);
    }
  }

  gotoDetail(workItem: WorkItem) {
    let link = [ this.router.url.split('detail')[0] + '/detail/' + workItem.id ];
    this.router.navigate(link);
  }
}
