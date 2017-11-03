import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
  Output,
  OnDestroy,
  EventEmitter
} from '@angular/core';
import {
  Router,
  ActivatedRoute,
  NavigationExtras
} from '@angular/router';
import { cloneDeep } from 'lodash';
import {
  FilterConfig,
  FilterEvent,
  ToolbarConfig
} from 'patternfly-ng';

import { Broadcaster } from 'ngx-base';
import { Spaces } from 'ngx-fabric8-wit';
import {
  AuthenticationService,
  UserService,
  User
} from 'ngx-login-client';

import { EventService } from './../../services/event.service';
import { AreaModel } from '../../models/area.model';
import { AreaService } from '../../services/area.service';
import { FilterModel } from '../../models/filter.model';
import { CollaboratorService } from '../../services/collaborator.service';
import { FilterService } from '../../services/filter.service';
import { LabelService } from '../../services/label.service';
import { WorkItemService } from '../../services/work-item.service';
import { WorkItemListEntryComponent } from '../work-item-list-entry/work-item-list-entry.component';
import { WorkItemType } from '../../models/work-item-type';
import { WorkItem } from '../../models/work-item';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'toolbar-panel',
  templateUrl: './toolbar-panel.component.html',
  styleUrls: ['./toolbar-panel.component.less']
})
export class ToolbarPanelComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() context: string;
  @Input() wiTypes: WorkItemType[] = [];
  @Input() areas: AreaModel[] = [];
  @Input() loggedInUser: User | Object = {};
  @Input() currentBoardType: WorkItemType | Object = {};

  @Output() onCreateNewWorkItemSelected: EventEmitter<any | null> = new EventEmitter();

  loggedIn: boolean = false;
  editEnabled: boolean = false;
  showTypesOptions: boolean = false;

  filters: any[] = [];
  workItemToMove: WorkItemListEntryComponent;
  workItemDetail: WorkItem;
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
  allowedFilterKeys: string[] = [];
  allowedMultipleFilterKeys: string[] = [
    'label'
  ];

  // the type of the list is changed (Hierarchy/Flat).
  currentListType: string = 'Hierarchy';

  private queryParamSubscriber = null;
  private savedFIlterFieldQueries = {};

  // This flag tells if an update for filter is coming from
  // tool bar internaly or not
  private internalFilterChange = false;
  private firstVisit = true;

  private separator = {
          id: 'separator',
          value: null,
          separator: true
      };
  private loader = {
          id: 'loader',
          value: 'Loading...',
          iconClass: 'fa-spinner'
      };

  constructor(
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private broadcaster: Broadcaster,
    private areaService: AreaService,
    private collaboratorService: CollaboratorService,
    private filterService: FilterService,
    private labelService: LabelService,
    private workItemService: WorkItemService,
    private auth: AuthenticationService,
    private spaces: Spaces,
    private userService: UserService) {
  }

  ngOnInit() {
    console.log('[ToolbarPanelComponent] Running in context: ' + this.context);
    this.loggedIn = this.auth.isLoggedIn();
    this.firstVisit = true;
    // we want to get notified on space changes.
    this.spaceSubscription = this.spaces.current.subscribe(space => {
      if (space) {
        console.log('[ToolbarPanelComponent] New Space selected: ' + space.attributes.name);
        this.editEnabled = true;
      } else {
        console.log('[ToolbarPanelComponent] Space deselected.');
        this.editEnabled = false;
      }
    });
    //on the board view - do not show state filter as the lanes are based on state
    if (this.context === 'boardview') {
      this.allowedFilterKeys= [
        'assignee',
        'creator',
        'area',
        'label',
        'workitemtype'
      ]
    } else {
      this.allowedFilterKeys= [
        'assignee',
        'creator',
        'area',
        'label',
        'workitemtype',
        'state'
      ]
    }
  }

  ngAfterViewInit(): void {
    // listen for logout events.
    this.eventListeners.push(
      this.broadcaster.on<string>('logout')
        .subscribe(message => {
          this.loggedIn = false;
      })
    );
    // listen for changes on the available filters.
    this.eventListeners.push(
      this.filterService.getFilters()
        .subscribe(filters => this.setFilterTypes(filters))
    );

    // TODO : should be replaced by ngrx/store implementation
    this.eventListeners.push(
      this.eventService.labelAdd
        .subscribe(label => {
          const filterMap = this.getFilterMap();
          const index = this.filterConfig.fields.findIndex(i => i.id === 'label');
          if (index > -1) {
            if (this.filterConfig.fields[index].queries.length > 0) {
              this.toolbarConfig.filterConfig.fields[index].queries = [
                ...this.toolbarConfig.filterConfig.fields[index].queries,
                ...filterMap.label.datamap([label]).queries
              ];
            }
          }
        })
    );
  }

  ngOnDestroy() {
    // make sure we unsubscribe from all events.
    if (this.queryParamSubscriber) {
      this.queryParamSubscriber.unsubscribe();
    }
    this.eventListeners.map((e) => e.unsubscribe());
    // clean up.
    this.filterConfig.appliedFilters = [];
    this.filterService.clearFilters(this.allowedFilterKeys);
  }

  onChangeListType(type: string) {
    // the type of the list is changed (Hierarchy/Flat).
    // this will be removed with the new tree list.
    // and if not removed, it should be converted to a
    // global event instead of a BehaviourSubject.
    this.currentListType = type;
    if (type==='Hierarchy') {
      this.eventService.showHierarchyListSubject.next(true);
    } else {
      this.eventService.showHierarchyListSubject.next(false);
    }
  }

  setFilterTypes(filters: FilterModel[]) {
    filters = filters.filter(f => this.allowedFilterKeys.indexOf(
      f.attributes.query.substring(
            f.attributes.query.lastIndexOf("[")+1,
            f.attributes.query.lastIndexOf("]")
      )) > -1);

    /*
     * The current version of the patternfly filter dropdown does not fully support the async
     * update of the filterConfig.fields fields set. It does not refresh the widget on field
     * array change. The current workaround is to add a "dummy" entry "Select Filter.." as
     * the first entry in the fields array. When the user selects a new value from the
     * filter list, the implementation works subsequently.
     */
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
          type: type === 'assignee' || 'label' ? 'typeahead' : 'select',
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
          if (filterMap[key].datamap(data).primaryQueries.length) {
            this.toolbarConfig.filterConfig.fields[index].queries = [
              ...filterMap[key].datamap(data).primaryQueries,
              this.separator,
              ...filterMap[key].datamap(data).queries
            ];
          } else {
            this.toolbarConfig.filterConfig.fields[index].queries = filterMap[key].datamap(data).queries;
          }
          const selectedQueries = this.toolbarConfig.filterConfig.fields[index].queries.filter(
            item => params[key].split(',').indexOf(item.value) > -1
          );
          if (selectedQueries.length) {
            params[key].split(',').forEach(val => {
              this.toolbarConfig.filterConfig.appliedFilters.push({
                field: this.toolbarConfig.filterConfig.fields[index],
                query: selectedQueries.find(v => v.value === val.trim()),
                value: val.trim()
              });
            })
            this.filterService.setFilterValues(key, selectedQueries.map(q => q.id).join());
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
    $event.appliedFilters.forEach((filter) => {
      if (filter.query.id !== 'loader') {
        if (Object.keys(recentAppliedFilters).indexOf(filter.field.id) === -1) {
          // If this filter type was not found in this iteration before
          recentAppliedFilters[filter.field.id] = [];

          recentAppliedFilters[filter.field.id].push(filter);
        } else {
          // If this filter type was found in this iteration before
          if (this.allowedMultipleFilterKeys.indexOf(filter.field.id) > -1) {
            // Multiple value for this filter type is allowed
            recentAppliedFilters[filter.field.id].push(filter);
          } else {
            // Apply the latest value for the vilter
            recentAppliedFilters[filter.field.id][0] = filter;
          }
        }
      }
    });
    this.toolbarConfig.filterConfig.appliedFilters = [];
    Object.keys(recentAppliedFilters).forEach((filterId) => {
      recentAppliedFilters[filterId].forEach(el => {
        this.toolbarConfig.filterConfig.appliedFilters.push(el);
      });
    });

    // Initiate next query params from current query params
    let params = cloneDeep(this.currentQueryParams);
    this.allowedFilterKeys.forEach((key) => delete params[key]);

    // Clean allowed filter keys
    this.filterService.clearFilters(this.allowedFilterKeys);

    // Prepare query params
    let queryObj = {};
    this.toolbarConfig.filterConfig.appliedFilters.forEach((filter) => {
      if (Object.keys(params).indexOf(filter.field.id) > -1) {
        params[filter.field.id] = params[filter.field.id] + ',' + filter.query.value;
        queryObj[filter.field.id] = queryObj[filter.field.id] + ',' + filter.query.id;
      } else {
        params[filter.field.id] = filter.query.value;
        queryObj[filter.field.id] = filter.query.id;
      }
      // Set this filter in filter service
      this.filterService.setFilterValues(filter.field.id, queryObj[filter.field.id]);
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

  createNewWorkItem(event: MouseEvent): void {
    event.stopPropagation();
    this.onCreateNewWorkItemSelected.emit();
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
              [{id: authUser.id, value: authUser.attributes.username + ' (me)', imageUrl: authUser.attributes.imageURL}, {id: null, value: 'Unassigned'}] :
              [{id: null, value: 'Unassigned'}]
          }
        },
        getvalue: (user) => user.attributes.username
      },
      creator: {
        datasource: Observable.combineLatest(this.collaboratorService.getCollaborators(), this.userService.getUser()),
        datamap: ([users, authUser]) => {
          if (Object.keys(authUser).length > 0) {
            users = users.filter(u => u.id !== authUser.id);
          }
          return {
            queries: users.map(user => {return {id: user.id, value: user.attributes.username, imageUrl: user.attributes.imageURL}}),
            primaryQueries: [{id: authUser.id, value: authUser.attributes.username + ' (me)', imageUrl: authUser.attributes.imageURL}]
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
      },
      state: {
        datasource: this.workItemService.getStatusOptions(),
        datamap: (wistates) => {
          return {
            queries: wistates.map(wistate => {return {id: wistate.option, value: wistate.option }}),
            primaryQueries: []
          }
        },
        getvalue: (type) => type.option
      },
      label: {
        datasource: this.labelService.getLabels().map(d => d as any[]),
        datamap: (labels) => {
          return {
            queries: labels.map(label => {
              return {
                id: label.id,
                value: label.attributes.name
              }
            }),
            primaryQueries: []
          }
        },
        getvalue: (label) => label.attributes.name
      }
    }
  }

  selectFilterType(event: FilterEvent) {
    const filterMap = this.getFilterMap();
    if (Object.keys(filterMap).indexOf(event.field.id) > -1) {
      const index = this.filterConfig.fields.findIndex(i => i.id === event.field.id);
      if (this.filterConfig.fields[index].queries.length === 0) {
        this.toolbarConfig.filterConfig.fields[index].queries = [
          this.loader
        ];
        filterMap[event.field.id].datasource.subscribe(resp => {
          if (filterMap[event.field.id].datamap(resp).primaryQueries.length) {
            this.toolbarConfig.filterConfig.fields[index].queries =
              filterMap[event.field.id].datamap(resp).queries.length ? [
                ...filterMap[event.field.id].datamap(resp).primaryQueries,
                this.separator,
                ...filterMap[event.field.id].datamap(resp).queries
              ] : filterMap[event.field.id].datamap(resp).primaryQueries;
          } else {
            this.toolbarConfig.filterConfig.fields[index].queries = filterMap[event.field.id].datamap(resp).queries;
          }
          this.savedFIlterFieldQueries[this.filterConfig.fields[index].id] = {};
          this.savedFIlterFieldQueries[this.filterConfig.fields[index].id]['fixed'] = filterMap[event.field.id].datamap(resp).primaryQueries;
          this.savedFIlterFieldQueries[this.filterConfig.fields[index].id]['filterable'] = filterMap[event.field.id].datamap(resp).queries;
        })
      } else if (this.filterConfig.fields[index].type === 'typeahead'){
        this.filterQueries({
          value: '',
          field: event.field
        });
      }
    }
  }

  /**
   * For type ahead event handle
   * from tool bar component
   * @param event
   */
  filterQueries(event: FilterEvent) {
    const index = this.filterConfig.fields.findIndex(i => i.id === event.field.id);
    let inp = event.value.trim();

    if (inp) {
      this.filterConfig.fields[index].queries = [
        ...this.savedFIlterFieldQueries[event.field.id]['fixed'],
        this.separator,
        ...this.savedFIlterFieldQueries[event.field.id]['filterable'].filter((item) => {
          return item.value.toLowerCase().indexOf(inp.toLowerCase()) > -1;
        })
      ];
    }
    if (inp === '' && typeof(this.savedFIlterFieldQueries[event.field.id]) !== 'undefined') {
      this.filterConfig.fields[index].queries = [
        ...this.savedFIlterFieldQueries[event.field.id]['fixed'],
        this.separator,
        ...this.savedFIlterFieldQueries[event.field.id]['filterable']
      ]
    }
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
