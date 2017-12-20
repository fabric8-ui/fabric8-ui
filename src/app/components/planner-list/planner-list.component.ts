
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
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList,
  TemplateRef,
  OnDestroy,
  ViewEncapsulation,
  Output,
  EventEmitter,
  Renderer2,
  HostListener,
  style
} from '@angular/core';
import {
  Router,
  Event as NavigationEvent,
  NavigationStart,
  NavigationEnd,
  ActivatedRoute,
  NavigationExtras
} from '@angular/router';

import { cloneDeep, sortBy } from 'lodash';
import { Broadcaster, Logger, Notification, NotificationType, Notifications } from 'ngx-base';
import {
  AuthenticationService,
  User,
  UserService
} from 'ngx-login-client';
import { Space, Spaces } from 'ngx-fabric8-wit';

import { EmptyStateConfig } from 'patternfly-ng';

// import for column
import { datatableColumn } from './datatable-config';

import { WorkItemCellComponent } from '../work-item-cell/work-item-cell.component'
import { WorkItem } from '../../models/work-item';
import { WorkItemDetailComponent } from './../work-item-detail/work-item-detail.component';
import { WorkItemType } from '../../models/work-item-type';
import { GroupTypesService } from '../../services/group-types.service';
import { WorkItemService } from '../../services/work-item.service';
import { WorkItemDataService } from './../../services/work-item-data.service';
import { CollaboratorService } from '../../services/collaborator.service';
import { LabelService } from '../../services/label.service';
import { LabelModel } from '../../models/label.model';
import { UrlService } from './../../services/url.service';
import { CookieService } from './../../services/cookie.service';
import { WorkItemDetailAddTypeSelectorComponent } from './../work-item-create/work-item-create.component';

// ngrx stuff
import { Store } from '@ngrx/store';
import { AppState } from './../../states/app.state';

