import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { Logger } from '../../shared/logger.service';
import { WorkItem } from '../work-item';
import { WorkItemService } from '../work-item.service';
import { WorkItemDetailComponent } from '../work-item-detail/work-item-detail.component';
import { WorkItemQuickAddComponent } from '../work-item-quick-add/work-item-quick-add.component';

@Component({
  selector: 'work-item-list',
  templateUrl: '/work-item-list.component.html',
  styleUrls: ['/work-item-list.component.css'],
  directives: [WorkItemDetailComponent, WorkItemQuickAddComponent]
})
export class WorkItemListComponent implements OnInit {
  workItems: WorkItem[];
  selectedWorkItem: WorkItem;
  addingWorkItem = false;
  error: any;

  constructor(
    private router: Router,
    private workItemService: WorkItemService,
    private logger: Logger) {
  }

  getWorkItems() {
    this.workItemService.getWorkItems().then(workItems => this.workItems = workItems);
  }

  ngOnInit() {
    this.getWorkItems();
  }

  onSelect(workItem: WorkItem) {
	  	this.selectedWorkItem = workItem;
  		//workItem.isExpanded = workItem.isExpanded ? !workItem.isExpanded : true;
  }

  gotoDetails(workItem: WorkItem) {
	event.stopPropagation();
	this.selectedWorkItem = workItem;
    this.router.navigate(['/detail', this.selectedWorkItem.id]);

  }

  addWorkItem() {
    this.addingWorkItem = true;
    this.selectedWorkItem = null;
  }

  close(savedWorkItem: WorkItem) {
    this.addingWorkItem = false;
    if (savedWorkItem) { this.getWorkItems(); }
  }

  deleteWorkItem(workItem: WorkItem, event: any) {
    event.stopPropagation();
    this.workItemService
      .delete(workItem)
      .then(res => {
        this.workItems = this.workItems.filter(h => h !== workItem);
        if (this.selectedWorkItem === workItem) { this.selectedWorkItem = null; }
      })
      .catch(error => this.error = error);
  }
}

