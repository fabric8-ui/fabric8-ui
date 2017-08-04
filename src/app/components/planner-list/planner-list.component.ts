import { EventService } from './../../services/event.service';
import { AreaModel } from '../../models/area.model';
import { AreaService } from '../../services/area.service';
import { FilterService } from '../../services/filter.service';
import { Observable } from 'rxjs/Observable';
import { IterationService } from '../../services/iteration.service';
import { IterationModel } from '../../models/iteration.model';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
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
  ViewEncapsulation,
  Output,
  EventEmitter
} from '@angular/core';
import {
  Router,
  Event as NavigationEvent,
  NavigationStart,
  NavigationEnd,
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
import { GroupTypesService } from '../../services/group-types.service';
import { WorkItemListEntryComponent } from '../work-item-list-entry/work-item-list-entry.component';
import { WorkItemService }            from '../../services/work-item.service';
import { WorkItemDataService } from './../../services/work-item-data.service';
import { CollaboratorService } from '../../services/collaborator.service';

import { TreeListComponent } from 'ngx-widgets';

@Component({
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    'class': ''
  },
  selector: 'alm-work-item-list',
  templateUrl: './planner-list.component.html',
  styleUrls: ['./planner-list.component.less']
})
export class PlannerListComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {

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
  contentItemHeight: number = 67;
  pageSize: number = 20;
  filters: any[] = [];
  allUsers: User[] = [] as User[];
  authUser: any = null;
  eventListeners: any[] = [];
  showHierarchyList: boolean = true;
  private spaceSubscription: Subscription = null;
  private iterations: IterationModel[] = [];
  private areas: AreaModel[] = [];
  private nextLink: string = '';
  private wiSubscriber: any = null;
  private allowedFilterParams: string[] = ['iteration'];
  private currentIteration: BehaviorSubject<string | null>;
  private loggedInUser: User | Object = {};
  private originalList: WorkItem[] = [];
  private currentSpace: Space;

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
    private collaboratorService: CollaboratorService,
    private eventService: EventService,
    private router: Router,
    private groupTypesService: GroupTypesService,
    private user: UserService,
    private workItemService: WorkItemService,
    private workItemDataService: WorkItemDataService,
    private logger: Logger,
    private userService: UserService,
    private route: ActivatedRoute,
    private spaces: Spaces,
    private iterationService: IterationService,
    private filterService: FilterService,
    private areaService: AreaService) {}

  ngOnInit(): void {
    // If there is an iteration on the URL
    // Setting the value to currentIteration
    // BehaviorSubject so that we can compare
    // on update the value on URL
    const queryParams = this.route.snapshot.queryParams;
    if (Object.keys(queryParams).indexOf('iteration') > -1) {
      this.currentIteration = new BehaviorSubject(queryParams['iteration']);
    } else {
      this.currentIteration = new BehaviorSubject(null);
    }

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
    if (this.spaceSubscription) {
      this.spaceSubscription.unsubscribe();
    }
  }

  // model handlers

  initWiItems(event: any): void {
    this.pageSize = event.pageSize;

    // Space subscription should only listen to changes
    // till the page is changed to something else.
    // Unsubscribe in ngOnDestroy acts way after the new page inits
    // So using takeUntill to watch over the routes in case of any change
    const takeUntilObserver = this.router.events
    .filter((event) => event instanceof NavigationStart)
    .filter((event: NavigationStart) => event.url.indexOf('plan/board') > -1 || event.url.indexOf('plan') == -1)

    this.spaceSubscription =
      // On any of these event inside combineLatest
      // We load the work items
      Observable.combineLatest(
        this.spaces.current,
        this.filterService.filterChange,
        //this.currentIteration,
        this.route.queryParams,
        this.eventService.showHierarchyListSubject,
        // only emits workItemReload when hierarchy view is on
        this.eventService.workItemListReloadOnLink.filter(() => this.showHierarchyList)
      )
      .takeUntil(takeUntilObserver)
      .subscribe(([
        space,
        activeFilter,
        //iteration,
        queryParams,
        showHierarchyList,
        workItemListReload
      ]) => {
        if (showHierarchyList) {
          this.logger.log('Switching to hierarchy list mode.');
        } else {
          this.logger.log('Switching to flat list mode.');
        }

        this.showHierarchyList = showHierarchyList;

        if (space) {
          console.log('[WorkItemListComponent] New Space selected: ' + space.attributes.name);
          this.currentSpace = space;
          this.loadWorkItems();
        } else {
          console.log('[WorkItemListComponent] Space deselected');
          this.workItems = [];
        }
      });
  }


  loadWorkItems(): void {
    if (this.wiSubscriber) {
      this.wiSubscriber.unsubscribe();
    }
    const t1 = performance.now();
    this.wiSubscriber = Observable.combineLatest(
      this.iterationService.getIterations(),
      // this.collaboratorService.getCollaborators(),
      this.workItemService.getWorkItemTypes(),
      this.areaService.getAreas(),
      this.userService.getUser().catch(err => Observable.of({})),
    ).take(1).do((items) => {
      const iterations = this.iterations = items[0];
      this.workItemTypes = items[1];
      this.areas = items[2];
      this.loggedInUser = items[3];

      // If there is an iteration filter on the URL
      // const queryParams = this.route.snapshot.queryParams;
      // if (Object.keys(queryParams).indexOf('iteration') > -1) {
      //   const iteration = iterations.find(it => {
      //     return it.attributes.resolved_parent_path + '/' + it.attributes.name
      //       === queryParams['iteration'];
      //   })
      //   if (iteration) {
      //     this.filterService.setFilterValues('iteration', iteration.id);
      //   }
      // } else {
      //   this.filterService.clearFilters(['iteration']);
      // }
    })
    .switchMap((items) => {
      let appliedFilters = this.filterService.getAppliedFilters();
      // remove the filter item from the filters
      for (let f=0; f<appliedFilters.length; f++) {
        if (appliedFilters[f].paramKey=='filter[parentexists]') {
          appliedFilters.splice(f, 1);
        }
      }
      // KNOWN ISSUE: if the tree is expanded when switching the mode, the user will experience
      // some weird issues. Problem is there seems to be no way of force-collapsing the tree yet.
      // TODO: collapse the tree here so it does not give weird effects when switching modes
      // if (this.showHierarchyList) {
      //   // we want to display the hierarchy, so filter out all items that are childs (have no parent)
      //   // to do this, we need to append a filter: /spaces/{id}/workitems?filter[parentexists]=false
      //   appliedFilters.push({ id: 'parentexists', paramKey: 'filter[parentexists]', value: 'false' });
      // }
      this.logger.log('Requesting work items with filters: ' + JSON.stringify(appliedFilters));

      // TODO Filter temp
      // Take all the applied filters and prepare an object to make the query string
      let newFilterObj = {};
      appliedFilters.forEach(item => {
        newFilterObj[item.id] = item.value;
      })
      newFilterObj['space'] = this.currentSpace.id;
      let payload = {
        parentexists: !!!this.showHierarchyList
      };
      if ( this.route.snapshot.queryParams['q'] ) {
        let existingQuery = this.filterService.queryToJson(this.route.snapshot.queryParams['q']);
        let filterQuery = this.filterService.queryToJson(this.filterService.constructQueryURL('', newFilterObj));
        let exp = this.filterService.queryJoiner(existingQuery, this.filterService.and_notation, filterQuery);
        Object.assign(payload,{
          expression:exp
        });
      } else {
        Object.assign(payload,{
          expression: this.filterService.queryToJson(this.filterService.constructQueryURL('', newFilterObj))
        });
      }
      return Observable.forkJoin(
        Observable.of(this.iterations),
        Observable.of(this.workItemTypes),
        // TODO implement search API mock for inmemory
        process.env.ENV == 'inmemory' ? this.workItemService.getWorkItems(
          this.pageSize,
          appliedFilters
        ) :
        this.workItemService.getWorkItems2(
          this.pageSize,
          payload
        )
      )
    })
    .subscribe(([iterations, wiTypes, workItemResp]) => {
      const t2 = performance.now();
      console.log('Performance :: Fetching the initial list - '  + (t2 - t1) + ' milliseconds.');
      this.logger.log('Got work item list.');
      this.logger.log(workItemResp.workItems);
      const workItems = workItemResp.workItems;
      this.nextLink = workItemResp.nextLink;
      this.workItems = this.workItemService.resolveWorkItems(
        workItems,
        this.iterations,
        [], // We don't want to static resolve user at this point
        this.workItemTypes
      );
      this.workItemDataService.setItems(this.workItems);
      // Resolve assignees
      const t3 = performance.now();
      this.workItems.forEach((item, index) => {
        this.workItemService.resolveAssignees(item.relationships.assignees).take(1)
          .subscribe(assignees => {
            item.relationships.assignees.data = assignees;
            if (index == this.workItems.length - 1) {
              const t4 = performance.now();
              console.log('Performance :: Resolved all the users - '  + (t4 - t3) + ' milliseconds.');
            }
          })
      });
      this.originalList = cloneDeep(this.workItems);
    },
    (err) => {
      console.log('Error in Work Item list', err);
    });
  }

  fetchMoreWiItems(): void {
    const t1 = performance.now();
    this.workItemService
      .getMoreWorkItems(this.nextLink)
      .subscribe((newWiItemResp) => {
        const t2 = performance.now();
        const workItems = newWiItemResp.workItems;
        this.nextLink = newWiItemResp.nextLink;
        const wiLength = this.workItems.length;
        this.workItems = [
          ...this.workItems,
          // Returns an array of resolved work items
          ...this.workItemService.resolveWorkItems(
            workItems,
            this.iterations,
            [],
            this.workItemTypes
          )
        ];
        this.workItemDataService.setItems(this.workItems);
        console.log('Performance :: Fetching more list items - '  + (t2 - t1) + ' milliseconds.');

        // Resolve assignees
        const t3 = performance.now();
        for (let i = wiLength; i < this.workItems.length; i++) {
          this.workItemService.resolveAssignees(this.workItems[i].relationships.assignees).take(1)
            .subscribe(assignees => {
              this.workItems[i].relationships.assignees.data = assignees
              if (i == this.workItems.length - 1) {
                const t4 = performance.now();
                console.log('Performance :: Resolved all the users - '  + (t4 - t3) + ' milliseconds.');
              }
            })
        }

        this.treeList.updateTree();
      },
      (e) => console.log(e));
  }

  fnSetTypeContext() {
    //Guided work item type. Show work item which match the guided types
    this.workItems = this.originalList;
    let guidedWits = this.groupTypesService.getGuidedWits(this.workItemTypes);
    let filteredWis = []
    this.workItems.forEach(item => {
      guidedWits.forEach(wit => {
        console.log(wit.id,' gwit=== ', item.relationships.baseType.data.id)
        if(wit.id === item.relationships.baseType.data.id) {
          filteredWis.push(item);
         }
       });
     });
    this.workItems = filteredWis;
    console.log('after length = ', this.workItems.length);
    //Build query
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

  onDetail(entryComponent: WorkItemListEntryComponent): void { }

  onCreateWorkItem(workItem) {
    let resolveItem = this.workItemService.resolveWorkItems(
      [workItem],
      this.iterations,
      [],
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
      this.broadcaster.on<string>('detail_close')
      .subscribe(()=>{
        // this.selectedWorkItemEntryComponent.deselect();
      })
    );
    this.eventListeners.push(
      this.workItemService.addWIObservable.subscribe(item => {
        //Check if the work item meets the applied filters
        if(this.filterService.doesMatchCurrentFilter(item)){
          console.log('Added WI matches the applied filters');
          this.workItems.splice(0, 0, item);
          this.treeList.updateTree();
        } else {
          console.log('Added WI does not match the applied filters');
          this.treeList.updateTree();
        }
      })
    );

    this.eventListeners.push(
      this.workItemService.editWIObservable.subscribe(updatedItem => {
        let index = this.workItems.findIndex((item) => item.id === updatedItem.id);
        if(this.filterService.doesMatchCurrentFilter(updatedItem)){
          console.log('Updated WI matches the applied filters')
          if (index > -1) {
            this.workItems[index] = updatedItem;
          } else {
            //Scenario: work item detail panel is open.
            //Change a value so that it does not match the applied filter and gets removed from the list
            //The panel is still open - set back the value(s) so that the work item matches the applied
            //filters
            //add the WI at the top of the list
            this.workItems.splice(0, 0, updatedItem);
          }
          this.treeList.updateTree();
        } else {
          //Remove the work item from the current displayed list
          if (index > -1) {
            this.workItems.splice(index, 1);
            console.log('Updated WI does not match the applied filters')
            this.treeList.updateTree();
          }
        }
      })
    );

    //Set the guided work item type display context
    this.eventListeners.push(
      this.groupTypesService.groupTypeSelected.subscribe(item =>{
        this.fnSetTypeContext();
      })
    )
  }

  onDragStart() {
    //console.log('on drag start');
  }

  // Event listener for WI drop.
  onDragEnd(workItemId: string) {
    // rearrange is happening inside ng2-dnd library
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

  onSelect($event) {
    this.workItemService.emitSelectedWI($event.workItem);
    this.groupTypesService.getAllowedChildWits($event.workItem);
  }
}
