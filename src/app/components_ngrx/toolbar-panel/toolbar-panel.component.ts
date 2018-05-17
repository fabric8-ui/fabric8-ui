import { Broadcaster } from 'ngx-base';
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
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { AsyncPipe } from '@angular/common'
import {
  Router,
  ActivatedRoute,
  NavigationExtras
} from '@angular/router';
import { cloneDeep } from 'lodash';
import { FilterConfig, FilterEvent } from 'patternfly-ng/filter';
import { ToolbarConfig } from 'patternfly-ng/toolbar';

import { Spaces } from 'ngx-fabric8-wit';
import {
  AuthenticationService,
  UserService,
  User
} from 'ngx-login-client';
import { Space } from 'ngx-fabric8-wit';

import { AreaUI } from '../../models/area.model';
import { FilterModel } from '../../models/filter.model';
import { FilterService } from '../../services/filter.service';
import { LabelUI } from './../../models/label.model';
import { WorkItemTypeUI } from '../../models/work-item-type';
import { WorkItem } from '../../models/work-item';
import { UserUI } from './../../models/user';
import { IterationUI } from './../../models/iteration.model';
import { GroupTypeUI } from './../../models/group-types.model';

// ngrx stuff
import { Store } from '@ngrx/store';
import { AppState } from './../../states/app.state';
import * as CustomQueryActions from './../../actions/custom-query.actions';
import * as FilterActions from './../../actions/filter.actions';
import * as SpaceActions from './../../actions/space.actions';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'toolbar-panel',
  templateUrl: './toolbar-panel.component.html',
  styleUrls: ['./toolbar-panel.component.less']
})
export class ToolbarPanelComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() context: string;
  @Input() loggedInUser: User | Object = {};
  @Input() dropdownPlacement: any = 'right'; // value is right or left
  @Output() onCreateNewWorkItemSelected: EventEmitter<any | null> = new EventEmitter();

  loggedIn: boolean = false;
  showTypesOptions: boolean = false;

  filters: any[] = [];
  workItemDetail: WorkItem;
  spaceSubscription: Subscription = null;
  eventListeners: any[] = [];
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

  showSaveFilterButton: boolean = true;
  isFilterSaveOpen: boolean = false;

  // the type of the list is changed (Hierarchy/Flat).
  currentListType: string = 'Hierarchy';

  private queryParamSubscriber = null;
  private savedFIlterFieldQueries = {};

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
  private areaData: Observable<AreaUI[]>;
  private allUsersData: Observable<UserUI[]>;
  private workItemTypeData: Observable<WorkItemTypeUI[]>;
  private stateData: Observable<string[]>;
  private labelData: Observable<LabelUI[]>;
  private spaceData: Observable<Space>;
  private filterData: Observable<FilterModel[]>;
  private groupTypeData: Observable<GroupTypeUI[]>;
  private iterationData: Observable<IterationUI[]>;

  private activeFilters = [];
  private activeFilterFromSidePanel: string = '';
  private currentQuery: string = '';
  private totalCount: Observable<number>;

  private isShowTreeOn: boolean = false;
  private isShowCompletedOn: boolean = false;
  private isStateFilterSelected: boolean = false;

  private routeSource = this.route.queryParams
    .filter(p => p.hasOwnProperty('q'));
  private queryExp;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private broadcaster: Broadcaster,
    private filterService: FilterService,
    private auth: AuthenticationService,
    private userService: UserService,
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log('[ToolbarPanelComponent] Running in context: ' + this.context);
    this.loggedIn = this.auth.isLoggedIn();
    this.initiateDataSources();
    // we want to get notified on space changes.
    this.spaceSubscription = this.spaceData
      .subscribe((space: Space) => {
        console.log('[ToolbarPanelComponent] New Space selected: ' + space.attributes.name);
        this.store.dispatch(new FilterActions.Get());
      });
    //on the board view - do not show state filter as the lanes are based on state
    this.allowedFilterKeys= [
      'assignee', 'creator', 'area', 'label',
      'workitemtype', 'title'
    ]
    if (this.context !== 'boardview') {
      this.allowedFilterKeys.push('state');
    }
    this.routeSource.subscribe(queryParam => this.queryExp = queryParam.q);

    const customQueriesData = this.store
      .select('listPage')
      .select('customQueries')
      .filter(customQueries => !!customQueries.length);
      this.totalCount = this.store
      .select('listPage')
      .select('workItems')
      .map(items => {
        if(this.isShowTreeOn) {
          return items.filter(item => item.bold === true).length;
        } else {
          return items.length;
        }
      })

    this.eventListeners.push(
      customQueriesData.subscribe(queries => {
        const selected = queries.find(q => q.selected);
        if (selected) {
          // if any selected saved filter found
          // then save filter button will not be shown
          // to avoid duplication
          this.showSaveFilterButton = false;
        } else {
          this.showSaveFilterButton = true;
        }
      })
    );
  }

  ngAfterViewInit(): void {
    // listen for logout events.
    this.eventListeners.push(
      this.broadcaster.on<string>('logout')
        .subscribe(message => {
          this.loggedIn = false;
      })
    );

    this.eventListeners.push(
      this.filterData
        .subscribe((filters) => this.setFilterTypes(filters))
    );

    this.eventListeners.push(
      Observable.combineLatest(
        this.areaData,
        this.allUsersData,
        this.workItemTypeData,
        this.stateData,
        this.labelData
      ).subscribe(() => {
        // Once all the attributes are resolved
        // Listen for the URLs to set applied filters
        this.checkURL();
        this.checkFilterFromSidePanle()
      })
    )

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

  setFilterTypes(filters: FilterModel[]) {
    filters = filters.filter(f => this.allowedFilterKeys.indexOf(
      f.attributes.key) > -1);

    /*
     * The current version of the patternfly filter dropdown does not fully support the async
     * update of the filterConfig.fields fields set. It does not refresh the widget on field
     * array change. The current workaround is to add a 'dummy' entry 'Select Filter..' as
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
  }

  filterChange($event: FilterEvent): void {
    this.toolbarConfig.filterConfig.appliedFilters = [];
    const oldQueryJson = this.filterService.queryToJson(
      this.currentQuery
    );
    const field = $event.field.id;
    const value = $event.hasOwnProperty('query') ?
      $event.query.id : $event.value;
    const newQuery = this.filterService.queryBuilder(
      field,
      this.filterService.equal_notation,
      value
    );
    const finalQuery = this.filterService.queryJoiner(
      oldQueryJson,
      this.filterService.and_notation,
      newQuery
    );
    const queryString = this.filterService.jsonToQuery(finalQuery);
    let queryParams = cloneDeep(this.route.snapshot.queryParams);
    queryParams['q'] = queryString;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }

  selectFilterType(event: FilterEvent) {
    this.isStateFilterSelected = false;
    if (event.field.id === 'state') {
      this.isStateFilterSelected = true;
    }
    const filterMap = this.getFilterMap();
    if (Object.keys(filterMap).indexOf(event.field.id) > -1) {
      const index = this.filterConfig.fields.findIndex(i => i.id === event.field.id);
      if (filterMap[event.field.id].type !== 'text') {
        this.eventListeners.push(
          filterMap[event.field.id].datasource.subscribe(resp => {
            if (filterMap[event.field.id].datamap(resp).primaryQueries.length) {
              this.toolbarConfig.filterConfig.fields[index].queries = [
                ...filterMap[event.field.id].datamap(resp).primaryQueries,
                this.separator,
                ...filterMap[event.field.id].datamap(resp).queries
              ];
            } else {
              this.toolbarConfig.filterConfig.fields[index].queries = filterMap[event.field.id].datamap(resp).queries;
            }
            this.savedFIlterFieldQueries[this.filterConfig.fields[index].id] = {};
            this.savedFIlterFieldQueries[this.filterConfig.fields[index].id]['fixed'] = filterMap[event.field.id].datamap(resp).primaryQueries;
            this.savedFIlterFieldQueries[this.filterConfig.fields[index].id]['filterable'] = filterMap[event.field.id].datamap(resp).queries;
          })
        );
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


  initiateDataSources() {
    this.areaData = this.store
      .select('listPage').select('areas')
      .filter(a =>!!a.length);
    this.allUsersData = this.store
      .select('listPage').select('collaborators')
      .filter(a =>!!a.length);
    this.workItemTypeData = this.store
      .select('listPage').select('workItemTypes')
      .filter(a =>!!a.length);
    this.stateData = this.store
      .select('listPage').select('workItemStates')
      .filter(a =>!!a.length);
    this.labelData = this.store
      .select('listPage').select('labels').filter(l => l !== null);
    this.spaceData = this.store
      .select('listPage').select('space')
      .filter(space => space !== null);
    this.filterData = this.store
      .select('toolbar').select('filters')
      .filter(filters => !!filters.length);
    this.iterationData = this.store
      .select('listPage').select('iterations')
      .filter(i => !!i.length)
    this.groupTypeData = this.store
      .select('listPage').select('groupTypes')
      .filter(i => !!i.length)
  }

  getFilterMap() {
    return {
      area: {
        datasource: this.areaData,
        datamap: (areas: AreaUI[]) => {
          return {
            queries: areas.map(area => {return {id: area.id, value: area.name}}),
            primaryQueries: []
          }
        },
        getvalue: (area: AreaUI) => area.name,
        type: 'select'
      },
      assignee: {
        datasource: Observable.combineLatest(this.allUsersData, this.userService.getUser()),
        datamap: ([users, authUser]) => {
          if (Object.keys(authUser).length > 0) {
            users = users.filter(u => u.id !== authUser.id);
          }
          return {
            queries: users.map((user: UserUI) => {return {id: user.id, value: user.username, imageUrl: user.avatar}}),
            primaryQueries: Object.keys(authUser).length ?
              [{id: authUser.id, value: authUser.attributes.username + ' (me)', imageUrl: authUser.attributes.imageURL}, {id: null, value: 'Unassigned'}] :
              [{id: null, value: 'Unassigned'}]
          }
        },
        getvalue: (user) => user.attributes.username,
        type: 'typeahead'
      },
      creator: {
        datasource: Observable.combineLatest(this.allUsersData, this.userService.getUser()),
        datamap: ([users, authUser]) => {
          if (Object.keys(authUser).length > 0) {
            users = users.filter(u => u.id !== authUser.id);
          }
          return {
            queries: users.map((user: UserUI) => {return {id: user.id, value: user.username, imageUrl: user.avatar}}),
            primaryQueries: Object.keys(authUser).length ?
            [{id: authUser.id, value: authUser.attributes.username + ' (me)', imageUrl: authUser.attributes.imageURL}] :
            []
          }
        },
        getvalue: (user) => user.attributes.username,
        type: 'typeahead'
      },
      workitemtype: {
        datasource: this.workItemTypeData,
        datamap: (witypes: WorkItemTypeUI[]) => {
          return {
            queries: witypes.sort((a, b) => (a.name > b.name ? 1 : 0)).map(witype => ({ id: witype.id, value: witype.name, iconStyleClass: witype.icon })),
            primaryQueries: []
          }
        },
        getvalue: (type: WorkItemTypeUI) => type.name,
        type: 'select'
      },
      state: {
        datasource: this.stateData,
        datamap: (wistates: string[]) => {
          return {
            queries: wistates.map(wistate => {return {id: wistate, value: wistate }}),
            primaryQueries: []
          }
        },
        getvalue: (type) => type,
        type: 'select'
      },
      label: {
        datasource: this.labelData,
        datamap: (labels: LabelUI[]) => {
          return {
            queries: labels.map(label => {
              return {
                id: label.id,
                value: label.name
              }
            }),
            primaryQueries: []
          }
        },
        getvalue: (label: LabelUI) => label.name,
        type: 'typeahead'
      },
      title: {
        type: 'text'
      }
    }
  }

  checkURL() {
    this.eventListeners.push(
      this.route.queryParams.subscribe(query => {
        if (query.hasOwnProperty('q')){
          this.currentQuery = query.q;
          const fields = this.filterService.queryToFlat(
            this.currentQuery
          );
          this.handleShowTreeCheckBox();
          this.formatFilterFIelds(fields);
        } else {
          this.activeFilters = [];
          this.currentQuery = '';
        }
      })
    );
  }

  checkFilterFromSidePanle() {
    this.eventListeners.push(
      Observable.combineLatest(
        this.groupTypeData,
        this.iterationData
      )
      .map(([gt, it]) => {
        const selectedIt: IterationUI = it.find(i => i.selected);
        const selectedGt: GroupTypeUI = gt.find(i => i.selected);
        return [selectedIt, selectedGt];
      })
      .filter(([gt, it]) => {
        return !!gt || !!it;
      })
      .map(([gt, it]) => {
        if (!!gt) {
          return gt.name;
        }
        if (!!it) {
          return it.name;
        }
      })
      .subscribe(selected => {
        this.activeFilterFromSidePanel = selected;
        this.cdr.markForCheck();
      })
    );
  }

  formatFilterFIelds(fields) {
    Observable.combineLatest(
      this.areaData,
      this.allUsersData,
      this.workItemTypeData,
      this.stateData,
      this.labelData
    ).subscribe(([areas, users, wiTypes, states, labels]) => {
      const filterMap = this.getFilterMap();
      fields = fields.filter(f => {
        return this.allowedFilterKeys.indexOf(f.field) > -1
      });
      this.activeFilters = [...fields.map(f => {
        switch(f.field) {
          case 'creator':
          case 'assignee':
            const user = users.find(u => u.id === f.value);
            f['displayValue'] = f.value == 'null' ? 'Unassigned' :
              (user ? user.username : f.value);
            break;
          case 'area':
            const area = areas.find(a => a.id === f.value);
            f['displayValue'] = area ? area.name : f.value;
            break;
          case 'workitemtype':
            const witype = wiTypes.find(w => w.id === f.value);
            f['displayValue'] = witype ? witype.name : f.value;
            break;
          case 'state':
            const state = states.find(s => s === f.value);
            f['displayValue'] = state ? state : f.value;
            break;
          case 'label':
            const label = labels.find(l => l.id === f.value);
            f['displayValue'] = label ? label.name : f.value;
            break;
          case 'title':
            f['displayValue'] = f.value;
            break;
          default:
            f['displayValue'] = '';
            break;
        }
        return f;
      })];
    });
  }

  removeFilter(field = null) {
    const fields = this.filterService.queryToFlat(
      this.currentQuery
    );
    fields.splice(field.index, 1);
    const queryString = this.filterService.jsonToQuery(
      this.filterService.flatToQuery(fields)
    );
    let queryParams = cloneDeep(this.route.snapshot.queryParams);
    queryParams['q'] = queryString;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }

  removeAllFilters() {
    const fields = this.filterService.queryToFlat(
      this.currentQuery
    ).filter(f => {
      return this.activeFilters.findIndex(
        af => af.field === f.field && af.value === f.value
      ) === -1;
    });
    const queryString = this.filterService.jsonToQuery(
      this.filterService.flatToQuery(fields)
    );
    let queryParams = cloneDeep(this.route.snapshot.queryParams);
    queryParams['q'] = queryString;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }

  saveFilters(filterName: string) {
    if (filterName !== '') {
      //let exp = JSON.stringify(this.filterService.queryToJson(this.queryExp));
      let exp = this.queryExp;
      let e1 = this.filterService.queryToJson(exp);
      let str = '' + JSON.stringify(e1);
      let customQuery = {
        'attributes': {
          'fields': str,
          'title': filterName
        },
        'type': 'queries'
      };
      this.store.dispatch(new CustomQueryActions.Add(customQuery));
      this.closeFilterSave();
    }
  }

  showTreeToggle(e) {
    let queryParams = cloneDeep(this.route.snapshot.queryParams);
    if (e.target.checked) {
      queryParams['showTree'] = true;
    } else {
      if (queryParams.hasOwnProperty('showTree')) {
        delete queryParams['showTree'];
      }
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }

  showCompletedToggle(e) {
    let queryParams = cloneDeep(this.route.snapshot.queryParams);
    if (e.target.checked) {
      queryParams['showCompleted'] = true;
    } else {
      if (queryParams.hasOwnProperty('showCompleted')) {
        delete queryParams['showCompleted'];
      }
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }

  handleShowTreeCheckBox() {
    let currentParams = cloneDeep(this.route.snapshot.queryParams);
    if (currentParams.hasOwnProperty('showTree')) {
      if (currentParams['showTree'] === 'true') {
        this.isShowTreeOn = true;
      } else if (currentParams['showTree'] === 'false') {
        this.isShowTreeOn = false;
      }
    } else {
      this.isShowTreeOn = false;
    }
    if (currentParams.hasOwnProperty('showCompleted')) {
      if (currentParams['showCompleted'] === 'true') {
        this.isShowCompletedOn = true;
      } else if (currentParams['showCompleted'] === 'false') {
        this.isShowCompletedOn = false;
      }
    } else {
      this.isShowCompletedOn = false;
    }
  }

  closeFilterSave() {
    this.isFilterSaveOpen = false;
  }

  saveFilterDropdownChange(value: boolean) {
    this.isFilterSaveOpen = value;
  }
}