@Component({
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': ''
  },
  selector: 'alm-work-item-list',
  templateUrl: './planner-list.component.html',
  styleUrls: ['./planner-list.component.less']
})
export class PlannerListComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChildren('activeFilters', { read: ElementRef }) activeFiltersRef: QueryList<ElementRef>;
  @ViewChild('activeFiltersDiv') activeFiltersDiv: any;
  @ViewChild('typeSelectPanel') typeSelectPanel: WorkItemDetailAddTypeSelectorComponent;

  @ViewChild('listContainer') listContainer: any;
  @ViewChild('detailPreview') detailPreview: WorkItemDetailComponent;
  @ViewChild('sidePanel') sidePanelRef: any;
  @ViewChild('associateIterationModal') associateIterationModal: any;

  selectType: string = 'checkbox';
  @ViewChild('toolbarHeight') toolbarHeight: ElementRef;
  @ViewChild('containerHeight') containerHeight: ElementRef;
  @ViewChild('myTable') table: any;

  showTree: boolean = true;
  wiLength: number;
  resolvedIncludedAC : boolean;
  resolvedWorkItems: WorkItem[] = [];
  nonMatchingParentIds: Array<string>;
  wiParentIds: Array<string> = [];
  selectedRows: any = [];
  detailExpandedRows: any = [];
  expanded: any = {};
  datatableWorkitems: any[] = [];
  columns: any[];
  isTableConfigOpen: boolean = false;
  emptyStateConfig: any = {};
  workItems: WorkItem[] = [];
  prevWorkItemLength: number = 0;
  workItemTypes: WorkItemType[] = [];
  workItemToMove: WorkItem;
  workItemDetail: WorkItem;
  currentWorkItem: WorkItem = null;
  addingWorkItem = false;
  showOverlay: Boolean;
  loggedIn: Boolean = false;
  contentItemHeight: number = 50;
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
  private groupTypes: GroupTypesModel[] = [];
  private quickAddContext: String[] = [];
  private initialGroup = [];
  private included: WorkItem[];
  private _lastTagetContentHeight: number = 0;
  private _scrollTrigger = 5;
  private _lastCheckedScrollHeight = 0;

  constructor(
    private labelService: LabelService,
    private cookieService: CookieService,
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
    private renderer: Renderer2,
    private store: Store<AppState>) {}

  ngOnInit(): void {

    this.store.subscribe((val) => {
      console.log('####-1', val);
    })

    // If there is an iteration on the URL
    // Setting the value to currentIteration
    // BehaviorSubject so that we can compare
    // on update the value on URL

    const queryParams = this.route.snapshot.queryParams;
    if(Object.keys(queryParams).length === 0 || process.env.ENV == 'inmemory') {
      this.setDefaultUrl();
    } else {
      if (Object.keys(queryParams).indexOf('iteration') > -1) {
        this.currentIteration = new BehaviorSubject(queryParams['iteration']);
      } else {
        this.currentIteration = new BehaviorSubject(null);
      }
    }
    this.listenToEvents();
    this.loggedIn = this.auth.isLoggedIn();

    // Cookie for datatableColumn config
    if(!this.cookieService.getCookie(datatableColumn.length).status) {
      this.cookieService.setCookie('datatableColumn', datatableColumn);
      this.columns = datatableColumn;
    } else {
      let temp = this.cookieService.getCookie(datatableColumn.length)
      this.columns = temp.array;
    }

    this.emptyStateConfig = {
      info: 'There are no Work Items for your selected criteria',
      title: 'No Work Items Available'
    } as EmptyStateConfig;
  }

  ngAfterViewChecked() {
    let oldHeight = 0;
    this.authUser = cloneDeep(this.route.snapshot.data['authuser']);
    if (this.workItems.length != this.prevWorkItemLength) {
      //this.treeList.update();
      this.prevWorkItemLength = this.workItems.length;
    }

    if(this.toolbarHeight) {
      let toolbarHt:number =  this.toolbarHeight.nativeElement.offsetHeight;
      let quickaddHt:number =  0;
      if(document.getElementsByClassName('f8-wi-list__quick-add-wrapper').length > 0) {
        quickaddHt = (document.getElementsByClassName('f8-wi-list__quick-add-wrapper')[0] as HTMLElement).offsetHeight;
      }
      let hdrHeight:number = 0;
      if(document.getElementsByClassName('navbar-pf').length > 0) {
        hdrHeight = (document.getElementsByClassName('navbar-pf')[0] as HTMLElement).offsetHeight;
      }
      let expHeight: number = 0;
      let targetHeight: number;
      let targetContHeight: number;
      if (document.getElementsByClassName('experimental-bar').length > 0){
        expHeight = (document.getElementsByClassName('experimental-bar')[0] as HTMLElement).offsetHeight;
      } else if (document.getElementsByClassName('system-error-bar').length > 0) {
        expHeight = (document.getElementsByClassName('system-error-bar')[0] as HTMLElement).offsetHeight;
      }
      targetHeight = window.innerHeight - (toolbarHt + quickaddHt + hdrHeight + expHeight);
      this.renderer.setStyle(this.listContainer.nativeElement, 'height', targetHeight + "px");
      targetContHeight = window.innerHeight - (hdrHeight + expHeight);
      this.renderer.setStyle(this.containerHeight.nativeElement, 'height', targetContHeight - 3 + "px");
      if (document.getElementsByClassName('experimental-bar').length > 0 &&
      !document.getElementsByClassName('experimental-bar')[0].classList.contains('experimental-bar-minimal')) {
        expHeight = (document.getElementsByClassName('experimental-bar')[0] as HTMLElement).offsetHeight;
        targetHeight = window.innerHeight - (toolbarHt + quickaddHt + hdrHeight + expHeight);
        this.renderer.setStyle(this.listContainer.nativeElement, 'height', targetHeight + "px");
        targetContHeight = window.innerHeight - (hdrHeight + expHeight);
        this.renderer.setStyle(this.containerHeight.nativeElement, 'height', targetContHeight - 3 + "px");
      } else if (document.getElementsByClassName('experimental-bar').length > 0 &&
          document.getElementsByClassName('experimental-bar')[0].classList.contains('experimental-bar-minimal')) {
            targetHeight = window.innerHeight - (toolbarHt + quickaddHt + hdrHeight);
            this.renderer.setStyle(this.listContainer.nativeElement, 'height', targetHeight - 25 + "px");
      }

      if (this._lastTagetContentHeight !== targetContHeight) {
        this._lastTagetContentHeight = targetContHeight;
        this.initWiItems(Math.ceil(targetContHeight / this.contentItemHeight) + 20); // +20 is for demo purpose
      }
    }

    if (document.getElementsByClassName('planner-hack-title-truncate').length) {
      let arr = document.getElementsByClassName('planner-hack-title-truncate');
      for(let i = 0; i < arr.length; i++) {
        arr[i].parentElement.style.display = 'flex';
      }
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
    this.iterationService.resetIterations();
    this.eventListeners.forEach(subscriber => subscriber.unsubscribe());
    if (this.spaceSubscription) {
      this.spaceSubscription.unsubscribe();
    }
    document.getElementsByTagName('body')[0].style.overflow = "auto";
  }

  setDefaultUrl() {
    //redirect to default type group
    //get space id
    this.spaces.current.subscribe(space => {
      if (space) {
        const spaceId = space.id;
        //get groupsgroups
        this.groupTypesService.getGroupTypes().subscribe(groupTypes => {
          const defaultGroupName = groupTypes[0].attributes.name;
          this.groupTypesService.setCurrentGroupType(groupTypes[0].relationships.typeList, groupTypes[0].attributes.bucket);
          //Query for work item type group
          const type_query = this.filterService.queryBuilder('$WITGROUP', this.filterService.equal_notation, defaultGroupName);
          //Query for space
          const space_query = this.filterService.queryBuilder('space',this.filterService.equal_notation, spaceId);
          //Join type and space query
          const first_join = this.filterService.queryJoiner({}, this.filterService.and_notation, space_query );
          const second_join = this.filterService.queryJoiner(first_join, this.filterService.and_notation, type_query );
          let query = this.filterService.jsonToQuery(second_join);
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { q: query }
          });
        });
      }
    });
  }

  // model handlers

  initWiItems(pageSize: any): void {
    this.pageSize = pageSize;
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
        this.filterService.getFilters().subscribe(filters =>
          filters.forEach(f => this.filters.push(f.attributes.key))
        );
  }

  getCurrentGroupType() {
    //if initialGroup is undefined, the page has been refreshed - find  group context based on URL
    if ( this.route.snapshot.queryParams['q'] ) {
      let urlArray = this.route.snapshot.queryParams['q'].split('WITGROUP:');
      if (urlArray.length > 1 ) {
        //If wit group is one of the parameters
        let ind = urlArray[1].indexOf(' $AND ');
        let witGroupName = '';
        if (ind >= 0) {
          witGroupName = urlArray[1].substring(0,ind);
        } else {
          //if wit group is the last query
          witGroupName = urlArray[1].replace(')','');
        }
        let witGroupList = this.groupTypesService.getWitGroupList();
        if( witGroupList.length > 0 ) {
          let selectedWitGroup = witGroupList.find(witg => witg.attributes.name === witGroupName);
          this.groupTypesService.setCurrentGroupType(selectedWitGroup.relationships.typeList.data, witGroupName);
        }
      } else {
        this.initialGroup = this.groupTypesService.getCurrentGroupType();
      }
    } else {
      //redirect to the first group type hierachy
      this.initialGroup = this.groupTypesService.getCurrentGroupType();
      //set the url
    }
  }

  loadWorkItems(): void {
    const queryParams = this.route.snapshot.queryParams;
    if(Object.keys(queryParams).length === 0)
      this.setDefaultUrl();
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
      this.labelService.getLabels(),
      this.groupTypesService.getGroupTypes()
    ).take(1).do((items) => {
      const iterations = this.iterations = items[0];
      this.workItemTypes = items[1];
      this.areas = items[2];
      this.loggedInUser = items[3];
      this.labels = items[4];
      this.groupTypes = items[5];
      this.getCurrentGroupType();
      //set the context for the quick add based on which type group is selected
      this.quickAddContext = this.groupTypesService.getCurrentGroupType();
    })
      .switchMap((items) => {
        let appliedFilters = this.filterService.getAppliedFilters(true);
        // remove the filter item from the filters
        for (let f = 0; f < appliedFilters.length; f++) {
          if (appliedFilters[f].paramKey == 'filter[parentexists]') {
            appliedFilters.splice(f, 1);
          }
        }
        this.logger.log('Requesting work items with filters: ' + JSON.stringify(appliedFilters));
        let newFilterObj = {};
        appliedFilters.forEach(item => {
          newFilterObj[item.id] = item.value;
        });
        let payload = {};
        if (this.route.snapshot.queryParams['q']) {
          let urlString = this.route.snapshot.queryParams['q']
            .replace(' ','')
            .replace('$AND',' ')
            .replace('$OR',' ')
            .replace('(','')
            .replace(')','');
          let temp_arr = urlString.split(' ');
          for(let i = 0; i < temp_arr.length; i++) {
            let arr = temp_arr[i].split(':')
            //check if it belongs in filter array
            if (this.filters.indexOf(arr[0]) < 0 && arr[1] !== undefined)
              newFilterObj[arr[0]] = arr[1];
          }
          let exp = this.filterService.queryToJson(this.filterService.constructQueryURL('', newFilterObj));
          exp['$OPTS'] = {'tree-view': true};
          Object.assign(payload, {
            expression: exp
          });
        } else {
          let exp = this.filterService.queryToJson(this.filterService.constructQueryURL('', newFilterObj));
          exp['$OPTS'] = {'tree-view': true};
          Object.assign(payload, {
            expression: exp
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
        this.nonMatchingParentIds = workItemResp.ancestorIDs;
        const included = workItemResp.included;
        this.wiLength = 0;
        this.resolvedWorkItems = this.workItemService.resolveWorkItems(
          workItems,
          this.iterations,
          [], // We don't want to static resolve user at this point
          this.workItemTypes,
          this.labels
        );
        this.included = this.workItemService.resolveWorkItems(
          included,
          this.iterations,
          [], // We don't want to static resolve user at this point
          this.workItemTypes,
          this.labels
        );
        this.wiParentIds = [
          ...this.getParentIdsAll(this.resolvedWorkItems),
          ...this.getParentIdsAll(this.included)
        ];
        this.resolvedIncludedAC = false;
        this.updateTableWorkitems();
        this.workItemDataService.setItems(this.workItems);
        // Resolve assignees and creator
        if (!this.workItems || this.workItems.length == 0) {
          // if there are no work items, unlock the ui here
          this.uiLockedList = false;
        }
        if(!this.resolvedIncludedAC)
          this.resolveCreatorAssignee();
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
        this.wiLength = this.workItems.length;
        const ancestorIDs = newWiItemResp.ancestorIDs;
        const newItems = this.workItemService.resolveWorkItems(
          workItems,
          this.iterations,
          [],
          this.workItemTypes,
          this.labels
        ).filter((item) => {
          return this.workItems.findIndex(i => i.id === item.id) === -1;
        });
        this.resolvedWorkItems = [...this.resolvedWorkItems, ...newItems];

          const newIncluded = this.workItemService.resolveWorkItems(
            newWiItemResp.included,
            this.iterations,
            [],
            this.workItemTypes,
            this.labels
          ).filter((item) => {
            return this.included.findIndex(i => i.id === item.id) === -1;
          });
          this.wiParentIds = [
            ...this.wiParentIds,
            ...this.getParentIdsAll(newItems),
            ...this.getParentIdsAll(newIncluded)
          ];
          this.nonMatchingParentIds = [...this.nonMatchingParentIds, ...ancestorIDs];
          this.included = [...this.included, ...newIncluded];
          this.resolvedIncludedAC = false;
          this.updateTableWorkitems();
        this.workItemDataService.setItems(this.workItems);
        console.log('Performance :: Fetching more list items - ' + (t2 - t1) + ' milliseconds.');
        // Resolve assignees and creator
        if(!this.resolvedIncludedAC){
          this.resolveCreatorAssignee(this.wiLength);
        }
      },
      (e) => console.log(e));
  }
  resolveCreatorAssignee(wiLength: number = 0) {
    // resolve assignees
    const t3 = performance.now();
    this.workItems.slice(wiLength).forEach((item, index) => {
      this.workItemService.resolveAssignees(item.relationships.assignees).take(1)
        .subscribe(assignees => {
          item.relationships.assignees.data = assignees;
          // After the assignees is resolved
          // We should add it to the datatableWorkitems
          this.datatableWorkitems[wiLength + index].assignees = assignees;
          if (index == this.workItems.length - 1) {
            const t4 = performance.now();
            console.log('Performance :: Resolved all the users - ' + (t4 - t3) + ' milliseconds.');
            this.uiLockedList = false;
          }
        })
    });

    // Resolve creators
    const t5 = performance.now();
    const allCreatorURLs: string[] = this.workItems.slice(wiLength).reduce(
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
        this.workItems.slice(wiLength).forEach((item, index) => {
          item.relationships.creator.data = creators.find(creator => {
            if (item.relationships.creator.data.id === creator.id) {
              // After the assignees is resolved
              // We should add it to the datatableWorkitems
              this.datatableWorkitems[wiLength + index].creator = creator;
              return true;
            } else {
              return false;
            }
          })
        });
        const t6 = performance.now();
        console.log('Performance :: Resolved all the creators - ' + (t6 - t5) + ' milliseconds.');
      })
  }

  updateTableWorkitems() {
    if (this.showTree) {
      this.datatableWorkitems = [
        ...this.tableWorkitem(this.resolvedWorkItems, null, true),
        ...this.tableWorkitem(this.included, null, false)
      ];
      this.workItems = [...this.resolvedWorkItems, ...this.included];
      if(!this.resolvedIncludedAC){
        this.resolveCreatorAssignee(this.wiLength);
        this.resolvedIncludedAC = true;
      }
    } else {
      this.datatableWorkitems = [...this.tableWorkitem(this.resolvedWorkItems)];
      this.workItems = [...this.resolvedWorkItems];
    }
  }

  loadChildren(workItem: WorkItem): Observable<WorkItem[]> {
    return this.workItemService.getChildren(workItem)
      //set the parent information for the child WIs
      .map((workItems: WorkItem[]) => {
        workItems.map(wi => {
          wi.relationships.parent = { data: {} as WorkItem };
          wi.relationships.parent.data = workItem;
        });
        return workItems;
      })
      .map((workItems: WorkItem[]) => this.workItemService.resolveWorkItems(
        workItems,
        this.iterations,
        [], // We don't want to static resolve user at this point
        this.workItemTypes,
        this.labels
      ))
      .do((workItems: WorkItem[]) => {
        // filter out childrens are not loaded yet
        const childrenItems = workItems
          .filter(i => {
            return this.datatableWorkitems
              .findIndex(item => item.id === i.id) === -1;
          });
        this.datatableWorkitems = [
          ...this.datatableWorkitems,
          ...this.tableWorkitem(childrenItems, workItem.id)
        ];
        return workItems;
      })
      .map((workItems: WorkItem[]) => {
        const startIndex = this.workItems.length;
        this.workItems = [
          ...this.workItems,
          ...workItems
        ];
        this.workItemDataService.setItems(this.workItems);
        return {workItems, startIndex};
      })
      .map((values) => {
        // Resolve creator
        const allCreatorURLs: string[] = this.workItems.slice(values.startIndex).reduce(
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
            this.workItems.slice(values.startIndex).forEach((item, index) => {
              item.relationships.creator.data = creators.find(creator => {
                if (item.relationships.creator.data.id === creator.id) {
                  // After the assignees is resolved
                  // We should add it to the datatableWorkitems
                  this.datatableWorkitems[values.startIndex + index].creator = creator;
                  return true;
                } else {
                  return false;
                }
              })
            });
          })

        // Resolve assignees
        const allAssigneeURLs: string[] = this.workItems.slice(values.startIndex).reduce(
          (urls: string[], workItem: WorkItem) => {
            const assigneeURLs = workItem.relationships.assignees.data ?
              workItem.relationships.assignees.data.map((assignee: User) => {
                return assignee.links.self;
              }) : [];
            return [...urls, ...assigneeURLs]
          }, []
        ).reduce(
          (uniqueURLs: string[], url: string) => {
            if (!uniqueURLs.find(item => item === url)) {
              return [...uniqueURLs, url]
            } else {
              return uniqueURLs;
            }
          }, [] as string[]);

        this.workItemService.getUsersByURLs(allAssigneeURLs)
          .subscribe((assignees: User[]) => {
            this.workItems.slice(values.startIndex).forEach((item, index) => {
              item.relationships.assignees.data = assignees.filter(assignee => {
                return item.relationships.assignees.data
                  .findIndex(a => a.id === assignee.id) > -1;
              });
              this.datatableWorkitems[values.startIndex + index].assignees =
                item.relationships.assignees.data;
            });
          })

        return values.workItems;
      })
  }

  getParentIdsAll(items) {
    return items.reduce((parentIds, item) => {
      const parentid = item.relationships.parent && item.relationships.parent.data ?
        item.relationships.parent.data.id : null;
      if (parentid && parentIds.findIndex(i => i === parentid) === -1) {
        return [...parentIds, parentid];
      }
      return parentIds;
    }, [])
  }

  onPreview(id: string): void {
    this.workItemDataService.getItem(id).subscribe(workItem => {
      this.detailPreview.openPreview(workItem);   });
  }

  onCreateWorkItemStart(event) {
    const parentId = event.parentId;
    if (parentId) {
      const index = this.datatableWorkitems.findIndex(i => i.id === parentId);
      if (index > -1) {
        this.datatableWorkitems[index].treeStatus = 'loading';
        this.table.rowDetail.collapseAllRows();
        this.detailExpandedRows = [];
      }
    }
  }

  onCreateWorkItem(workItem) {
    this.workItems = [workItem, ...this.workItems];
    this.resolvedWorkItems = [workItem, ...this.resolvedWorkItems];
    this.datatableWorkitems = [
      ...this.tableWorkitem([this.workItems[0]]),
      ...this.datatableWorkitems
    ];
    this.workItemDataService.setItems([this.workItems[0]]);
  }

  onMoveToTop(id: string): void {
    this.workItemDataService.getItem(id).subscribe((workItem) => {
    this.workItemDetail = workItem;
    this.workItemService.reOrderWorkItem(this.workItemDetail, null, 'top')
      .subscribe((updatedWorkItem) => {
        let currentIndex = this.workItems.findIndex((item) => item.id === updatedWorkItem.id);
        // Putting on top of the list
        this.workItems.splice(0, 0, this.workItems[currentIndex]);
        // Removing duplicate old item
        this.workItems.splice(currentIndex + 1, 1);
        // Remove duplicate from datatable workitems
        this.datatableWorkitems.splice(currentIndex, 1);
        this.workItems[0].attributes['version'] = updatedWorkItem.attributes['version'];
        // Update datatable WorkItems
        this.datatableWorkitems = [...this.tableWorkitem([this.workItems[0]]), ...this.datatableWorkitems];
      });
    });
  }

  onMoveToBottom(id: string): void {
    this.workItemDataService.getItem(id).subscribe((workItem) => {
    this.workItemDetail = workItem;
    this.workItemService.reOrderWorkItem(this.workItemDetail, null, 'bottom')
      .subscribe((updatedWorkItem) => {
        let currentIndex = this.workItems.findIndex((item) => item.id === updatedWorkItem.id);
        //move the item as the last of the loaded list
        this.workItems.splice((this.workItems.length), 0, this.workItems[currentIndex]);
        //remove the duplicate element
        this.workItems.splice(currentIndex, 1);
        // remove duplicate from datatable
        this.datatableWorkitems.splice(currentIndex, 1);
        this.workItems[this.workItems.length - 1].attributes['version'] = updatedWorkItem.attributes['version'];

        // Update datatable WorkItems
        this.datatableWorkitems = [...this.datatableWorkitems, ...this.tableWorkitem([this.workItems[this.workItems.length - 1]])]
        this.listContainer.nativeElement.scrollTop = this.workItems.length * this.contentItemHeight;
      });
    });
  }

  onAssociateIteration(id: string): void {
    this.workItemDataService.getItem(id).subscribe((item) => {
    this.currentWorkItem = item;
    this.associateIterationModal.workItem = item;
    this.associateIterationModal.open();
    });
  }

  onOpen(id: string){
    this.workItemDataService.getItem(id).subscribe((item) => {
      let link = this.router.url.split('/list')[0] + '/detail/' + item.id;
      this.router.navigateByUrl(link, { relativeTo: this.route });
    });
  }

  onMoveToBacklog(id: string): void {
    this.workItemDataService.getItem(id).subscribe((item) => {
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
        .subscribe(item => {
          let resolvedworkItem = this.workItemService.resolveWorkItems(
            [item.wi],
            this.iterations,
            [],
            this.workItemTypes,
            this.labels
          )[0];
          // Resolve creator
          resolvedworkItem.relationships.creator.data = this.loggedInUser as User;
          this.onCreateWorkItem(resolvedworkItem);
          if (this.filterService.doesMatchCurrentFilter(resolvedworkItem)) {
            try {
              this.notifications.message({
                message: resolvedworkItem.attributes['system.title'] + ' created.',
                type: NotificationType.SUCCESS
              } as Notification);
            } catch (e) {
              console.log('Error displaying notification. Added WI matches the applied filters.')
            }
          } else {
            try {
              this.notifications.message({
                message: resolvedworkItem.attributes['system.title'] + ' created. Added WI does not match the applied filters',
                type: NotificationType.SUCCESS
              } as Notification);
            } catch (e) {
              console.log('Error displaying notification. Added WI does not match the applied filters.')
            }
          }
          if (item.status) {
            this.onDetailPreview(resolvedworkItem.id);
          }
        })
    );

    this.eventListeners.push(
      this.workItemService.addWIChildObservable
        .subscribe((workitemDetail) => {
          let parentIndex = this.datatableWorkitems.findIndex(i => i.id === workitemDetail.pwid);
          if (parentIndex > -1) {
            this.datatableWorkitems[parentIndex].treeStatus = 'collapsed';
            this.datatableWorkitems[parentIndex].childrenLoaded = false;
            this.onTreeAction({
              rowIndex: parentIndex,
              row: this.datatableWorkitems[parentIndex]
            });
          }
          if (workitemDetail.status) {
            this.onDetailPreview(workitemDetail.wid);
          }
        })
    );

    this.eventListeners.push(
      this.workItemService.editWIObservable.subscribe(updatedItem => {
        let index = this.workItems.findIndex((item) => item.id === updatedItem.id);
        let bold = this.datatableWorkitems.filter((item) => item.id === updatedItem.id)[0].bold;
        if (this.filterService.doesMatchCurrentFilter(updatedItem)) {
          updatedItem.hasChildren = updatedItem.relationships.children.meta.hasChildren;
          updatedItem.relationships['parent'] = this.workItems[index].relationships.parent;
          if (index > -1) {
            this.workItems[index] = updatedItem;
            let resolvedWorkItemsIndex = this.resolvedWorkItems.findIndex((item) => item.id === updatedItem.id);
            let includedIndex = this.included.findIndex((item) => item.id === updatedItem.id);
            if(resolvedWorkItemsIndex > -1)
              this.resolvedWorkItems[resolvedWorkItemsIndex] = updatedItem;
            if(includedIndex > -1)
              this.included[includedIndex] = updatedItem;
            let updatedTableItem = this.tableWorkitem([updatedItem], this.datatableWorkitems[index].parentId, bold)[0];
            updatedTableItem.treeStatus = this.datatableWorkitems[index].treeStatus;
            updatedTableItem.childrenLoaded = this.datatableWorkitems[index].childrenLoaded;
            this.datatableWorkitems = [
              ...this.datatableWorkitems.slice(0, index),
              updatedTableItem,
              ...this.datatableWorkitems.slice(index + 1)
            ];
          } else {
            //Scenario: work item detail panel is open.
            //Change a value so that it does not match the applied filter and gets removed from the list
            //The panel is still open - set back the value(s) so that the work item matches the applied
            //filters
            //add the WI at the top of the list

            if (!this.children.find(c => c === updatedItem.id)) {
              // If the item is not a child of any other item
              this.workItems.splice(0, 0, updatedItem);
              this.datatableWorkitems = [...this.tableWorkitem([updatedItem]), ...this.datatableWorkitems];
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

    this.eventListeners.push(
      this.workItemService.showTree.subscribe(status => {
        this.showTree = status;
        this.detailExpandedRows = [];
        this.updateTableWorkitems();
      })
    );
  }

  //ngx-datatable methods

  handleReorder(event) {
    if(event.newValue !== 0) {
      this.columns[event.prevValue - 1].index = event.newValue;
      this.columns[event.newValue - 1].index = event.prevValue;
      this.columns = sortBy(this.columns, 'index');
      this.cookieService.setCookie('datatableColumn', this.columns);
    }
  }
  onSelect({ selected }) {
    if (this.detailExpandedRows.length > 0 && this.detailExpandedRows[0].id !== selected[0].id) {
      this.table.rowDetail.collapseAllRows();
      this.detailExpandedRows = [];
    }

    this.workItemDataService.getItem(selected[0].id).subscribe(workItem => {
      this.workItemService.emitSelectedWI(workItem);
    });
  }

  toggleExpandRow(row, quickAddEnabled = true) {
    if (quickAddEnabled && this.loggedIn && this.showTree) {
      const index = this.detailExpandedRows.findIndex(r => r.id === row.id);
      if (index > -1) {
        // For collapsing
        this.table.rowDetail.toggleExpandRow(this.detailExpandedRows[index]);
        this.detailExpandedRows.splice(index, 1);
      } else {
        // For expanding
        this.detailExpandedRows.forEach(r => {
          this.table.rowDetail.toggleExpandRow(r);
        });
        this.detailExpandedRows = [];
        this.table.rowDetail.toggleExpandRow(row);
        this.detailExpandedRows.push(row);
      }
    }
  }

  onDetailToggle(event) {
    // console.log('Detail Toggled ####-2', event);
  }

  onDetailPreview(id): void {
    event.stopPropagation();
    this.router.navigateByUrl(
      this.router.url.split('plan')[0] + 'plan/detail/' + id,
      { relativeTo: this.route }
    );
  }

  tableWorkitem(workItems: WorkItem[], parentId: string | null = null, matchingQuery: boolean = false): any {

    return workItems.map(element => {
      if (this.showTree) {
        const treeStatus = this.setTreeStatus(element, matchingQuery);
        return {
          id: element.id,
          number: element.attributes['system.number'],
          type: element.relationships.baseType ? element.relationships.baseType : '',
          title: element.attributes['system.title'],
          labels: element.relationships.labels.data,
          iteration: element.relationships.iteration.data,
          creator: element.relationships.creator.data,
          assignees: element.relationships.assignees.data,
          state: element.attributes['system.state'],
          // Extra items for table
          treeStatus: treeStatus,
          parentId: element.relationships.parent && element.relationships.parent.data ? element.relationships.parent.data.id : parentId,
          childrenLoaded: treeStatus === 'expanded' ? true : false,
          bold: matchingQuery
        }
      } else {
        return {
          id: element.id,
          number: element.attributes['system.number'],
          type: element.relationships.baseType ? element.relationships.baseType : '',
          title: element.attributes['system.title'],
          labels: element.relationships.labels.data,
          iteration: element.relationships.iteration.data,
          creator: element.relationships.creator.data,
          assignees: element.relationships.assignees.data,
          state: element.attributes['system.state'],
        }
      }
    });
  }


  setTreeStatus(element, matchingQuery) {
    if(matchingQuery) {
      if (this.wiParentIds.findIndex(i => i === element.id) > -1)
        return 'expanded';
      return element.relationships.children.meta.hasChildren ? 'collapsed' : 'disabled';
    } else {
      if (this.nonMatchingParentIds.findIndex(i => i === element.id) > -1)
        return 'expanded';
      return element.relationships.children.meta.hasChildren ? 'collapsed' : 'disabled';
    }
  }

  // Start: Settings(tableConfig) dropdown

  toggleCheckbox(event, col) {
    if(event.target.checked) {
      col.selected = true;
    } else {
      col.selected = false;
    }

  }
  moveToDisplay() {
    this.columns.filter(col => col.selected).forEach(col => {
      if(col.display === true) return;
      col.selected = false;
      col.display = true;
      col.showInDisplay = true;
      col.available = false;
    })
    this.updateColumnIndex();
    this.cookieService.setCookie('datatableColumn', this.columns);
  }

  moveToAvailable() {
    this.columns.filter(col => col.selected).forEach(col => {
      if(col.available === true) return;
      col.selected = false;
      col.display = false;
      col.showInDisplay = false;
      col.available = true;
    });
    this.updateColumnIndex();
    this.cookieService.setCookie('datatableColumn', this.columns);
  }

  updateColumnIndex() {
    let index = 0;
    this.columns.forEach(col => {
      if(col.display === true) {
        col.index = index + 1;
        index += 1;
      } else {
        col.index = undefined;
      }
    });
    this.columns = sortBy(this.columns, 'index');
  }

  tableConfigChange(value: boolean) {
    this.isTableConfigOpen = value;
  }

  tableConfigToggle(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isTableConfigOpen = false;
  }

  // End:  Setting(tableConfig) Dropdown

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
    setTimeout(() => {
    this.datatableWorkitems = [...this.datatableWorkitems];
    }, 500);
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

  onScroll(event) {
    if (event.path &&
        this._lastCheckedScrollHeight < event.path[0].scrollHeight) {
      let scrollLeft = ((event.path[0].scrollHeight -
        (event.path[0].offsetHeight + event.path[0].scrollTop)) * 100) /
        event.path[0].scrollHeight;
      if (scrollLeft <= this._scrollTrigger) {
        this._lastCheckedScrollHeight = event.path[0].scrollHeight;
        this.fetchMoreWiItems();
      }
    }
  }

  onTreeAction(event: any) {
    const index = event.rowIndex;
    const row = event.row;
    if (this.datatableWorkitems[index].treeStatus === 'collapsed') {
      this.datatableWorkitems[index].treeStatus = 'loading';
      if (!this.datatableWorkitems[index].childrenLoaded) {
        this.loadChildren(this.workItems[index])
          .subscribe((wis) => {
            this.datatableWorkitems[index].childrenLoaded = true;
            this.datatableWorkitems[index].treeStatus = 'expanded';
          })
      } else {
        this.datatableWorkitems[index].treeStatus = 'expanded';
        this.datatableWorkitems = [...this.datatableWorkitems];
      }
    } else {
      this.datatableWorkitems[index].treeStatus = 'collapsed';
      this.datatableWorkitems = [...this.datatableWorkitems];
    }
  }

  getChildWorkItemTypes(types: WorkItemType[]) {
    if (types) {
      return this.workItemTypes.filter((item: WorkItemType) => {
        return types.findIndex(type => type.id === item.id) > -1;
      })
    } else {
      return [];
    }
  }
}
