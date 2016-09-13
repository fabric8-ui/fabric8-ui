import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Logger } from '../../shared/logger.service';
import { WorkItem } from '../work-item';
import { WorkItemService } from '../work-item.service';

@Component({
  selector: 'work-item-detail',
  templateUrl: '/work-item-detail.component.html',
  styleUrls: ['/work-item-detail.component.scss']
})
export class WorkItemDetailComponent implements OnInit {
  // @Input()
  workItem: WorkItem;
  // @Output() close = new EventEmitter();
  // error: any;
  // navigated = false; // true if navigated here

  // TODO: These should be read from the WorkitemTypeService
  workItemTypes = ['system.experience', 'system.feature', 'system.userstory', 'system.bug', 'system.fundamental', 'system.valueproposition'];
  // TODO: These should be read from the WorkitemType of the given Workitem
  workItemStates = ['new', 'in progress', 'resolved', 'closed'];

  constructor(
    private workItemService: WorkItemService,
    private route: ActivatedRoute,
    private logger: Logger) {
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        let id = params['id'];
        // this.navigated = true;
        this.workItemService.getWorkItem(id)
          .then(workItem => this.workItem = workItem);
      } else {
        // this.navigated = false;
        this.workItem = new WorkItem();
        this.workItem.fields = {"system.assignee": null, "system.state": 'new', "system.creator": "me", "system.title": null, "system.description": null};
        this.workItem.type = 'system.userstory';
      }
    });
  }

  save(): void {
    this.workItemService
      .update(this.workItem)
      .then(this.goBack);
  }

  // goBack(savedWorkItem: WorkItem = null): void {
  goBack(): void {
    // this.close.emit(savedWorkItem);
    // if (this.navigated) {
      window.history.back();
    // }
  }
}
