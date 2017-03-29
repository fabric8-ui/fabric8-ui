import { Observable } from 'rxjs/Observable';
import { IterationService } from './../../iteration/iteration.service';
import { IterationModel } from './../../models/iteration.model';
import { Subscription } from 'rxjs/Subscription';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList,
  TemplateRef,
  DoCheck,
  ViewEncapsulation
} from '@angular/core';
import {
  Router,
  ActivatedRoute
} from '@angular/router';

import { TreeNode } from 'angular2-tree-component';

import { cloneDeep } from 'lodash';
import { Broadcaster, Logger } from 'ngx-base';
import {
  AuthenticationService,
  User,
  UserService
} from 'ngx-login-client';
import { Space, Spaces } from 'ngx-fabric8-wit';

import { WorkItem } from '../../models/work-item';
import { WorkItemType }               from '../../models/work-item-type';
import { WorkItemListEntryComponent } from './work-item-list-entry/work-item-list-entry.component';
import { WorkItemService }            from '../work-item.service';

import { TreeListComponent } from 'ngx-widgets';

@Component({
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    'class': 'app-component height-100 flex-container in-column-direction flex-grow-1'
  },
  selector: 'alm-work-item-list',
  templateUrl: './work-item-list.component.html',
  styleUrls: ['./work-item-list.component.scss']
})
export class WorkItemListComponent implements OnInit, AfterViewInit, DoCheck {

  @ViewChildren('activeFilters', {read: ElementRef}) activeFiltersRef: QueryList<ElementRef>;
  @ViewChild('activeFiltersDiv') activeFiltersDiv: any;

  @ViewChild('listContainer') listContainer: any;
  @ViewChild('treeList') treeList: TreeListComponent;
  @ViewChild('treeListItemTemplate') treeListItemTemplate: TemplateRef<any>;
  @ViewChild('treeListLoadTemplate') treeListLoadTemplate: TemplateRef<any>;
  @ViewChild('treeListTemplate') treeListTemplate: TemplateRef<any>;

  @ViewChild('treeListItem') treeListItem: TreeListComponent;

  workItems: WorkItem[] = [];
  prevWorkItemLength: number = 0;
  workItemTypes: WorkItemType[] = [];
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
  private spaceSubscription: Subscription = null;
  private iterations: IterationModel[] = [];
  private nextLink: string = '';

  // See: https://angular2-tree.readme.io/docs/options
  treeListOptions = {
    allowDrag: false,
    getChildren: (node: TreeNode): any => {
      return this.workItemService.getChildren(node.data);
    },
    levelPadding: 30,
    allowDrop: (element, to) => {
      // return true / false based on element, to.parent, to.index. e.g.
      return to.parent.hasChildren;
    }
  };

  constructor(
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private router: Router,
    private user: UserService,
    private workItemService: WorkItemService,
    private logger: Logger,
    private userService: UserService,
    private route: ActivatedRoute,
    private spaces: Spaces,
    private iterationService: IterationService) {}

  ngOnInit(): void {
    this.listenToEvents();
    this.loggedIn = this.auth.isLoggedIn();
    // console.log('AUTH USER DATA', this.route.snapshot.data['authuser']);
    if (this.loggedIn) {
      this.treeListOptions['allowDrag'] = true;
    }
    this.spaceSubscription = this.spaces.current.subscribe(space => {
      if (space) {
        console.log('[WorkItemListComponent] New Space selected: ' + space.attributes.name);
        this.loadWorkItems();
        this.workItemService.resetWorkItemList();
      } else {
        console.log('[WorkItemListComponent] Space deselected');
        this.workItems = [];
        this.workItemService.resetWorkItemList();
      }
    });
  }

  ngAfterViewInit() {
    let oldHeight = 0;
    this.authUser = cloneDeep(this.route.snapshot.data['authuser']);
  }

  ngDoCheck() {
    if (this.workItems.length != this.prevWorkItemLength) {
      this.treeList.updateTree();
      this.prevWorkItemLength = this.workItems.length;
    }
  }

  // model handlers

  initWiItems(event: any): void {
    this.pageSize = event.pageSize;
    this.loadWorkItems();
  }


  loadWorkItems(): void {
    Observable.combineLatest(
      this.iterationService.getIterations(),
      this.userService.getAllUsers(),
      this.workItemService.getWorkItemTypes(),
      this.workItemService.getWorkItems(this.pageSize, this.filters)
    ).map((items) => {
      return items;
    })
    .subscribe(([iterations, users, wiTypes, workItemResp]) => {
      this.allUsers = users;
      this.iterations = iterations;
      this.workItemTypes = wiTypes;
      const workItems = workItemResp.workItems;
      this.nextLink = workItemResp.nextLink;
      this.workItems = this.workItemService.resolveWorkItems(
        workItems,
        this.iterations,
        this.allUsers,
        this.workItemTypes
      );
    });
  }

