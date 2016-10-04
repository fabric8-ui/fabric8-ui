import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { Logger } from '../../shared/logger.service';
import { WorkItem } from '../work-item';
import { WorkItemService } from '../work-item.service';


@Component({
  selector: 'work-item-quick-add',
  templateUrl: './work-item-quick-add.component.html',
  styleUrls: ['./work-item-quick-add.component.scss']
})
export class WorkItemQuickAddComponent implements OnInit {
  @Output() close = new EventEmitter();
  error: any = false;
  workItem: WorkItem;
  validTitle: Boolean;

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
    if (this.workItem.fields["system.title"] != null) {
      this.workItem.fields["system.title"] = this.workItem.fields["system.title"].trim();
    }
    if (this.workItem.fields["system.description"] != null) {
      this.workItem.fields["system.description"] = this.workItem.fields["system.description"].trim();
    }
    if (this.workItem.fields["system.title"]) {
      this.workItemService
        .create(this.workItem)
        .then(workItem => {
          this.workItem = workItem; // saved workItem, w/ id if new
          this.logger.log(`created and returned this workitem: ${workItem}`);
          this.workItem.fields["system.description"] = '';
          this.workItem.fields["system.title"] = '';
          this.validTitle = false;
          this.goBack(workItem);
        })
        .catch(error => this.error = error); // TODO: Display error message
    } else {
      this.error = "Title can not be empty.";
    }
  }

  checkTitle(): void {
    if(this.workItem.fields["system.title"] && this.workItem.fields["system.title"].trim()) {
      this.validTitle = true;
    } else {
      this.validTitle = false;
    }
  }

  goBack(savedWorkItem: WorkItem = null): void {
    this.close.emit(savedWorkItem);
    this.ngOnInit();
  }
}