import { AstronautService } from './../shared/astronaut.service';
import { Subscription } from 'rxjs/Subscription';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { cloneDeep } from 'lodash';
import {
  AuthenticationService,
  Broadcaster
} from 'ngx-login-client';
import { SpaceService, Space } from 'ngx-fabric8-wit';

import { WorkItem } from './work-item';
import { WorkItemListEntryComponent } from './work-item-list/work-item-list-entry/work-item-list-entry.component';
import { WorkItemService } from './work-item.service';
import { WorkItemType } from './work-item-type';


@Component({
    host:{
      'class':"app-component flex-container in-column-direction flex-grow-1"
  },
  selector: 'work-item',
  templateUrl: './work-item.component.html',
  styleUrls: ['./work-item.component.scss']
})
export class WorkItemComponent implements OnInit, AfterViewInit {

  @ViewChildren('activeFilters', {read: ElementRef}) activeFiltersRef: QueryList<ElementRef>;
  @ViewChild('activeFiltersDiv') activeFiltersDiv: any;

  loggedIn: Boolean = false;
  editEnabled: Boolean = false;
  filters: any[] = [];
  authUser: any = null;
  workItemToMove: WorkItemListEntryComponent;
  workItemDetail: WorkItem;
  workItemTypes: WorkItemType[];
  showTypesOptions: Boolean = false;
  spaceSubscription: Subscription = null;

  constructor(
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    private broadcaster: Broadcaster,
    private workItemService: WorkItemService,
    private router: Router,
    private astronaut: AstronautService
  ) {
  }

  ngOnInit(): void {
    this.listenToEvents();
    this.loggedIn = this.auth.isLoggedIn();
    this.spaceSubscription = this.broadcaster.on<Space>('spaceChanged').subscribe(space => {
      if (space) {
        console.log('[WorkItemComponent] New Space selected: ' + space.attributes.name);
        this.editEnabled = true;
        this.getWorkItemTypes();
      } else {
        console.log('[WorkItemComponent] Space deselected.');
        this.editEnabled = false;
        this.workItemTypes = [];
      }
    });
  }

  ngAfterViewInit(): void {
    this.authUser = cloneDeep(this.route.snapshot.data['authuser']);
    this.setFilterValues();
  }

  setFilterValues() {
    if (this.loggedIn) {
      this.filters.push({
        id:  1,
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

  deactiveAllFilters() {
    this.filters.forEach((f: any) => {
      f.active = false;
    });
    this.broadcaster.broadcast('item_filter', this.filters);
  }

  activeFilter(filterId: number) {
    if (this.loggedIn) {
      let selectedIndex = this.filters.findIndex((f: any) => {
        return f.id === filterId;
      });
      if (selectedIndex > -1) {
        this.filters[selectedIndex].active = true;
      }
      this.broadcaster.broadcast('item_filter', this.filters);
    }
  }

  deactiveFilter(filterId: number) {
    let selectedIndex = this.filters.findIndex((f: any) => {
      return f.id == filterId;
    });
    if (selectedIndex > -1) {
      this.filters[selectedIndex].active = false;
    }
    this.broadcaster.broadcast('item_filter', this.filters);
  }

  listenToEvents() {
    this.broadcaster.on<string>('logout')
      .subscribe(message => {
        this.loggedIn = false;
        this.deactiveAllFilters();
        this.authUser = null;
        this.setFilterValues();
    });
  }

  moveItem(moveto: string) {
    this.broadcaster.broadcast('move_item', moveto);
  };

  //Detailed add functions
  getWorkItemTypes(){
    this.workItemService.getWorkItemTypes()
      .then((types) => {
        this.workItemTypes = types;
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
}
