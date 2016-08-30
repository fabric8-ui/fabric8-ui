import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Logger } from '../../shared/logger.service';
import { WorkItem } from '../work-item';
import { WorkItemService } from '../work-item.service';

@Component({
  selector: 'work-item-quick-add',
  templateUrl: '/work-item-quick-add.component.html',
  styleUrls: ['/work-item-quick-add.component.css']
})
export class WorkItemQuickAddComponent implements OnInit {
  @Input() workItem: WorkItem;
  @Output() close = new EventEmitter();
  error: any;
  navigated = false; // true if navigated here

  constructor(
    private workItemService: WorkItemService,
    private route: ActivatedRoute,
    private logger: Logger) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        let id = +params['id'];
        this.navigated = true;
        this.workItemService.getWorkItem(id)
          .then(workItem => this.workItem = workItem);
      } else {
        this.navigated = false;
        this.workItem = new WorkItem();
        this.workItem.fields = {"system.owner": 'me', "system.state": 'new'};
        this.workItem.type = '1';
      }
    });
  }

  save() {
    this.workItemService
      .save(this.workItem)
      .then(workItem => {
        this.workItem = workItem; // saved workItem, w/ id if new
        this.logger.log(`created and returned this workitem: ${workItem}`);
        this.goBack(workItem);
      })
      .catch(error => this.error = error); // TODO: Display error message
  }

  goBack(savedWorkItem: WorkItem = null) {
    this.close.emit(savedWorkItem);
    if (this.navigated) { window.history.back(); }
  }
}
