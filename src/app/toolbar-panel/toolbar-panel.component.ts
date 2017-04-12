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

  @Output() showDetailEvent: EventEmitter<any | null> = new EventEmitter();

  filters: any[] = [];
  loggedIn: boolean = false;
  editEnabled: boolean = false;
  currentBoardType: WorkItemType;
  workItemToMove: WorkItemListEntryComponent;
  workItemDetail: WorkItem;
  showTypesOptions: boolean = false;
  spaceSubscription: Subscription = null;
  eventListeners: any[] = [];
  existingQueryParams: Object = {};
  filterConfig: FilterConfig = {
      fields: [{
        id: '',
        title:  '',
        placeholder: '',
        type: ''
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
    if (this.wiTypes.length) {
      this.currentBoardType = this.wiTypes[0];
    } else {
      this.currentBoardType = null;
    }
  }

  ngOnDestroy() {
    this.queryParamSubscriber.unsubscribe();
    this.eventListeners.map((e) => e.unsubscribe());
  }

  setFilterTypes(filters: FilterModel[]) {
    this.toolbarConfig.filterConfig.fields = filters.map(filter => {
      return {
        id: filter.attributes.query.substring(
          filter.attributes.query.lastIndexOf("[")+1,
          filter.attributes.query.lastIndexOf("]")
        ),
        title: filter.attributes.title,
        placeholder: filter.attributes.description,
        type: 'select',
        queries: []
      };
    });
    this.listenToQueryParams();
  }

  setAppliedFilterFromUrl() {
    const filterMap = this.getFilterMap();
    Object.keys(this.existingQueryParams).forEach((key, index) => {
      if (this.allowedFilterKeys.indexOf(key) > -1) {
        filterMap[key].datasource.take(1).subscribe(data => {
          const index = this.toolbarConfig.filterConfig.fields.findIndex(field => field.id === key);
          this.toolbarConfig.filterConfig.fields[index].queries = filterMap[key].datamap(data);
          const selectedQuery = this.toolbarConfig.filterConfig.fields[index].queries.find(
            item => item.value === this.existingQueryParams[key]
          );
          if (selectedQuery) {
            this.toolbarConfig.filterConfig.appliedFilters.push({
              field: this.toolbarConfig.filterConfig.fields[index],
              query: selectedQuery,
              value: this.existingQueryParams[key]
            });
            this.filterService.setFilterValues(key, selectedQuery.id);
            if (Object.keys(this.existingQueryParams).length - 1 == index) {
              this.filterService.applyFilter();
            }
          }
        });
      }
    });
  }

  // filterChange($event: FilterEvent): void {
  //   let activeFilters = 0;
  //   this.filters.forEach((f: any) => {
  //     f.active = false;
  //   });
  //   $event.appliedFilters.forEach((filter) => {
  //     let selectedIndex = this.filters.findIndex((f: any) => {
  //       return f.id === filter.field.id;
  //     });
  //     if (selectedIndex > -1) {
  //       this.filters[selectedIndex].active = true;
  //       this.filters[selectedIndex].value = filter.query.id;
  //     }
  //   });
  //   // if we're in board view, add or update the
  //   // work item type filter
  //   if (this.context === 'boardview') {
  //     this.updateOrAddTypeFilter();
  //   }
  //   this.broadcaster.broadcast('item_filter', this.filters);
  // }

  filterChange($event: FilterEvent): void {
    // Initiate next query params from current query params
    let params = cloneDeep(this.existingQueryParams);
    this.allowedFilterKeys.forEach((key) => delete params[key]);

    // Clean allowed filter keys
    this.filterService.clearFilters(this.allowedFilterKeys);

    // Prepare query params
    $event.appliedFilters.forEach((filter) => {
      params[filter.field.id] = filter.field.queries[0].value;
      // Set this filter in filter service
      this.filterService.setFilterValues(filter.field.id, filter.field.queries[0].id);
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

  updateOrAddTypeFilter() {
    let selectedIndex = -1;
    selectedIndex = this.filters.findIndex((f: any) => {
      return f.paramKey === 'filter[workitemtype]';
    });
    if (selectedIndex > -1) {
      this.filters[selectedIndex].value = this.currentBoardType.id;
    } else {
      this.filters.push({
        id:  '99',
        name: 'Type',
        paramKey: 'filter[workitemtype]',
        active: true,
        value: this.currentBoardType.id
      });
    };
  }

  onChangeBoardType(type: WorkItemType) {
    this.currentBoardType = type;
    this.updateOrAddTypeFilter();
    this.broadcaster.broadcast('item_filter', this.filters);
    this.broadcaster.broadcast('board_type_context', type);
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
        datamap: (areas) => areas.map(area => {return {id: area.id, value: area.attributes.name}}),
        getvalue: (area) => area.attributes.name
      },
      assignee: {
        datasource: this.collaboratorService.getCollaborators(),
        datamap: (users) => users.map(user => {return {id: user.id, value: user.attributes.username, imageUrl: user.attributes.imageURL}}),
        getvalue: (user) => user.attributes.username
      },
      workitemtype: {
        datasource: this.workItemService.getWorkItemTypes(),
        datamap: (witypes) => witypes.map(witype => {return {id: witype.id, value: witype.attributes.name, iconClass: witype.attributes.icon}}),
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
          this.filterConfig.fields[index].queries = filterMap[data.id].datamap(resp);
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
          this.existingQueryParams = params;
          // on no params
          if (!Object.keys(params).length ||
            (Object.keys(this.existingQueryParams).length === 1
              && Object.keys(this.existingQueryParams).indexOf('iteration') > -1)) {
            // Cleaning up applied filters
            this.toolbarConfig.filterConfig.appliedFilters = [];
          } else {
            if (Object.keys(this.existingQueryParams).length
              && Object.keys(this.existingQueryParams).some(i => this.allowedFilterKeys.indexOf(i) > -1)) {
              if (this.internalFilterChange) {
                this.filterService.applyFilter();
                this.internalFilterChange = false;
              } else {
                this.toolbarConfig.filterConfig.appliedFilters = [];
                this.filterService.clearFilters(this.allowedFilterKeys);
                this.setAppliedFilterFromUrl();
              }
            }
          }
        })
    }
  }
}
