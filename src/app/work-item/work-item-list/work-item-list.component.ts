import { AreaModel } from './../../models/area.model';
import { AreaService } from './../../area/area.service';
import { FilterService } from './../../shared/filter.service';
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
  OnDestroy,
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
export class WorkItemListComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {

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
  eventListeners: any[] = [];
  private spaceSubscription: Subscription = null;
  private iterations: IterationModel[] = [];
  private areas: AreaModel[] = [];
  private nextLink: string = '';
  private wiSubscriber: any = null;
  private allowedFilterParams: string[] = ['iteration'];
  private urlListener: any = null;
  private loggedInUser: User | Object = {};
  private appliedIterationFilter: string = '';

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
    private iterationService: IterationService,
    private filterService: FilterService,
    private areaService: AreaService) {}

  ngOnInit(): void {
    this.listenToEvents();
    this.loggedIn = this.auth.isLoggedIn();
    // console.log('AUTH USER DATA', this.route.snapshot.data['authuser']);
    if (this.loggedIn) {
      this.treeListOptions['allowDrag'] = true;
    }
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

  ngOnDestroy() {
    console.log('Destroying all the listeners in list component');
    this.eventListeners.forEach(subscriber => subscriber.unsubscribe());
    this.spaceSubscription.unsubscribe();
    this.urlListener.unsubscribe();
  }

  // model handlers

  initWiItems(event: any): void {
    this.pageSize = event.pageSize;
    this.spaceSubscription = this.spaces.current.subscribe(space => {
      if (space) {
        console.log('[WorkItemListComponent] New Space selected: ' + space.attributes.name);
        this.workItemService.resetWorkItemList();
        this.loadWorkItems();
      } else {
        console.log('[WorkItemListComponent] Space deselected');
        this.workItems = [];
        this.workItemService.resetWorkItemList();
      }
    });
  }


  loadWorkItems(): void {
    if (this.wiSubscriber) {
      this.wiSubscriber.unsubscribe();
    }
    this.wiSubscriber = Observable.combineLatest(
      this.iterationService.getIterations(),
      this.userService.getAllUsers(),
      this.workItemService.getWorkItemTypes(),
      this.areaService.getAreas(),
      this.userService.getUser().catch(err => Observable.of({})),
    ).do((items) => {
      const iterations = items[0];
      this.allUsers = items[1];
      this.iterations = items[0];
      this.workItemTypes = items[2];
      this.areas = items[3];
      this.loggedInUser = items[4];

      // If there is an iteration filter on the URL
      const queryParams = this.route.snapshot.queryParams;
      if (Object.keys(queryParams).indexOf('iteration') > -1) {
        const iteration = iterations.find(it => {
          return it.attributes.resolved_parent_path + '/' + it.attributes.name
            === queryParams['iteration'];
        })
        this.appliedIterationFilter = queryParams['iteration'];
        if (iteration) {
          this.filterService.setFilterValues('iteration', iteration.id);
        }
      } else {
        this.appliedIterationFilter = '';
      }
    })
    .switchMap((items) => {
      return Observable.forkJoin(
        Observable.of(items[0]),
        Observable.of(items[1]),
        Observable.of(items[2]),
        this.workItemService.getWorkItems(
          this.pageSize,
          this.filterService.getAppliedFilters()
        )
      )
    })
    .subscribe(([iterations, users, wiTypes, workItemResp]) => {
      // If this is the first time
      // and we are not listening to the URL
      // start listening to the URLs now on
      if (this.urlListener === null) {
        this.listenToUrls()
      }

      const workItems = workItemResp.workItems;
      this.nextLink = workItemResp.nextLink;
      this.workItems = this.workItemService.resolveWorkItems(
        workItems,
        this.iterations,
        this.allUsers,
        this.workItemTypes
      );
    },
    (err) => {
      console.log('Error in Work Item list',err);
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
    this.onMoveToTop(this.workItemToMove);
  }

  onMoveSelectedToBottom(): void{
    this.onMoveToBottom(this.workItemToMove);
  }

  onMoveToTop(entryComponent: WorkItemListEntryComponent): void {
    this.workItemDetail = entryComponent.getWorkItem();
    this.workItemService.reOrderWorkItem(this.workItemDetail, null, 'top')
    .subscribe((updatedWorkItem) => {
      let currentIndex = this.workItems.findIndex((item) => item.id === updatedWorkItem.id);
      // Putting on top of the list
      this.workItems.splice(0, 0, this.workItems[currentIndex]);
      // Removing duplicate old item
      this.workItems.splice( currentIndex + 1, 1);
      this.workItems[0].attributes['version'] = updatedWorkItem.attributes['version'];
      this.treeList.updateTree();
    });
  }

  onMoveToBottom(entryComponent: WorkItemListEntryComponent): void {
    this.workItemDetail = entryComponent.getWorkItem();
    this.workItemService.reOrderWorkItem(this.workItemDetail, null, 'bottom')
    .subscribe((updatedWorkItem) => {
      let currentIndex = this.workItems.findIndex((item) => item.id === updatedWorkItem.id);
      //move the item as the last of the loaded list
      this.workItems.splice((this.workItems.length), 0, this.workItems[currentIndex]);
      //remove the duplicate element
      this.workItems.splice( currentIndex, 1);
      this.workItems[this.workItems.length - 1].attributes['version'] = updatedWorkItem.attributes['version'];
      this.treeList.updateTree();
      this.listContainer.nativeElement.scrollTop = this.workItems.length * this.contentItemHeight;
    });
  }

  onMoveUp(): void {
    this.workItemDetail = this.workItemToMove.getWorkItem();
    let currentIndex = this.workItems.findIndex((item) => item.id === this.workItemDetail.id);
    if (currentIndex > 0) {
      this.workItemService.reOrderWorkItem(
        this.workItemDetail,
        this.workItems[currentIndex - 1].id,
        'above'
      ).subscribe((updatedWorkItem) => {
        this.workItems[currentIndex].attributes['version'] = updatedWorkItem.attributes['version'];
        // move the work item up by 1. Below statement will create two elements
        this.workItems.splice( currentIndex - 1 , 0, this.workItemDetail);
        // remove the duplicate element
        this.workItems.splice( currentIndex + 1, 1 );
        this.treeList.updateTree();
      });
    }
  }

  onMoveDown(): void {
    this.workItemDetail = this.workItemToMove.getWorkItem();
    let currentIndex = this.workItems.findIndex((item) => item.id === this.workItemDetail.id);
    if ( currentIndex < (this.workItems.length - 1) ) {
      this.workItemService.reOrderWorkItem(
        this.workItemDetail,
        this.workItems[currentIndex + 1].id,
        'below'
      ).subscribe((updatedWorkItem) => {
        this.workItems[currentIndex].attributes['version'] = updatedWorkItem.attributes['version'];
        // move the work item up by 1. Below statement will create two elements
        this.workItems.splice( currentIndex + 2 , 0, this.workItemDetail);
        // remove the duplicate element
        this.workItems.splice( currentIndex, 1 );
        this.treeList.updateTree();
      });
    }
  }

  listenToEvents() {
    this.eventListeners.push(
      this.broadcaster.on<string>('logout')
        .subscribe(message => {
          this.loggedIn = false;
          this.authUser = null;
          this.treeListOptions['allowDrag'] = false;
      })
    );
    //Filters like assign to me should stack with the current filters
    this.eventListeners.push(
      this.broadcaster.on<string>('wi_item_filter')
        .subscribe((filters: any) => {
          this.loadWorkItems();
      })
    );
    //Filters like iteration should clear the previous filter
    //and then set the current selected value
    // this.eventListeners.push(
    //   this.broadcaster.on<string>('unique_filter')
    //     .subscribe((filters: any) => {
    //       this.loadWorkItems();
    //   })
    // );

    this.eventListeners.push(
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
      })
    );

    this.eventListeners.push(
      this.broadcaster.on<void>('update_work_item_hierarchy')
        .subscribe(() => {
          // hierarchy has potentially changed, reload all data
          this.loadWorkItems();
          this.workItemService.resetWorkItemList();
        })
    );

    this.eventListeners.push(
      this.broadcaster.on<string>('updateWorkItem')
        .subscribe((workItem: string) => {
          let updatedItem = JSON.parse(workItem) as WorkItem;
          let index = this.workItems.findIndex((item) => item.id === updatedItem.id);
          if (index > -1) {
            this.workItems[index] = updatedItem;
            this.treeList.updateTree();
          }
        })
    );

    this.eventListeners.push(
      this.broadcaster.on<string>('addWorkItem')
        .subscribe((workItem: string) => {
          let newItem = JSON.parse(workItem) as WorkItem;
          this.workItems.splice(0, 0, newItem);
          this.treeList.updateTree();
        })
      );

    this.eventListeners.push(
      this.broadcaster.on<string>('detail_close')
      .subscribe(()=>{
        this.selectedWorkItemEntryComponent.deselect();
      })
    );
  }

  // Only start listening to the URL once the first call is done
  listenToUrls() {
    this.urlListener =
      this.route.queryParams.subscribe((params) => {
        // on no params
        if (!Object.keys(params).length) {
          // Cleaning up filters from filter service
          this.filterService.clearFilters();
        } else if(Object.keys(params).indexOf('iteration') > -1) {
          // If already applied iteration is not equal to currently
          // applied iteration in the URL then reload work items
          if (this.appliedIterationFilter !== params['iteration']) {
            this.loadWorkItems();
          } else {
            this.filterService.clearFilters(this.allowedFilterParams);
          }
        }
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
      this.workItemService.reOrderWorkItem(movedWI, prevWI.id, 'below')
          .subscribe((workItem) => {
            this.workItems.find((item) => item.id === workItem.id).attributes['version'] = workItem.attributes['version'];
          });
    }
    else {
      this.workItemService.reOrderWorkItem(movedWI, nextWI.id, 'above')
          .subscribe((workItem) => {
            this.workItems.find((item) => item.id === workItem.id).attributes['version'] = workItem.attributes['version'];
          });
    }
  }
}
