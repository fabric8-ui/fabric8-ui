import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { Logger } from '../../shared/logger.service';
import { WorkItem } from '../work-item';
import { WorkItemService } from '../work-item.service';

@Component({
  selector: 'work-item-quick-add',
  templateUrl: '/work-item-quick-add.component.html',
  styleUrls: ['/work-item-quick-add.component.scss']
})
export class WorkItemQuickAddComponent implements OnInit {
  @Output() close = new EventEmitter();
  error: any = false;
  workItem: WorkItem;

  constructor(
    private workItemService: WorkItemService,
    private logger: Logger) {
  }

  ngOnInit(): void {
    this.workItem = {
      "fields": {
        "system.assignee": null,
        "system.state": "new",
        "system.creator": "me",
        "system.title": null,
        "system.description": null
      },
      "type": "system.userstory",
      "version": 0
    } as WorkItem;
  }

  save(): void {
    if (this.workItem.fields["system.title"]) {
      this.workItemService
        .create(this.workItem)
        .then(workItem => {
          this.workItem = workItem; // saved workItem, w/ id if new
          this.logger.log(`created and returned this workitem: ${workItem}`);
          this.goBack(workItem);
        })
        .catch(error => this.error = error); // TODO: Display error message
    }
  }

  goBack(savedWorkItem: WorkItem = null): void {
    this.close.emit(savedWorkItem);
    this.ngOnInit();
  }
}
