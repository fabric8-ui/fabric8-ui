import { 
  animate,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit, 
  trigger, 
  state, 
  style, 
  transition,
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

import { WorkItem }                   from '../../models/work-item';
import { WorkItemListEntryComponent } from './work-item-list-entry/work-item-list-entry.component';
import { WorkItemService }            from '../work-item.service';
import { UserService } from '../../user/user.service';
import { User } from '../../models/user';


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
export class WorkItemListComponent implements OnInit, AfterViewInit {

  @ViewChildren('activeFilters', {read: ElementRef}) activeFiltersRef: QueryList<ElementRef>;
  @ViewChild('activeFiltersDiv') activeFiltersDiv: any;
  @ViewChild('listContainer') listContainer: any;

  workItems: WorkItem[];
  selectedWorkItemEntryComponent: WorkItemListEntryComponent;
  workItemDetail: WorkItem;
  addingWorkItem = false;
  showOverlay : Boolean ;
  loggedIn: Boolean = false;
  showWorkItemDetails: boolean = false;
  panelState: String = 'out';
  contentItemHeight: number = 65;
  pageSize: number = 20;
  filters: any[] = [{
    id:  1,
    name: 'Assign to Me',
    paramKey: 'filter[assginee]',
    active: false,
    value: null
  }];

  constructor(
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private router: Router,
    private workItemService: WorkItemService,
    private logger: Logger,
    private userService: UserService,
    private route: ActivatedRoute) {
      this.subScribeDetailNavigation();
  }

  ngOnInit(): void {
    this.listenToEvents();
    this.loggedIn = this.auth.isLoggedIn();
    this.setFilterValues();
    // console.log('ALL USER DATA', this.route.snapshot.data['allusers']);
    // console.log('AUTH USER DATA', this.route.snapshot.data['authuser']);
  }

  ngAfterViewInit() {
    let oldHeight = 0;
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
    let loggedInUser = cloneDeep(this.route.snapshot.data['authuser']);
    let allUsers = cloneDeep(this.route.snapshot.data['allusers']);
    loggedInUser = allUsers.find((user: User) => user.attributes.imageURL == loggedInUser.imageURL);
    if (loggedInUser) {
      this.filters[0].value = loggedInUser.id;
    }
  }

  activeFilter(filterId: number) {
    let selectedIndex = this.filters.findIndex((f: any) => {
      return f.id === filterId;
    });
    if (selectedIndex > -1) {
      this.filters[selectedIndex].active = true;
    }
    this.loadWorkItems();
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

  deactiveAllFilters(filterId: number) {
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
      .then((newWiItems) => {
        let newItems = cloneDeep(newWiItems);
        // Why on earth did I use splice instead simple concat?
        // To keep the reference of the wotkitem list 
        // Object intact. If we do simple concat it returns 
        // an new value and the old reference is gone 
        // Delete and quick add will not work anymore
        // because now we are dependent on the reference
        // and not using any callback or event listener to
        // Update the list
        newItems.forEach((item: any) => 
          this.workItems.splice(this.workItems.length, this.workItems.length, item)
        );
      })
      .catch((e) => console.log(e));
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
  }
}
