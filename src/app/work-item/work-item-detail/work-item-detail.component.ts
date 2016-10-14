import { Location }               from '@angular/common';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { AlmTrim } from '../../pipes/alm-trim';

import { Logger } from '../../shared/logger.service';

import { WorkItem } from '../work-item';
import { WorkItemService } from '../work-item.service';

@Component({
  selector: 'alm-work-item-detail',
  templateUrl: './work-item-detail.component.html',
  styleUrls: ['./work-item-detail.component.scss']
})

export class WorkItemDetailComponent implements OnInit {  
  workItem: WorkItem;

  // TODO: These should be read from the WorkitemTypeService
  workItemTypes = ['system.experience', 'system.feature', 'system.userstory', 'system.bug', 'system.fundamental', 'system.valueproposition'];
  // TODO: These should be read from the WorkitemType of the given Workitem
  workItemStates = ['new', 'in progress', 'resolved', 'closed'];

  submitted = false;
  active = true;
  
  constructor(
    private workItemService: WorkItemService,
    private route: ActivatedRoute,
    private location: Location,
    private logger: Logger
  ) {}

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        let id = params['id'];
        this.workItemService.getWorkItem(id)
          .then(workItem => this.workItem = workItem);
      } else {
        this.workItem = new WorkItem();
        this.workItem.fields = {'system.assignee': null, 'system.state': 'new', 'system.creator': 'me', 'system.title': null, 'system.description': null};
        this.workItem.type = 'system.userstory';
      }
    });
  }

  save(): void {
    //this.workItem.fields['system.title'] = this.workItem.fields['system.title'].trim();
    if (this.workItem.fields['system.title']) {
      this.workItemService
      .update(this.workItem)
      .then(() => 
        this.goBack());
    } 
  }

  goBack(): void {
    this.location.back();
  }
}



