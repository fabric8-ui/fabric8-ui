import { UserService } from 'ngx-login-client';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';


import { Broadcaster } from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';

import { DummyService } from './../shared/dummy.service';


// TODO HACKED IMPORTS
import { WorkItemService } from 'fabric8-planner/src/app/work-item/work-item.service';
import { WorkItem } from 'fabric8-planner/src/app/models/work-item';


class WorkItemFilter {

  paramKey: string;
  value: string;
  active: boolean;

}

@Component({
  selector: 'fabric8-create-work-item-widget',
  templateUrl: './create-work-item-widget.component.html',
  styleUrls: ['./create-work-item-widget.component.scss']
})
export class CreateWorkItemWidgetComponent implements OnInit {

  myWorkItems: Observable<WorkItem[]>;

  constructor(
    private context: Contexts,
    private broadcaster: Broadcaster,
    private workItemService: WorkItemService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.myWorkItems = this.userService.loggedInUser
      .map(user => [{
      paramKey: 'filter[assignee]',
      value: user.id,
      active: true
    }])
    .switchMap(filters => this.workItemService.getWorkItems(100000, filters)).map(val => val.workItems);
  }

}
