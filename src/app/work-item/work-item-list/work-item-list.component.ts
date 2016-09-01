import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { Logger } from '../../shared/logger.service';
import { WorkItem } from '../work-item';
import { WorkItemService } from '../work-item.service';

@Component({
  selector: 'work-item-list',
  templateUrl: '/work-item-list.component.html',
  styleUrls: ['/work-item-list.component.css'],
})
export class WorkItemListComponent implements OnInit {
  workItems: WorkItem[];
  selectedWorkItem: WorkItem;
  addingWorkItem = false;

  constructor(
    private router: Router,
    private workItemService: WorkItemService,
    private logger: Logger) {
  }

  getWorkItems(): void {
    this.workItemService
      .getWorkItems()
      .then(workItems => this.workItems = workItems);
  }

  addWorkItem(): void {
    this.addingWorkItem = true;
    this.selectedWorkItem = null;
  }

  close(savedWorkItem: WorkItem) {
    this.addingWorkItem = false;
    if (savedWorkItem) { this.getWorkItems(); }
  }

  deleteWorkItem(workItem: WorkItem): void {
    this.workItemService
      .delete(workItem)
      .then(() => {
        this.workItems = this.workItems.filter(h => h !== workItem);
        if (this.selectedWorkItem === workItem) { this.selectedWorkItem = null; }
      });
  }

  ngOnInit(): void {
    this.getWorkItems();
  }

  onSelect(workItem: WorkItem): void {
    this.selectedWorkItem = workItem;
  }

  gotoDetail(workItem: WorkItem): void {
    this.selectedWorkItem = workItem;
    this.router.navigate(['/detail', this.selectedWorkItem.id]);
  }
}