  fetchMoreWiItems(): void {
    this.workItemService
      .getMoreWorkItems(this.nextLink)
      .subscribe((newWiItemResp) => {
        const workItems = newWiItemResp.workItems;
        this.nextLink = newWiItemResp.nextLink;
        this.workItems = [
          ...this.workItems,
          // Returns an array of resolved work items
          ...this.workItemService.resolveWorkItems(
            workItems,
            this.iterations,
            this.allUsers,
            this.workItemTypes
          )
        ];
        this.treeList.updateTree();
      },
      (e) => console.log(e));
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

  onCreateWorkItem(workItem) {
    let resolveItem = this.workItemService.resolveWorkItems(
      [workItem],
      this.iterations,
      this.allUsers,
      this.workItemTypes
    );
    this.workItems = [...resolveItem, ...this.workItems];
  }

  onMoveSelectedToTop(): void{
    this.workItemDetail = this.workItemToMove.getWorkItem();
    this.workItemService.moveItem(this.workItemDetail, 'top').then(() => {
      this.treeList.updateTree();
      this.listContainer.nativeElement.scrollTop = 0;
    });
  }

  onMoveSelectedToBottom(): void{
    this.workItemDetail = this.workItemToMove.getWorkItem();
    this.workItemService.moveItem(this.workItemDetail, 'bottom').then(() => {
      this.treeList.updateTree();
      this.listContainer.nativeElement.scrollTop = this.workItems.length * this.contentItemHeight;
    });
  }

  onMoveToTop(entryComponent: WorkItemListEntryComponent): void {
    this.workItemDetail = entryComponent.getWorkItem();
    this.workItemService.moveItem(this.workItemDetail, 'top')
    .then(() => {
      this.treeList.updateTree();
      this.listContainer.nativeElement.scrollTop = 0;
    });
  }

  onMoveToBottom(entryComponent: WorkItemListEntryComponent): void {
    this.workItemDetail = entryComponent.getWorkItem();
    this.workItemService.moveItem(this.workItemDetail, 'bottom')
    .then(() => {
      this.treeList.updateTree();
      this.listContainer.nativeElement.scrollTop = this.workItems.length * this.contentItemHeight;
    });
  }

  onMoveUp(): void {
    this.workItemDetail = this.workItemToMove.getWorkItem();
    this.workItemService.moveItem(this.workItemDetail, 'up');
    this.treeList.updateTree();
  }

  onMoveDown(): void {
    this.workItemDetail = this.workItemToMove.getWorkItem();
    this.workItemService.moveItem(this.workItemDetail, 'down');
    this.treeList.updateTree();
  }

  listenToEvents() {
    this.broadcaster.on<string>('logout')
      .subscribe(message => {
        this.loggedIn = false;
        this.authUser = null;
        this.treeListOptions['allowDrag'] = false;
    });
    //Filters like assign to me should stack with the current filters
    this.broadcaster.on<string>('item_filter')
      .subscribe((filters: any) => {
        this.filters = this.filters.concat(filters);
        this.loadWorkItems();
    });
    //Filters like iteration should clear the previous filter
    //and then set the current selected value
    this.broadcaster.on<string>('unique_filter')
      .subscribe((filters: any) => {
        //this.filters = this.filters.filter(item => item.paramKey !== filters[0].paramKey);
        //this.filters = this.filters.concat(filters);
        //clear top filters
        this.filters = filters;
        this.loadWorkItems();
    });
    this.broadcaster.on<string>('move_item')
      .subscribe((moveto: string) => {
        switch (moveto){
          case 'up':
            this.onMoveUp();
            break;
          case 'down':
            this.onMoveDown();
            break;
          case 'top':
            this.onMoveSelectedToTop();
            break;
          case 'bottom':
            this.onMoveSelectedToBottom();
            break;
          default:
            break;
        }
    });

    this.broadcaster.on<string>('updateWorkItem')
      .subscribe((workItem: string) => {
        let updatedItem = JSON.parse(workItem) as WorkItem;
        let index = this.workItems.findIndex((item) => item.id === updatedItem.id);
        if (index > -1) {
          this.workItems[index] = updatedItem;
          this.treeList.updateTree();
        }
      });

    this.broadcaster.on<string>('addWorkItem')
      .subscribe((workItem: string) => {
        let newItem = JSON.parse(workItem) as WorkItem;
        this.workItems.splice(0, 0, newItem);
        this.treeList.updateTree();
      });
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
    // this.workItemService.reOrderWorkItem(workItemId);
  }

  onMoveNode($event) {
    let movedWI = $event.node;
    let prevWI = $event.to.parent.children[$event.to.index - 1];
    let nextWI = $event.to.parent.children[$event.to.index + 1];

    if (typeof prevWI !== 'undefined') {
      this.workItemService.reOrderWorkItem(movedWI.id, prevWI.id, 'below')
          .then((workItem) => {
            this.workItems.find((item) => item.id === movedWI.id).attributes['version'] = workItem.attributes['version'];
            this.workItemService.buildWorkItemIdIndexMap();
          });
    }
    else {
      this.workItemService.reOrderWorkItem(movedWI.id, nextWI.id, 'above')
          .then((workItem) => {
            this.workItems.find((item) => item.id === movedWI.id).attributes['version'] = workItem.attributes['version'];
            this.workItemService.buildWorkItemIdIndexMap();
          });
    }
  }
}
