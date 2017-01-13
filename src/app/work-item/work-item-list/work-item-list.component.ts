import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList
} from '@angular/core';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import { cloneDeep } from 'lodash';

import { AuthenticationService } from '../../auth/authentication.service';
import { Broadcaster } from '../../shared/broadcaster.service';
import { Logger } from '../../shared/logger.service';

import { WorkItem } from '../../models/work-item';
import { WorkItemType }               from '../work-item-type';
import { WorkItemListEntryComponent } from './work-item-list-entry/work-item-list-entry.component';
import { WorkItemService }            from '../work-item.service';
import { UserService } from '../../user/user.service';
import { User } from '../../models/user';


@Component({
  selector: 'alm-work-item-list',
  templateUrl: './work-item-list.component.html',
  styleUrls: ['./work-item-list.component.scss']
})
export class WorkItemListComponent implements OnInit, AfterViewInit {

  @ViewChildren('activeFilters', {read: ElementRef}) activeFiltersRef: QueryList<ElementRef>;
  @ViewChild('activeFiltersDiv') activeFiltersDiv: any;
  @ViewChild('listContainer') listContainer: any;

  workItems: WorkItem[];
  workItemTypes: WorkItemType[];
  selectedWorkItemEntryComponent: WorkItemListEntryComponent;
  workItemToMove: WorkItemListEntryComponent;
  workItemDetail: WorkItem;
  addingWorkItem = false;
  showOverlay : Boolean ;
  loggedIn: Boolean = false;
  showWorkItemDetails: boolean = false;
  contentItemHeight: number = 67;
  pageSize: number = 20;
  filters: any[] = [];
  allUsers: User[] = [] as User[];
  authUser: any = null;
  showTypesOptions: Boolean = false;

  constructor(
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private router: Router,
    private user: UserService,
    private workItemService: WorkItemService,
    private logger: Logger,
    private userService: UserService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.listenToEvents();
    this.loggedIn = this.auth.isLoggedIn();
    // console.log('ALL USER DATA', this.route.snapshot.data['allusers']);
    // console.log('AUTH USER DATA', this.route.snapshot.data['authuser']);
    this.getWorkItemTypes();
  }

  ngAfterViewInit() {
    let oldHeight = 0;
    this.allUsers = cloneDeep(this.route.snapshot.data['allusers']) as User[];
    this.authUser = cloneDeep(this.route.snapshot.data['authuser']);
    this.setFilterValues();
    this.activeFiltersRef.changes.subscribe((item) => {
      let newElHeight = this.activeFiltersDiv.nativeElement.offsetHeight;
      let listCurrentHeight = this.listContainer.nativeElement.offsetHeight;
      if (newElHeight) {
        oldHeight = listCurrentHeight;
        this.listContainer.nativeElement.style.height =
          listCurrentHeight - newElHeight;
      } else {
        this.listContainer.nativeElement.style.height =
          oldHeight;
      }
    });
  }

  setFilterValues() {
    if (this.loggedIn) {
      this.filters.push({
        id:  1,
        name: 'Assigned to me',
        paramKey: 'filter[assignee]',
        active: false,
        value: this.authUser.id
      });
    } else {
      let index = this.filters.findIndex(item => item.id === 1);
      this.filters.splice(index, 1);
    }
  }

  activeFilter(filterId: number) {
    if (this.loggedIn) {
      let selectedIndex = this.filters.findIndex((f: any) => {
        return f.id === filterId;
      });
      if (selectedIndex > -1) {
        this.filters[selectedIndex].active = true;
      }
      this.loadWorkItems();
    }
  }

  deactiveFilter(filterId: number) {
    let selectedIndex = this.filters.findIndex((f: any) => {
      return f.id == filterId;
    });
    if (selectedIndex > -1) {
      this.filters[selectedIndex].active = false;
    }
    this.loadWorkItems();
  }

  deactiveAllFilters() {
    this.filters.forEach((f: any) => {
      f.active = false;
    });
    this.loadWorkItems();
  }

  // model handlers

  initWiItems(event: any): void {
    this.pageSize = event.pageSize;
    this.loadWorkItems();
  }

  loadWorkItems(): void {
    this.workItemService
      .getWorkItems(this.pageSize, this.filters)
      .then((wItems) => {
        this.workItems = wItems;
      });
  }

  fetchMoreWiItems(): void {
    this.workItemService
      .getMoreWorkItems()
      .then((newWiItems) => {})
      .catch ((e) => console.log(e));
  }

  // event handlers
  onToggle(entryComponent: WorkItemListEntryComponent): void {
    // This condition is to select a single work item for movement
    // deselect the previous checked work item
    if (this.workItemToMove) {
      this.workItemToMove.uncheck();
    }
    if (this.workItemToMove == entryComponent) {
      this.workItemToMove = null;
    } else {
      entryComponent.check();
      this.workItemToMove = entryComponent;
    }
  }

  onSelect(entryComponent: WorkItemListEntryComponent): void {
    let workItem: WorkItem = entryComponent.getWorkItem();
    // de-select prior selected element (if any)
    if (this.selectedWorkItemEntryComponent && this.selectedWorkItemEntryComponent != entryComponent) {
      this.selectedWorkItemEntryComponent.deselect();
    }
    // select new component
    entryComponent.select();
    this.selectedWorkItemEntryComponent = entryComponent;
  }

  onDetail(entryComponent: WorkItemListEntryComponent): void {
    this.workItemDetail = entryComponent.getWorkItem();
    this.onSelect(entryComponent);
    this.showWorkItemDetails = true;
  }

  onMoveToTop(entryComponent: WorkItemListEntryComponent): void {
    this.workItemDetail = entryComponent.getWorkItem();
    this.workItemService.moveItem(this.workItemDetail, 'top')
    .then(() => {
      this.listContainer.nativeElement.scrollTop = 0;
    });
  }

  onMoveToBottom(entryComponent: WorkItemListEntryComponent): void {
    this.workItemDetail = entryComponent.getWorkItem();
    this.workItemService.moveItem(this.workItemDetail, 'bottom')
    .then(() => {
      this.listContainer.nativeElement.scrollTop = this.workItems.length * this.contentItemHeight;
    });
  }

  onMoveUp(): void {
    this.workItemDetail = this.workItemToMove.getWorkItem();
    this.workItemService.moveItem(this.workItemDetail, 'up');
  }

  onMoveDown(): void {
    this.workItemDetail = this.workItemToMove.getWorkItem();
    this.workItemService.moveItem(this.workItemDetail, 'down');
  }

  listenToEvents() {
    this.broadcaster.on<string>('logout')
      .subscribe(message => {
        this.loggedIn = false;
        this.deactiveAllFilters();
        this.authUser = null;
        this.setFilterValues();
    });
  }

  //Detailed add functions
  getWorkItemTypes(){
    this.workItemService.getWorkItemTypes()
      .then((types) => {
        this.workItemTypes = types;
      });
  }
  showTypes() {
    this.showTypesOptions = true;
  }
  closePanel() {
    this.showTypesOptions = false;
  }
  onChangeType(type: string) {
    this.showTypesOptions = false;
    this.router.navigate(['/work-item-list/detail/new?' + type]);
  }

  onDragStart() {
    //console.log('on drag start');
  }

  // Event listener for WI drop.
  onDragEnd(workItemId: string) {
    // rearrange is happening inside ng2-dnd library

    // Build the ID-index map after rearrange.
    this.workItemService.buildWorkItemIdIndexMap();

    // save the order of work item.
    this.workItemService.reOrderWorkItem(workItemId)
        .catch(e => console.log(e));
  }
}
