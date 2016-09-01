import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Logger } from '../../shared/logger.service';
import { WorkItem } from '../work-item';
import { WorkItemService } from '../work-item.service';

@Component({
  selector: 'work-item-detail',
  templateUrl: '/work-item-detail.component.html',
  styleUrls: ['/work-item-detail.component.css']
})
export class WorkItemDetailComponent implements OnInit {
  // @Input()
  workItem: WorkItem;
  // @Output() close = new EventEmitter();
  // error: any;
  // navigated = false; // true if navigated here

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
        this.workItem.fields = {"system.owner": 'me', "system.state": 'new'};
        this.workItem.type = '1';
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
