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
  textFilterKeys: string[] = [
    'title'
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
          iconStyleClass: 'fa fa-spinner'
      };

  permanentFilters;
  transientFilters;

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
        console.log('[ToolbarPanelComponent] Space deselected. ');
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
        'workitemtype',
        'title'
      ]
    } else {
      this.allowedFilterKeys= [
        'assignee',
        'creator',
        'area',
        'label',
        'workitemtype',
        'state',
        'title'
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
      f.attributes.key) > -1);

    /*
     * The current version of the patternfly filter dropdown does not fully support the async
     * update of the filterConfig.fields fields set. It does not refresh the widget on field
     * array change. The current workaround is to add a "dummy" entry "Select Filter.." as
     * the first entry in the fields array. When the user selects a new value from the
     * filter list, the implementation works subsequently.
     */
    const filterMap = this.getFilterMap();
    this.toolbarConfig.filterConfig.fields = [
      this.toolbarConfig.filterConfig.fields[0],
      ...filters.map(filter => {
        const type = filter.attributes.key;
        return {
          id: type,
          title: filter.attributes.title,
          placeholder: filter.attributes.description,
          type: filterMap[type].type,
          queries: [this.loader]
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
        const index = this.toolbarConfig.filterConfig.fields.findIndex(field => field.id === key);
        if (filterMap[key].type !== 'text') {
          filterMap[key].datasource.take(1).subscribe(data => {
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
            }
          });
        } else {
          // Text search happens here
          this.toolbarConfig.filterConfig.appliedFilters.push({
            field: this.toolbarConfig.filterConfig.fields[index],
            query: params[key],
            value: params[key]
          })
          this.filterService.setFilterValues(key, params[key]);
        }
        // When all the params are resolved
        // Apply the filter
        if (Object.keys(params).length - 1 == i) {
          this.filterService.applyFilter();
        }
      }
    });
  }

  filterChange($event: FilterEvent): void {
    // We don't support multiple filter for same type
    // i.e. no two filter by two different users as assignees
    // Unifying the filters with recent filter value
    let recentAppliedFilters = {};
    $event.appliedFilters.forEach((filter) => {
      if (this.textFilterKeys.findIndex(k => k === filter.field.id) > -1 ||
        filter.query.id !== 'loader') {
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
            // Apply the latest value for the filter
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
    let current_join = null;
    this.fnSplitParams(this.toolbarConfig.filterConfig.appliedFilters);
    let paramComp = this.transientFilters;
    this.filterService.clearFilters();
    this.toolbarConfig.filterConfig.appliedFilters.forEach((filter) => {
      if (Object.keys(paramComp).indexOf(filter.field.id) > -1) {
        this.transientFilters[filter.field.id] = filter.value;
        params[filter.field.id] = params[filter.field.id] + ',' + filter.query.value;
        if (this.allowedMultipleFilterKeys.indexOf(filter.field.id) > -1)
          queryObj[filter.field.id] = queryObj[filter.field.id] + ',' + filter.query.id;
        else
          queryObj[filter.field.id] = filter.value;
      }
      else if (this.textFilterKeys.findIndex(k => k === filter.field.id) > -1) {
        params[filter.field.id] = filter.value;
        queryObj[filter.field.id] = filter.value;
      }
      else {
        params[filter.field.id] = filter.query.value;
        queryObj[filter.field.id] = filter.query.id;
        this.transientFilters[filter.field.id] = filter.value;
        let val = filter.query.value;
        if( filter.field.id === 'assignee' && filter.query.value.indexOf('(me)') >= 0 ) {
          val = filter.query.value.replace('(me)','');
          filter.query.value = val;
          this.transientFilters[filter.field.id] = val;
        }
      }
      this.filterService.setFilterValues(filter.field.id, queryObj[filter.field.id]);
    });
    //permanent filters
    let expression;
    let permQuery = {};
    for (var key in this.permanentFilters) {
      let query = this.filterService.queryBuilder(key, this.filterService.equal_notation, this.permanentFilters[key]);
      permQuery = this.filterService.queryJoiner(permQuery, this.filterService.and_notation, query);
    }
    expression = permQuery;
    let transQuery = {};
    for (var key in this.transientFilters) {
      let query = this.filterService.queryBuilder(key, this.filterService.equal_notation, this.transientFilters[key]);
      transQuery = this.filterService.queryJoiner(transQuery, this.filterService.and_notation, query);
    }
    expression = this.filterService.queryJoiner(permQuery, this.filterService.and_notation, transQuery);
    let query = this.filterService.jsonToQuery(expression);
    this.internalFilterChange = true;
    let navigationExtras: NavigationExtras = {
      queryParams: { q: query },
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
        getvalue: (area) => area.attributes.name,
        type: 'select'
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
        getvalue: (user) => user.attributes.username,
        type: 'typeahead'
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
        getvalue: (user) => user.attributes.username,
        type: 'typeahead'
      },
      workitemtype: {
        datasource: this.workItemService.getWorkItemTypes(),
        datamap: (witypes) => {
          return {
            queries: witypes.map(witype => {return {id: witype.id, value: witype.attributes.name, iconClass: witype.attributes.icon}}),
            primaryQueries: []
          }
        },
        getvalue: (type) => type.attributes.name,
        type: 'select'
      },
      state: {
        datasource: this.workItemService.getStatusOptions(),
        datamap: (wistates) => {
          return {
            queries: wistates.map(wistate => {return {id: wistate.option, value: wistate.option }}),
            primaryQueries: []
          }
        },
        getvalue: (type) => type.option,
        type: 'select'
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
        getvalue: (label) => label.attributes.name,
        type: 'typeahead'
      },
      title: {
        type: 'text'
      }
    }
  }

  selectFilterType(event: FilterEvent) {
    const filterMap = this.getFilterMap();
    if (Object.keys(filterMap).indexOf(event.field.id) > -1) {
      const index = this.filterConfig.fields.findIndex(i => i.id === event.field.id);
      if (filterMap[event.field.id].type !== 'text') {
        filterMap[event.field.id].datasource.subscribe(resp => {
          if (filterMap[event.field.id].datamap(resp).primaryQueries.length) {
            this.toolbarConfig.filterConfig.fields[index].queries =
            filterMap[event.field.id].datamap(resp).queries[0].id !== 'loader' ? [
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

  fnSplitParams(ref_arr) {
    //split params in to two types
    //permanent and transient
    if(this.route.snapshot.queryParams['q']) {
      this.permanentFilters = {};
      this.transientFilters = {};
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
        if(arr[1] !== undefined) {
          if (ref_arr.indexOf(arr[0]) >= 0)
            this.transientFilters[arr[0]] = arr[1];
          else if (arr[0] === '$WITGROUP' || arr[0] === 'space' || arr[0] === 'iteration')
            this.permanentFilters[arr[0]] = arr[1];
        }
      }
    }
  }

  listenToQueryParams() {
    if (this.queryParamSubscriber === null)  {
      this.queryParamSubscriber =
        this.route.queryParams.subscribe((params) => {
          this.fnSplitParams(this.allowedFilterKeys);
          this.currentQueryParams = this.transientFilters;
          // If any of the allowed key present in the URL
          if (this.currentQueryParams && Object.keys(this.currentQueryParams).some(i => this.allowedFilterKeys.indexOf(i) > -1)) {
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
              //this.toolbarConfig.filterConfig.appliedFilters = [];
              this.toolbarConfig.filterConfig.appliedFilters
                .filter((thing, index, self) => self.findIndex((t) => {return t.field.id === thing.field.id }) === index)
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

  // show tree feature
  checkboxToggle(event) {
     this.workItemService.emitShowTree(event.target.checked);
  }
}
