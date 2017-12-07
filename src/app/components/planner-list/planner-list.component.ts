import { EventService } from './../../services/event.service';
import { AreaModel } from '../../models/area.model';
import { AreaService } from '../../services/area.service';
import { FilterService } from '../../services/filter.service';
import { GroupTypesModel } from '../../models/group-types.model';
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
  EventEmitter,
  Renderer2,
  HostListener,
  AfterViewChecked
} from '@angular/core';
import {
  Router,
  Event as NavigationEvent,
  NavigationStart,
  NavigationEnd,
  ActivatedRoute,
  NavigationExtras
} from '@angular/router';

import { cloneDeep } from 'lodash';
import { Broadcaster, Logger, Notification, NotificationType, Notifications } from 'ngx-base';
import {
  AuthenticationService,
  User,
  UserService
} from 'ngx-login-client';
import { Space, Spaces } from 'ngx-fabric8-wit';

import {
  Action,
  ActionConfig,
  EmptyStateConfig,
  ListBase,
  ListEvent,
  TreeListComponent,
  TreeListConfig
} from 'patternfly-ng';

// import for column
import { datatableColumn } from './datatable-config';

import { WorkItemCellComponent } from '../work-item-cell/work-item-cell.component'
import { WorkItem } from '../../models/work-item';
import { WorkItemDetailComponent } from './../work-item-detail/work-item-detail.component';
import { WorkItemType } from '../../models/work-item-type';
import { GroupTypesService } from '../../services/group-types.service';
import { WorkItemListEntryComponent } from '../work-item-list-entry/work-item-list-entry.component';
import { WorkItemService } from '../../services/work-item.service';
import { WorkItemDataService } from './../../services/work-item-data.service';
import { CollaboratorService } from '../../services/collaborator.service';
import { LabelService } from '../../services/label.service';
import { LabelModel } from '../../models/label.model';
import { UrlService } from './../../services/url.service';
import { WorkItemDetailAddTypeSelectorComponent } from './../work-item-create/work-item-create.component';
import { setTimeout } from 'core-js/library/web/timers';

