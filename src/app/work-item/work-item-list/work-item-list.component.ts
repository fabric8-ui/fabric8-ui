import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { Router }            from '@angular/router';

import { AuthenticationService } from './../../auth/authentication.service';
import { Broadcaster } from './../../shared/broadcaster.service';
import { Logger } from '../../shared/logger.service';

import { WorkItem }                   from '../work-item';
import { WorkItemListEntryComponent } from './work-item-list-entry/work-item-list-entry.component';
import { WorkItemService }            from '../work-item.service';

@Component({
  selector: 'alm-work-item-list',
  templateUrl: './work-item-list.component.html',
  styleUrls: ['./work-item-list.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(0)'
      })),
      state('out', style({
        transform: 'translateX(100%)'
      })),
      transition('in => out', animate('300ms ease-in-out')),
      transition('out => in', animate('500ms ease-in-out'))
    ]),
  ]
})
export class WorkItemListComponent implements OnInit {

  workItems: WorkItem[];
  selectedWorkItemEntryComponent: WorkItemListEntryComponent;
  workItemDetail: WorkItem;
  addingWorkItem = false;
  showOverlay : Boolean ;
  loggedIn: Boolean = false;
  showWorkItemDetails: boolean = false;
  panelState: String = 'out';

  constructor(
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private router: Router,
    private workItemService: WorkItemService,
    private logger: Logger) {
      this.subScribeDetailNavigation();
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
        this.workItems = wItems;
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
    this.workItemDetail = entryComponent.getWorkItem();    
    this.onSelect(entryComponent);
    this.showWorkItemDetails = true; 
  }

  onDelete(entryComponent: WorkItemListEntryComponent): void {
    this.reloadWorkItems();
  }

  onMoveToTop(entryComponent: WorkItemListEntryComponent): void {    
    this.workItemDetail = entryComponent.getWorkItem();
    this.workItemService.moveItem(this.workItemDetail, 'top');  
  }

  onMoveToBottom(entryComponent: WorkItemListEntryComponent): void {    
    this.workItemDetail = entryComponent.getWorkItem();
    this.workItemService.moveItem(this.workItemDetail, 'bottom');  
  }

  // Event listener for URL change 
  // On change to details page slide out the layover
  // On change back to home slide in layover
  subScribeDetailNavigation(): void {
    this.router.events.subscribe((val: any) => {
      if (val.id == 1 && val.url.indexOf('detail') > -1) {
        this.panelState = 'in';
      }
      if (val.id > 1) {
        if (val.url.indexOf('detail') > -1) {
          this.panelState = 'in';
        } else {
          this.broadcaster.broadcast('activeWorkItem', 0);
          this.panelState = 'out';
        }
      }
    });
  }

  listenToEvents() {
    this.broadcaster.on<string>('logout')
      .subscribe(message => {
        this.loggedIn = false;
    });
    this.broadcaster.on<string>('updateWorkItem')
      .subscribe((data) => {
        let wi: any = data as any;
        let workItemIndex = this.workItems.findIndex(item => {
          return item.id == wi.id;
        });
        this.workItems[workItemIndex] = wi as WorkItem;
    });
  }
}
