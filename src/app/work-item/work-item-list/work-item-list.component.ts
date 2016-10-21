import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { AuthenticationService } from './../../auth/authentication.service';
import { Broadcaster } from './../../shared/broadcaster.service';
import { Logger } from '../../shared/logger.service';

import { WorkItem }                   from '../work-item';
import { WorkItemListEntryComponent } from '../work-item-list-entry/work-item-list-entry.component';
import { WorkItemService }            from '../work-item.service';

@Component({  
  selector: 'alm-work-item-list',
  templateUrl: './work-item-list.component.html',
  styleUrls: ['./work-item-list.component.scss'],
})
export class WorkItemListComponent implements OnInit {

  workItems: WorkItem[];
  selectedWorkItemEntryComponent: WorkItemListEntryComponent;
  addingWorkItem = false;
  showOverlay : Boolean ;
  loggedIn: Boolean = false;

  constructor(
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private router: Router,
    private workItemService: WorkItemService,
    private logger: Logger) {
  }

  ngOnInit(): void {
    this.listenToEvents();
    this.reloadWorkItems();
    this.loggedIn = this.auth.isLoggedIn();
  }

  // model handlers

  reloadWorkItems(): void {
    this.workItemService
      .getWorkItems()
      .then((wItems) => {
        return wItems.reverse();
      })
      .then((wItems) => {
        this.workItemService
        .getStatusOptions()
        .then((options) => {
          this.workItems = wItems.map((item) => {
            item.selectedState = this.workItemService.getSelectedState(item, options);
            return item;
          });
        });
      });
  }

  addWorkItem(): void {
    this.addingWorkItem = true;
    this.selectedWorkItemEntryComponent = null;
  }

  close(savedWorkItem: WorkItem) {
    this.addingWorkItem = false;
    if (savedWorkItem) { this.reloadWorkItems(); }
  }

  // event handlers
  
  onSelect(entryComponent: WorkItemListEntryComponent): void {
    let workItem: WorkItem = entryComponent.getWorkItem();
    // de-select prior selected element (if any)
    if (this.selectedWorkItemEntryComponent && this.selectedWorkItemEntryComponent != entryComponent)
      this.selectedWorkItemEntryComponent.deselect();
    // select new component
    entryComponent.select();
    this.selectedWorkItemEntryComponent = entryComponent;
  }

  onDetail(entryComponent: WorkItemListEntryComponent): void {
    let workItem: WorkItem = entryComponent.getWorkItem();
    // clicking on detail always also selects an entry
    this.onSelect(entryComponent);
    this.router.navigate(['/detail', workItem.id]);
  }

  onDelete(entryComponent: WorkItemListEntryComponent): void {
    this.reloadWorkItems();
  }

  listenToEvents() {
    this.broadcaster.on<string>('logout')
      .subscribe(message => {
        this.loggedIn = false;
    });
  }
}