@Component({
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': ''
  },
  selector: 'alm-work-item-list',
  templateUrl: './planner-list.component.html',
  styleUrls: ['./planner-list.component.less']
})
export class PlannerListComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @ViewChildren('activeFilters', {read: ElementRef}) activeFiltersRef: QueryList<ElementRef>;
  @ViewChild('activeFiltersDiv') activeFiltersDiv: any;
  @ViewChild('typeSelectPanel') typeSelectPanel: WorkItemDetailAddTypeSelectorComponent;

  @ViewChild('listContainer') listContainer: any;
  @ViewChild('treeList') treeList: TreeListComponent;
  @ViewChild('detailPreview') detailPreview: WorkItemDetailComponent;
  @ViewChild('sidePanel') sidePanelRef: any;
  @ViewChild('associateIterationModal') associateIterationModal: any;

  actionConfig: ActionConfig;
  emptyStateConfig: EmptyStateConfig;
  selectType: string = 'checkbox';
  treeListConfig: TreeListConfig;
  @ViewChild('toolbarHeight') toolbarHeight: ElementRef;
  @ViewChild('containerHeight') containerHeight: ElementRef;


  datatableWorkitems: any[] = [];
  checkableColumn: any[] = datatableColumn;
  columns: any[] = this.checkableColumn;
  workItems: WorkItem[] = [];
  prevWorkItemLength: number = 0;
  workItemTypes: WorkItemType[] = [];
  selectedWorkItemEntryComponent: WorkItemListEntryComponent;
  workItemToMove: WorkItem;
  workItemDetail: WorkItem;
  currentWorkItem: WorkItem = null;
  addingWorkItem = false;
  showOverlay: Boolean;
  loggedIn: Boolean = false;
  contentItemHeight: number = 67;
  pageSize: number = 20;
  filters: any[] = [];
  allUsers: User[] = [] as User[];
  authUser: any = null;
  eventListeners: any[] = [];
  showHierarchyList: boolean = true;
  sidePanelOpen: boolean = true;
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
  private labels: LabelModel[] = [];
  private uiLockedAll = false;
  private uiLockedList = true;
  private uiLockedSidebar = false;
  private children: string[] = [];
  private currentExpandedChildren: WorkItem[] = [];
  private expandedNode: any = null;
  private selectedWI: WorkItem = null;
  private initialGroup: GroupTypesModel;
  private included: WorkItem[];


  constructor(
    private labelService: LabelService,
    private areaService: AreaService,
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private collaboratorService: CollaboratorService,
    private eventService: EventService,
    private filterService: FilterService,
    private groupTypesService: GroupTypesService,
    private iterationService: IterationService,
    private logger: Logger,
    private notifications: Notifications,
    private user: UserService,
    private workItemService: WorkItemService,
    private workItemDataService: WorkItemDataService,
    private route: ActivatedRoute,
    private router: Router,
    private spaces: Spaces,
    private userService: UserService,
    private urlService: UrlService,
    private renderer: Renderer2) { }

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
    this.setTreeConfigs();


  }

  toggleAvailable(event, col) {
    if(event.target.checked) {
      col.selected = true;
    } else {
      col.selected = false;
    }

  }
  moveToDisplay() {
    const selected = this.isSelected();
    selected.forEach(col => {
      if(col.display === true) return;
      col.selected = false;
      col.display = true;
      col.available = false;
    })
    this.columns = [...this.checkableColumn]
  }

  moveToAvailable() {
    const selected = this.isSelected();
    selected.forEach(col => {
      if(col.available === true) return;
      col.selected = false;
      col.display = false;
      col.available = true;
    });
    this.columns = [...this.checkableColumn]
  }

  toggleDisplay(event, col) {
    if(event.target.checked) {
      col.selected = true;
    } else {
      col.selected = false;
    }
  }

  isSelected() {
    return this.checkableColumn.filter(col => col.selected);
  }

  onDetailPreview(id): void {
    event.stopPropagation();
     //this.detailEvent.emit(this);
       this.workItemDataService.getItem(id).subscribe(workItem => {
       this.router.navigateByUrl(this.router.url.split('/list')[0] + '/detail/' + workItem.id, { relativeTo: this.route });
       });
  }

  setTreeConfigs() {
    this.actionConfig = {
      primaryActions: [],
      moreActions: [{
        id: 'move2top',
        title: 'Move to Top',
        tooltip: 'Move this work item to the top of the list'
      }, {
        id: 'move2bottom',
        title: 'Move to Bottom',
        tooltip: 'Move this work item to the bottom of the list'
      },
      {
        id: 'divider1',
        title: '',
        separator: true
      }, {
        id: 'associateIteration',
        title: 'Associate with Iteration...',
        tooltip: 'Associate this work item with an Iteration',
      },
      {
        id: 'divider2',
        title: '',
        separator: true
      }, {
        id: 'open',
        title: 'Open',
        tooltip: 'Open the detailed view of this work item'
      }, {
        id: 'preview',
        title: 'Preview',
        tooltip: 'Open the quick preview of this work item'
      }, {
        id: 'move2backlog',
        title: 'Move to Backlog',
        tooltip: 'Move this work item to the backlog'
      }],
      moreActionsDisabled: false,
      moreActionsVisible: this.loggedIn
    } as ActionConfig;

    this.emptyStateConfig = {
      actions: {
        primaryActions: [{
          id: 'createWI',
          title: 'Create work item',
          tooltip: 'Create work item',
          styleClass: this.loggedIn ? 'show-wi' : 'hide-wi'
        }],
        moreActions: []
      } as ActionConfig,
      iconStyleClass: 'pficon-warning-triangle-o',
      title: 'No Work Items Available',
      info: 'There are no Work Items for your selected criteria',
      helpLink: {
        text: 'Create a new Work Item'
      }
    } as EmptyStateConfig;

    this.treeListConfig = {
      dblClick: false,
      emptyStateConfig: this.emptyStateConfig,
      multiSelect: false,
      selectItems: true,
      selectionMatchProp: 'name',
      showCheckbox: false,
      treeOptions: {
        allowDrag: this.loggedIn,
        isExpandedField: 'expanded',
        getChildren: this.loadChildren.bind(this)
      }
    } as TreeListConfig;
  }

  ngAfterViewInit() {
    let oldHeight = 0;
    this.authUser = cloneDeep(this.route.snapshot.data['authuser']);
  }

  ngAfterViewChecked() {
    if (this.workItems.length != this.prevWorkItemLength) {
      //this.treeList.update();
      this.prevWorkItemLength = this.workItems.length;
    }

    if(this.toolbarHeight) {
      let toolbarHt:number =  this.toolbarHeight.nativeElement.offsetHeight;
      let quickaddHt:number =  0;
      if(document.getElementsByClassName('f8-wi-list__quick-add').length > 0) {
        quickaddHt = (document.getElementsByClassName('f8-wi-list__quick-add')[0] as HTMLElement).offsetHeight;
      }
      let hdrHeight:number = 0;
      if(document.getElementsByClassName('navbar-pf').length > 0) {
        hdrHeight = (document.getElementsByClassName('navbar-pf')[0] as HTMLElement).offsetHeight;
      }
      let expHeight: number = 0;
      if (document.getElementsByClassName('experimental-bar').length > 0) {
        expHeight = (document.getElementsByClassName('experimental-bar')[0] as HTMLElement).offsetHeight;
      }
      let targetHeight: number = window.innerHeight - toolbarHt - quickaddHt - hdrHeight - expHeight;
      this.renderer.setStyle(this.listContainer.nativeElement, 'height', targetHeight + "px");

      let targetContHeight: number = window.innerHeight - hdrHeight - expHeight;
      this.renderer.setStyle(this.containerHeight.nativeElement, 'height', targetContHeight + "px");
    }
    if (document.getElementsByTagName('body')) {
      document.getElementsByTagName('body')[0].style.overflow = "hidden";
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
  }

  ngOnDestroy() {
    console.log('Destroying all the listeners in list component');
    this.eventListeners.forEach(subscriber => subscriber.unsubscribe());
    if (this.spaceSubscription) {
      this.spaceSubscription.unsubscribe();
    }
    document.getElementsByTagName('body')[0].style.overflow = "auto";
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
      .filter((event: NavigationStart) =>
        event.url.indexOf('plan/board') > -1 ||
        event.url.indexOf('plan/detail') > -1 ||
        event.url.indexOf('plan') == -1
      );

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
            this.datatableWorkitems = [];
          }
        });
  }

  loadWorkItems(): void {
    this.initialGroup = this.groupTypesService.getCurrentGroupType();
    //if initialGroup is undefined, the page has been refreshed - find  group context based on URL
    if (this.route.snapshot.queryParams['q']) {
      let wits = this.route.snapshot.queryParams['q'].split('workitemtype:')
      if(wits.length > 1) {
        let collection = wits[1].replace(')','').split(',');
        this.groupTypesService.findGroupConext(collection);
      }
    }
    if (this.initialGroup === undefined)
      this.initialGroup = this.groupTypesService.getCurrentGroupType();

    this.uiLockedList = true;
    if (this.wiSubscriber) {
      this.wiSubscriber.unsubscribe();
    }
    this.children = [];
    const t1 = performance.now();
    this.wiSubscriber = Observable.combineLatest(
      this.iterationService.getIterations(),
      // this.collaboratorService.getCollaborators(),
      this.workItemService.getWorkItemTypes(),
      this.areaService.getAreas(),
      this.userService.getUser().catch(err => Observable.of({})),
      this.labelService.getLabels()
    ).take(1).do((items) => {
      const iterations = this.iterations = items[0];
      this.workItemTypes = items[1];
      this.areas = items[2];
      this.loggedInUser = items[3];
      this.labels = items[4];
      if (this.initialGroup === undefined) {
        let witCollection = this.workItemTypes.map(wit => wit.id);
        this.groupTypesService.setCurrentGroupType(witCollection);
        this.initialGroup = this.groupTypesService.getCurrentGroupType();
      }
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
        for (let f = 0; f < appliedFilters.length; f++) {
          if (appliedFilters[f].paramKey == 'filter[parentexists]') {
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
        let showFlatList = false;
        if (this.groupTypesService.groupName === 'execution' || this.groupTypesService.groupName === 'requirements')
          showFlatList = true;
        //console.log('showFlatList', this.groupTypesService.groupName);
        let payload = {
          //for execution level set this to true
          parentexists: true
        };
        if (this.route.snapshot.queryParams['q']) {
          let existingQuery = this.filterService.queryToJson(this.route.snapshot.queryParams['q']);
          let filterQuery = this.filterService.queryToJson(this.filterService.constructQueryURL('', newFilterObj));
          let exp = this.filterService.queryJoiner(existingQuery, this.filterService.and_notation, filterQuery);
          Object.assign(payload, {
            expression: exp
          });
        } else {
          Object.assign(payload, {
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
        console.log('Performance :: Fetching the initial list - ' + (t2 - t1) + ' milliseconds.');
        this.logger.log('Got work item list.');
        this.logger.log(workItemResp.workItems);
        const workItems = workItemResp.workItems;
        this.nextLink = workItemResp.nextLink;
        this.included = workItemResp.included;
        this.workItems = this.workItemService.resolveWorkItems(
          workItems,
          this.iterations,
          [], // We don't want to static resolve user at this point
          this.workItemTypes,
          this.labels,
          this.included
        );
        this.datatableWorkitems = this.tableWorkitem(this.workItems);
        this.workItemDataService.setItems(this.workItems);
        // Resolve assignees
        const t3 = performance.now();
        if (!this.workItems || this.workItems.length == 0) {
          // if there are no work items, unlock the ui here
          this.uiLockedList = false;
        }
        this.workItems.forEach((item, index) => {
          this.workItemService.resolveAssignees(item.relationships.assignees).take(1)
            .subscribe(assignees => {
              item.relationships.assignees.data = assignees;
              // After the assignees is resolved
              // We should add it to the datatableWorkitems
              this.datatableWorkitems[index].assignees = assignees;
              if (index == this.workItems.length - 1) {
                const t4 = performance.now();
                console.log('Performance :: Resolved all the users - ' + (t4 - t3) + ' milliseconds.');
                this.uiLockedList = false;
              }
            })
        });

        // Resolve creators
        const t5 = performance.now();
        const allCreatorURLs: string[] = this.workItems.reduce(
          (uniqueItems: WorkItem[], workItem: WorkItem) => {
            if (!uniqueItems.find((item) => {
              return item.relationships.creator.data.id ===
                workItem.relationships.creator.data.id
              })) {
              return [...uniqueItems, workItem]
            } else {
              return uniqueItems;
            }
          }, [] as WorkItem[])
          .map((item: WorkItem) => {
            return item.relationships.creator.data.links.self;
          });

        this.workItemService.getUsersByURLs(allCreatorURLs)
          .subscribe((creators: User[]) => {
            this.workItems.forEach((item, index) => {
              item.relationships.creator.data = creators.find(creator => {
                if (item.relationships.creator.data.id === creator.id) {
                  // After the assignees is resolved
                  // We should add it to the datatableWorkitems
                  this.datatableWorkitems[index].creator = creator;
                  return true;
                } else {
                  return false;
                }
              })
            })
          })
        // this.treeList.update();
        // this.originalList = cloneDeep(this.workItems);
      },
      (err) => {
        console.log('Error in Work Item list', err);
        this.uiLockedList = false;
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
            this.workItemTypes,
            this.labels,
            newWiItemResp.included
          )
        ];
        this.datatableWorkitems = this.tableWorkitem(this.workItems);
        this.workItemDataService.setItems(this.workItems);
        console.log('Performance :: Fetching more list items - ' + (t2 - t1) + ' milliseconds.');

        // Resolve assignees
        const t3 = performance.now();
        for (let i = wiLength; i < this.workItems.length; i++) {
          this.workItemService.resolveAssignees(this.workItems[i].relationships.assignees).take(1)
            .subscribe(assignees => {
              this.workItems[i].relationships.assignees.data = assignees;
              // After the assignees is resolved
              // We should add it to the datatableWorkitems
              this.datatableWorkitems[i].assignees = assignees;
              if (i == this.workItems.length - 1) {
                const t4 = performance.now();
                console.log('Performance :: Resolved all the users - ' + (t4 - t3) + ' milliseconds.');
              }
            })
        }
        //this.treeList.update();
      },
      (e) => console.log(e));
  }

  loadChildren(node): any {
    return this.workItemService.getChildren(node.data)
      //set the parent information for the child WIs
      .then((workItems: WorkItem[]) => {
        workItems.map(wi => {
          wi.relationships.parent = { data: {} as WorkItem };
          wi.relationships.parent.data = node.data;
        });
        return workItems;
      })
      .then((workItems: WorkItem[]) => this.workItemService.resolveWorkItems(
        workItems,
        this.iterations,
        [], // We don't want to static resolve user at this point
        this.workItemTypes,
        this.labels
      ))
      .then((workItems: WorkItem[]) => {
        // Save all the children fethced
        workItems.forEach(w => this.children.push(w.id));
        if (this.currentWorkItem != null) {
          if (this.currentWorkItem.id === node.data.id) {
            this.currentExpandedChildren = workItems;
            this.expandedNode.node.data.children = workItems;
          }
        }
        return workItems;
      });
  }

  onDetail(entryComponent: WorkItemListEntryComponent): void { }

  onPreview(event: MouseEvent, id: string): void {
    this.workItemDataService.getItem(id).subscribe(workItem => {
      this.detailPreview.openPreview(workItem);   });
  }

  onCreateWorkItem(workItem) {
    let resolveItem = this.workItemService.resolveWorkItems(
      [workItem],
      this.iterations,
      [],
      this.workItemTypes,
      this.labels
    );
    this.workItems = [...resolveItem, ...this.workItems];
    this.datatableWorkitems = [
      ...this.tableWorkitem([this.workItems[0]]),
      ...this.datatableWorkitems
    ];
  }

  onMoveToTop(id: string): void {
    this.workItemDataService.getItembyNumber(id).subscribe((entryComponent) => {
    this.workItemDetail = entryComponent;
    this.workItemService.reOrderWorkItem(this.workItemDetail, null, 'top')
      .subscribe((updatedWorkItem) => {
        let currentIndex = this.workItems.findIndex((item) => item.id === updatedWorkItem.id);
        // Putting on top of the list
        this.workItems.splice(0, 0, this.workItems[currentIndex]);
        // Removing duplicate old item
        this.workItems.splice(currentIndex + 1, 1);
        this.workItems[0].attributes['version'] = updatedWorkItem.attributes['version'];
        this.treeList.update();
      });
    });
  }

  onMoveToBottom(id: string): void {
    this.workItemDataService.getItembyNumber(id).subscribe((entryComponent) => {
    this.workItemDetail = entryComponent;
    this.workItemService.reOrderWorkItem(this.workItemDetail, null, 'bottom')
      .subscribe((updatedWorkItem) => {
        let currentIndex = this.workItems.findIndex((item) => item.id === updatedWorkItem.id);
        //move the item as the last of the loaded list
        this.workItems.splice((this.workItems.length), 0, this.workItems[currentIndex]);
        //remove the duplicate element
        this.workItems.splice(currentIndex, 1);
        this.workItems[this.workItems.length - 1].attributes['version'] = updatedWorkItem.attributes['version'];
        this.treeList.update();
        this.listContainer.nativeElement.scrollTop = this.workItems.length * this.contentItemHeight;
      });
    });
  }

  onAssociateIteration(id: string): void {
    this.workItemDataService.getItembyNumber(id).subscribe((item) => {
    this.currentWorkItem = item;
    this.associateIterationModal.workItem = item;
    this.associateIterationModal.open();
    });
  }

  onOpen(id: string){
    this.workItemDataService.getItembyNumber(id).subscribe((item) => {
      let link = this.router.url.split('/list')[0] + '/detail/' + item.id;
      this.router.navigateByUrl(link, { relativeTo: this.route });
    });
  }
  onMoveToBacklog(id: string): void {
    this.workItemDataService.getItembyNumber(id).subscribe((item) => {
    item.relationships.iteration = {}
    this.workItemService
      .update(item)
      .switchMap(item => {
        return this.iterationService.getIteration(item.relationships.iteration)
          .map(iteration => {
            item.relationships.iteration.data = iteration;
            return item;
          });
      })
      .subscribe(workItem => {
        //update only the relevant fields
        let index = this.workItems.findIndex(wi => wi.id === item.id)
        this.workItems[index].relationships.iteration.data = workItem.relationships.iteration.data;
        this.workItems[index].attributes['version'] = workItem.attributes['version'];
        this.treeList.update();
        try {
          this.notifications.message({
            message: workItem.attributes['system.title'] + ' has been moved to the Backlog.',
            type: NotificationType.SUCCESS
          } as Notification);
        } catch (e) {
          console.log('Error displaying notification. Iteration was moved to Backlog.')
        }
      },
      (err) => {
        try {
          this.notifications.message({
            message: item.attributes['system.title'] + ' could not be moved to the Backlog.',
            type: NotificationType.DANGER
          } as Notification);
        } catch (e) {
          console.log('Error displaying notification. Error moving Iteration to Backlog.')
        }
      });
    });
  }

  // This opens the create new work item dialog. It parses the query string
  // first to get iterationId and areaId for pre-selection in the new work item
  // dialog. Note that this only works for the current capabilities of the query
  // toolbar for now. If we extend that, we also need to extend this method.
  onCreateFromContext() {
    console.log('Activated create work item from a list view.');
    let query = this.route.snapshot.queryParams['q'];
    if (query) {
      let contextIteration = this.filterService.getConditionFromQuery(query, "iteration");
      let contextArea = this.filterService.getConditionFromQuery(query, "area");
      this.typeSelectPanel.openPanel(contextIteration, contextArea);
    } else {
      console.log('No current query for add from empty list');
      // use standard non-context create dialog
      this.typeSelectPanel.openPanel();
    }
  }

  listenToEvents() {
    this.eventListeners.push(
      this.broadcaster.on<string>('logout')
        .subscribe(message => {
          this.loggedIn = false;
          this.authUser = null;
          //this.treeListOptions['allowDrag'] = false;
        })
    );

    this.eventListeners.push(
      this.broadcaster.on<string>('detail_close')
        .subscribe(() => {
          // this.selectedWorkItemEntryComponent.deselect();
        })
    );

    this.eventListeners.push(
      this.workItemService.addWIObservable
        .map(item => this.workItemService.resolveWorkItems(
          [item],
          this.iterations,
          [],
          this.workItemTypes,
          this.labels
        )[0])
        .subscribe(item => {
          if (this.selectedWI === null) {
            //add a work item to the top level list
            this.workItems.splice(0, 0, item);
          } else {
            if (this.expandedNode === null) {
              //A  WI has been selected - add the new WI as a child under that
              this.selectedWI.hasChildren = true;
              item.relationships.parent = { data: {} as WorkItem }
              item.relationships.parent.data = this.selectedWI;
            } else {
              let index = this.workItems.findIndex(wi => wi.id === this.selectedWI.id)
              if (this.selectedWI.id === this.expandedNode.node.data.id) {
                //if the selected node is expanded
                item.relationships.parent = { data: {} as WorkItem }
                item.relationships.parent.data = this.selectedWI;
                this.expandedNode.node.data.children.push(item);
                if (index > -1) {
                  //this means selectedWI is a not a child WI - top level WI
                  this.workItems[index] = this.expandedNode.node.data;
                } else {
                  //index < 0 means wi not found in workItems
                  //the selected WI is a child node and a child is being added
                  this.selectedWI = this.expandedNode.node.data;
                }
              } else {
                //selected WI and expanded WI are different
                this.selectedWI.hasChildren = true;
              }
            }
          }
          if (this.filterService.doesMatchCurrentFilter(item)) {
            try {
              this.notifications.message({
                message: item.attributes['system.title'] + ' created.',
                type: NotificationType.SUCCESS
              } as Notification);
            } catch (e) {
              console.log('Error displaying notification. Added WI matches the applied filters.')
            }
          } else {
            try {
              this.notifications.message({
                message: item.attributes['system.title'] + ' created. Added WI does not match the applied filters',
                type: NotificationType.SUCCESS
              } as Notification);
            } catch (e) {
              console.log('Error displaying notification. Added WI does not match the applied filters.')
            }
          }
          //if (this.workItems.length > 0)
            //this.treeList.update();
        })
    );

    this.eventListeners.push(
      this.workItemService.editWIObservable.subscribe(updatedItem => {
        let index = this.workItems.findIndex((item) => item.id === updatedItem.id);
        if (this.filterService.doesMatchCurrentFilter(updatedItem)) {
          updatedItem.hasChildren = updatedItem.relationships.children.meta.hasChildren;
          updatedItem.relationships['parent'] = this.workItems[index].relationships.parent;
          if (index > -1) {
            this.workItems[index] = updatedItem;
          } else {
            //Scenario: work item detail panel is open.
            //Change a value so that it does not match the applied filter and gets removed from the list
            //The panel is still open - set back the value(s) so that the work item matches the applied
            //filters
            //add the WI at the top of the list

            if (!this.children.find(c => c === updatedItem.id)) {
              // If the item is not a child of any other item
              this.workItems.splice(0, 0, updatedItem);
            }
          }
          try {
            this.notifications.message({
              message: updatedItem.attributes['system.title'] + ' updated.',
              type: NotificationType.SUCCESS
            } as Notification);
          } catch (e) {
            console.log('Error displaying notification. Updated WI matches the applied filters.')
          }
          this.treeList.update();
        } else {
          //Remove the work item from the current displayed list
          if (index > -1) {
            try {
              this.notifications.message({
                message: updatedItem.attributes['system.title'] + ' updated. This work item no longer matches the applied filters.',
                type: NotificationType.SUCCESS
              } as Notification);
            } catch (e) {
              console.log('Error displaying notification. Updated WI does not match the applied filters.')
            }
            this.workItems.splice(index, 1);
            this.treeList.update();
          }
        }
      })
    );

    this.eventListeners.push(
      this.router.events
        .filter(event => event instanceof NavigationStart)
        .subscribe(
        (event: any) => {
          if (event.url.indexOf('/plan/detail/') > -1) {
            // It's going to the detail page
            let url = location.pathname;
            let query = location.href.split('?');
            if (query.length == 2) {
              url = url + '?' + query[1];
            }
            this.urlService.recordLastListOrBoard(url);
          }
        }
        )
    );

    // lock the ui when a complex query is starting in the background
    this.eventListeners.push(
      this.broadcaster.on<string>('backend_query_start')
        .subscribe((context: string) => {
          switch (context) {
            case 'workitems':
              this.uiLockedList = true;
              break;
            case 'iterations':
              this.uiLockedSidebar = true;
              break;
            case 'mixed':
              this.uiLockedAll = true;
              break;
            default:
              break;
          }
        })
    );

    // unlock the ui when a complex query is completed in the background
    this.eventListeners.push(
      this.broadcaster.on<string>('backend_query_end')
        .subscribe((context: string) => {
          switch (context) {
            case 'workitems':
              this.uiLockedList = false;
              break;
            case 'iterations':
              this.uiLockedSidebar = false;
              break;
            case 'mixed':
              this.uiLockedAll = false;
              break;
            default:
              break;
          }
        })
    );

    this.eventListeners.push(
      this.iterationService.createIterationObservable.subscribe(iteration => {
        let index = this.iterations.findIndex(i => i.id === iteration.id);
        if (index > -1) {
          this.iterations[index] = iteration;
        } else {
          this.iterations.push(iteration);
        }
      })
    );
  }

  tableWorkitem(workItems: WorkItem[]): any {
    return workItems.map(element => {
       return {
        id: element.id,
        number: element.attributes['system.number'],
        type: element.relationships.baseType ? element.relationships.baseType : '',
        title: element.attributes['system.title'],
        labels: element.relationships.labels.data,
        creator: element.relationships.creator.data,
        assignees: element.relationships.assignees.data,
        status: element.attributes['system.state']
      }
    });
  }

  //Patternfly-ng's tree list component
  handleMoveNode($event) {
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

  handleSelectionChange($event): void {
    if ($event.item.selected === true) {
      this.selectedWI = $event.item;
      if (this.expandedNode != null && ($event.item.id !== this.expandedNode.node.item.id)) {
        this.expandedNode = null;
      }
    } else {
      this.selectedWI = null;
      //reset the quick add context to allowed WIT for the selected group
      this.logger.log('Reset work item types as per the work item type group.');
      this.logger.log(this.initialGroup);
      this.groupTypesService.setCurrentGroupType(this.initialGroup);
    }
  }

  handleClick($event): void {
    this.workItemService.emitSelectedWI($event.item);
    this.groupTypesService.getAllowedChildWits($event.item);
  }

  handleToggleExpanded($event: any): void {
    if ($event.isExpanded) {
      this.expandedNode = $event;
    } else {
      this.expandedNode = null;
    }
  }


  togglePanelState(event: any): void {
    if (event === 'out') {
      setTimeout(() => {
        this.sidePanelOpen = true;
      }, 200)
    } else {
      this.sidePanelOpen = false;
    }
  }

  togglePanel() {
    this.sidePanelRef.toggleSidePanel();
  }

  onClickLabel(event) {
    let params = {
      label: event.attributes.name
    }
    // Prepare navigation extra with query params
    let navigationExtras: NavigationExtras = {
      queryParams: params
    };

    // Navigated to filtered view
    this.router.navigate([], navigationExtras);
  }

}
