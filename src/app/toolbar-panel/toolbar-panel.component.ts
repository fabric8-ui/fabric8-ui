import { Component, Input, OnInit, AfterViewInit, TemplateRef, ViewChild, ViewEncapsulation, OnChanges, Output, OnDestroy, EventEmitter, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { cloneDeep } from 'lodash';
import { Broadcaster } from 'ngx-base';
import { AuthenticationService, UserService, User } from 'ngx-login-client';
import { Subscription } from 'rxjs/Subscription';
import { Space, Spaces } from 'ngx-fabric8-wit';

import { AreaModel } from '../models/area.model';
import { AreaService } from '../area/area.service';
import { FilterModel } from './../models/filter.model';
import { CollaboratorService } from './../collaborator/collaborator.service';
import { FilterService } from '../shared/filter.service';
import { WorkItemService } from './../work-item/work-item.service';
import { WorkItemListEntryComponent } from './../work-item/work-item-list/work-item-list-entry/work-item-list-entry.component';
import { WorkItemType } from './../models/work-item-type';
import { WorkItem } from './../models/work-item';

import {
  AlmArrayFilter,
  FilterConfig,
  FilterEvent,
  FilterField,
  ToolbarConfig
} from 'ngx-widgets';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'toolbar-panel',
  templateUrl: './toolbar-panel.component.html',
  styleUrls: ['./toolbar-panel.component.scss']
})
export class ToolbarPanelComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('actions') actionsTemplate: TemplateRef<any>;
  @ViewChild('add') addTemplate: TemplateRef<any>;

  @Input() context: string;
  @Input() wiTypes: WorkItemType[] = [];
  @Input() areas: AreaModel[] = [];
  @Input() loggedInUser: User | Object = {};
  @Input() currentBoardType: WorkItemType | Object = {};

  @Output() showDetailEvent: EventEmitter<any | null> = new EventEmitter();

  filters: any[] = [];
  loggedIn: boolean = false;
  editEnabled: boolean = false;
  workItemToMove: WorkItemListEntryComponent;
  workItemDetail: WorkItem;
  showTypesOptions: boolean = false;
  spaceSubscription: Subscription = null;
  eventListeners: any[] = [];
  currentQueryParams: Object = {};
  existingAllowedQueryParams: Object = {};
  filterConfig: FilterConfig = {
      fields: [{
        id: 'type',
        title:  'Select',
        placeholder: 'Select a filter type',
        type: 'select'
      }],
      appliedFilters: [],
      resultsCount: -1, // Hide
      selectedCount: 0,
      totalCount: 0,
      tooltipPlacement: 'right'
    } as FilterConfig;
  toolbarConfig: ToolbarConfig = {
      actionConfig: {},
      filterConfig: this.filterConfig
    } as ToolbarConfig;
  allowedFilterKeys: string[] = [
    'assignee',
    'area'
  ];

  private queryParamSubscriber = null;

  // This flag tells if an update for filter is coming from
  // tool bar internaly or not
  private internalFilterChange = false;
  private firstVisit = true;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private broadcaster: Broadcaster,
    private areaService: AreaService,
    private collaboratorService: CollaboratorService,
    private filterService: FilterService,
    private workItemService: WorkItemService,
    private auth: AuthenticationService,
    private spaces: Spaces,
    private userService: UserService) {
  }

  ngOnInit() {
    console.log('[FilterPanelComponent] Running in context: ' + this.context);
    this.loggedIn = this.auth.isLoggedIn();
    this.firstVisit = true;
    if (this.context === 'listview') {
      this.allowedFilterKeys.push('workitemtype');
    } else {
      // this.allowedFilterKeys.push('workitemtype');
    }

    // this.filterService.getFilters().then(response => {
    //   console.log(response);
    // });

    // we need to get the wi types for the types dropdown on the board item
    // even when there is no active space change (initial population).
    this.spaceSubscription = this.spaces.current.subscribe(space => {
      console.log(this.eventListeners);
      if (space) {
        console.log('[FilterPanelComponent] New Space selected: ' + space.attributes.name);
        this.editEnabled = true;
      } else {
        console.log('[FilterPanelComponent] Space deselected.');
        this.editEnabled = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.listenToEvents();
    this.eventListeners.push(
      this.filterService.getFilters()
        .subscribe(filters => this.setFilterTypes(filters))
    );
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  ngOnDestroy() {
    this.queryParamSubscriber.unsubscribe();
    this.eventListeners.map((e) => e.unsubscribe());
  }

  setFilterTypes(filters: FilterModel[]) {
    filters = filters.filter(f => this.allowedFilterKeys.indexOf(
      f.attributes.query.substring(
            f.attributes.query.lastIndexOf("[")+1,
            f.attributes.query.lastIndexOf("]")
      )) > -1);

    this.toolbarConfig.filterConfig.fields = [
      this.toolbarConfig.filterConfig.fields[0],
      ...filters.map(filter => {
        const type = filter.attributes.query.substring(
            filter.attributes.query.lastIndexOf("[")+1,
            filter.attributes.query.lastIndexOf("]")
          );
        return {
          id: type,
          title: filter.attributes.title,
          placeholder: filter.attributes.description,
          type: type === 'assignee' ? 'typeahead' : 'select',
          queries: []
        };
      })
    ];
    this.listenToQueryParams();
  }

  setAppliedFilterFromUrl() {
    const filterMap = this.getFilterMap();
    // Take all the existing params
    let params = cloneDeep(this.currentQueryParams);
    let keys = Object.keys(params);

    // Delete all the not-allowed params for this tool bar
    keys.forEach(key => {
      if(this.allowedFilterKeys.indexOf(key) === -1) {
        delete params[key]
      }
    });
    // Apply each param from URL that is allowed here
    // to the filter
    Object.keys(params).forEach((key, i) => {
      if (this.allowedFilterKeys.indexOf(key) > -1) {
        filterMap[key].datasource.take(1).subscribe(data => {
          const index = this.toolbarConfig.filterConfig.fields.findIndex(field => field.id === key);
          this.toolbarConfig.filterConfig.fields[index].queries = filterMap[key].datamap(data).queries;
          this.toolbarConfig.filterConfig.fields[index].primaryQueries = filterMap[key].datamap(data).primaryQueries;
          const selectedQuery = [
            ...this.toolbarConfig.filterConfig.fields[index].queries,
            ...this.toolbarConfig.filterConfig.fields[index].primaryQueries,
          ].find(
            item => item.value === params[key]
          );
          if (selectedQuery) {
            this.toolbarConfig.filterConfig.appliedFilters.push({
              field: this.toolbarConfig.filterConfig.fields[index],
              query: selectedQuery,
              value: params[key]
            });
            this.filterService.setFilterValues(key, selectedQuery.id);
            // When all the params are resolved
            // Apply the filter
            if (Object.keys(params).length - 1 == i) {
              this.filterService.applyFilter();
            }
          }
        });
      }
    });
  }

  filterChange($event: FilterEvent): void {

    // We don't support multiple filter for same type
    // i.e. no two filter by two different users as assignees
    // Unifying the filters with recent filter value
    let recentAppliedFilters = {};
    $event.appliedFilters.forEach((filter) => recentAppliedFilters[filter.field.id] = filter);
    this.toolbarConfig.filterConfig.appliedFilters = [];
    Object.keys(recentAppliedFilters).forEach((filterId) => {
      this.toolbarConfig.filterConfig.appliedFilters.push(recentAppliedFilters[filterId]);
    });

    // Initiate next query params from current query params
    let params = cloneDeep(this.currentQueryParams);
    this.allowedFilterKeys.forEach((key) => delete params[key]);

    // Clean allowed filter keys
    this.filterService.clearFilters(this.allowedFilterKeys);

    // Prepare query params
    this.toolbarConfig.filterConfig.appliedFilters.forEach((filter) => {
      params[filter.field.id] = filter.query.value;
      // Set this filter in filter service
      this.filterService.setFilterValues(filter.field.id, filter.query.id);
    });

    // Set the internal change flag to true
    // So that the URL subscriber does not take any action
    this.internalFilterChange = true;

    // Prepare navigation extra with query params
    let navigationExtras: NavigationExtras = {
      queryParams: params,
      relativeTo: this.route
    };

    // Navigated to filtered view
    this.router.navigate([], navigationExtras);
  }


  onChangeBoardType(type: WorkItemType) {
    this.currentBoardType = type;

    let params = cloneDeep(this.currentQueryParams);
    params['workitemtype'] = type.attributes.name;

    // Prepare navigation extra with query params
    let navigationExtras: NavigationExtras = {
      queryParams: params,
      relativeTo: this.route
    };

    // Navigated to filtered view
    this.router.navigate([], navigationExtras);
  }

  moveItem(moveto: string) {
    this.broadcaster.broadcast('move_item', moveto);
  };

  showTypes() {
    this.showTypesOptions = true;
  }

  closePanel() {
    this.showTypesOptions = false;
  }

  onChangeType(type: string) {
    this.showTypesOptions = false;
    this.router.navigate(['/work-item/list/detail/new?' + type]);
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

  showDetailType(event: MouseEvent): void {
    event.stopPropagation();
    this.showDetailEvent.emit();
  }

  getFilterMap() {
    return {
      area: {
        datasource: this.areaService.getAreas(),
        datamap: (areas) => {
          return {
            queries: areas.map(area => {return {id: area.id, value: area.attributes.name}}),
            primaryQueries: []
          }
        },
        getvalue: (area) => area.attributes.name
      },
      assignee: {
        datasource: Observable.combineLatest(this.collaboratorService.getCollaborators(), this.userService.getUser()),
        datamap: ([users, authUser]) => {
          if (Object.keys(authUser).length > 0) {
            users = users.filter(u => u.id !== authUser.id);
          }
          return {
            queries: users.map(user => {return {id: user.id, value: user.attributes.username, imageUrl: user.attributes.imageURL}}),
            primaryQueries: Object.keys(authUser).length ?
              [{id: authUser.id, value: authUser.attributes.username, imageUrl: authUser.attributes.imageURL}, {id: 'none', value: 'Unassigned'}] :
              [{id: 'none', value: 'Unassigned'}]
          }
        },
        getvalue: (user) => user.attributes.username
      },
      workitemtype: {
        datasource: this.workItemService.getWorkItemTypes(),
        datamap: (witypes) => {
          return {
            queries: witypes.map(witype => {return {id: witype.id, value: witype.attributes.name, iconClass: witype.attributes.icon}}),
            primaryQueries: []
          }
        },
        getvalue: (type) => type.attributes.name
      }
    }
  }

  selectFilterType(data) {
    const filterMap = this.getFilterMap();
    if (Object.keys(filterMap).indexOf(data.id) > -1) {
      const index = this.filterConfig.fields.findIndex(i => i.id === data.id);
      if (this.filterConfig.fields[index].queries.length === 0) {
        filterMap[data.id].datasource.subscribe(resp => {
          this.filterConfig.fields[index].queries = filterMap[data.id].datamap(resp).queries;
          this.filterConfig.fields[index].primaryQueries = filterMap[data.id].datamap(resp).primaryQueries;
        })
      }
    }
  }

  listenToEvents() {
    this.eventListeners.push(
      this.broadcaster.on<string>('logout')
        .subscribe(message => {
          this.loggedIn = false;
      })
    );
  }

  listenToQueryParams() {
    if (this.queryParamSubscriber === null)  {
      this.queryParamSubscriber =
        this.route.queryParams.subscribe((params) => {
          this.currentQueryParams = params;
          // If any of the allowed key present in the URL
          if (Object.keys(this.currentQueryParams).some(i => this.allowedFilterKeys.indexOf(i) > -1)) {
            // Changing filter internally
            if (this.internalFilterChange) {
              this.filterService.applyFilter();
              this.internalFilterChange = false;
            }
            // Applying filters on page reload or first load
            // Or navigated by the browser's arrow
            else {
              // Cleaning filters in service as it will reset in setAppliedFilterFromUrl
              this.toolbarConfig.filterConfig.appliedFilters = [];
              this.filterService.clearFilters(this.allowedFilterKeys);
              this.setAppliedFilterFromUrl();
            }
          }
          // Else clear the applied filter section
          else {
            // If filter value changed internally
            // Or with arrorw key navigated to a page with no allowed
            // filter params, then appliedFilters remains with values
            if (this.internalFilterChange || this.toolbarConfig.filterConfig.appliedFilters.length) {
              this.internalFilterChange = false;
              this.toolbarConfig.filterConfig.appliedFilters = [];
              this.filterService.clearFilters(this.allowedFilterKeys);
              this.filterService.applyFilter();
            } else {
              if (this.firstVisit) {
                this.firstVisit = false;
                this.filterService.applyFilter();
              }
            }
          }
      });
    }
  }
}
