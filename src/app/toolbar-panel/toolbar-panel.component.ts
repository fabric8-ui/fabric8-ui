import { Component, Input, OnInit, AfterViewInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { cloneDeep } from 'lodash';
import { Broadcaster, AuthenticationService } from 'ngx-login-client';
import { Subscription } from 'rxjs/Subscription';
import { Space, Spaces } from 'ngx-fabric8-wit';

import { AreaModel } from '../models/area.model';
import { AreaService } from '../area/area.service';
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
export class ToolbarPanelComponent implements OnInit, AfterViewInit {
  @ViewChild('actions') actionsTemplate: TemplateRef<any>;
  @ViewChild('add') addTemplate: TemplateRef<any>;

  @Input() context: string;

  areas: any[] = [];
  filters: any[] = [];
  loggedIn: boolean = false;
  editEnabled: boolean = false;
  authUser: any = null;
  workItemTypes: WorkItemType[] = [];
  currentBoardType: WorkItemType;
  workItemToMove: WorkItemListEntryComponent;
  workItemDetail: WorkItem;
  showTypesOptions: boolean = false;
  spaceSubscription: Subscription = null;

  filterConfig: FilterConfig;
  toolbarConfig: ToolbarConfig;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private broadcaster: Broadcaster,
    private areaService: AreaService,
    private filterService: FilterService,
    private workItemService: WorkItemService,
    private auth: AuthenticationService,
    private spaces: Spaces) {
  }

  ngOnInit() {
    console.log('[FilterPanelComponent] Running in context: ' + this.context);
    this.loggedIn = this.auth.isLoggedIn();
    this.listenToEvents();
    // we need to get the wi types for the types dropdown on the board item
    // even when there is no active space change (initial population).
    if (this.context === 'boardview')
      this.getWorkItemTypes();
    this.spaceSubscription = this.spaces.current.subscribe(space => {
      if (space) {
        console.log('[FilterPanelComponent] New Space selected: ' + space.attributes.name);
        this.editEnabled = true;
        this.getWorkItemTypes();
      } else {
        console.log('[FilterPanelComponent] Space deselected.');
        this.editEnabled = false;
        this.workItemTypes = [];
      }
    });

    // this.filterService.getFilters().then(response => {
    //   console.log(response);
    // });

    this.areaService.getAreas().then(areas => {
      /**
       * Remapping the fetched areas to the 'queries' model
       * of ngx-toolbar filters' dropdown.
       */
      for(let area of areas) {
        this.areas.push({
          id: area.id.toString(),
          value: area.attributes.name
        });
      }
    });

    this.filterConfig = {
      fields: [{
        id: 'user',
        title: 'User',
        placeholder: 'Filter by Assignee...',
        type: 'select',
        queries: [{
          id:  '1',
          value: 'Assigned to Me'
        }]
      }, {
        id: 'area',
        title: 'Area',
        placeholder: 'Filter by Areas...',
        type: 'select',
        queries: this.areas
      }] as FilterField[],
      appliedFilters: [],
      resultsCount: -1, // Hide
      selectedCount: 0,
      totalCount: 0,
      tooltipPlacement: 'right'
    } as FilterConfig;

    this.toolbarConfig = {
      actionConfig: {},
      filterConfig: this.filterConfig
    } as ToolbarConfig;
  }

  ngAfterViewInit(): void {
    this.authUser = cloneDeep(this.route.snapshot.data['authuser']);
    this.setFilterValues();
  }

  filterChange($event: FilterEvent): void {
    let activeFilters = 0;
    this.filters.forEach((f: any) => {
      f.active = false;
    });
    $event.appliedFilters.forEach((filter) => {
      let selectedIndex = this.filters.findIndex((f: any) => {
        return f.id === filter.query.id;
      });
      if (selectedIndex > -1) {
        this.filters[selectedIndex].active = true;
      }
    });
    // if we're in board view, add or update the
    // work item type filter
    if (this.context === 'boardview') {
      this.updateOrAddTypeFilter();
    }
    this.broadcaster.broadcast('item_filter', this.filters);
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

  setFilterValues() {
    if (this.loggedIn) {
      this.filters.push({
        id:  '1',
        name: 'Assigned to Me',
        paramKey: 'filter[assignee]',
        active: false,
        value: this.authUser.id
      });
    } else {
      let index = this.filters.findIndex(item => item.id === 1);
      this.filters.splice(index, 1);
    }
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

  //Detailed add functions
  getWorkItemTypes(){
    this.workItemService.getWorkItemTypes()
      .then((types) => {
        this.workItemTypes = types;
        // if the current board type is empty, this is the first time
        // we retrieve the types, then the default type to display is the
        // first type returned.
        if (!this.currentBoardType)
          this.currentBoardType = this.workItemTypes[0];
      });
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

  listenToEvents() {
    this.broadcaster.on<string>('logout')
      .subscribe(message => {
        this.loggedIn = false;
        this.authUser = null;
        this.setFilterValues();
    });
  }
}
