import { Subscription } from 'rxjs/Subscription';
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
  ViewEncapsulation
} from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';

import { Space, Spaces } from 'ngx-fabric8-wit';
import { AuthenticationService, Broadcaster } from 'ngx-login-client';
import { ArrayCount } from 'ngx-widgets';
import { DragulaService } from 'ng2-dragula';

import { WorkItem } from '../../models/work-item';
import { WorkItemType } from '../../models/work-item-type';
import { WorkItemService } from '../work-item.service';

@Component({
  host: {
     'class': 'app-component flex-container in-column-direction flex-grow-1'
  },
  selector: 'alm-board',
  templateUrl: './work-item-board.component.html',
  styleUrls: ['./work-item-board.component.scss']
})

export class WorkItemBoardComponent implements OnInit {

  @ViewChildren('activeFilters', {read: ElementRef}) activeFiltersRef: QueryList<ElementRef>;
  @ViewChild('activeFiltersDiv') activeFiltersDiv: any;

  workItems: WorkItem[] = [];
  workItem: WorkItem;
  filters: any[] = [];
  lanes: Array<any> = [];
  pageSize: number = 20;
  loggedIn: Boolean = false;
  spaceSubscription: Subscription;
  contentItemHeight: number = 85;
  boardContextSubscription: Subscription;

  constructor(
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private router: Router,
    private workItemService: WorkItemService,
    private dragulaService: DragulaService,
    private spaces: Spaces) {
      this.dragulaService.drag.subscribe((value) => {
        this.onDrag(value.slice(1));
      });

      this.dragulaService.drop.subscribe((value) => {
        this.onDrop(value.slice(1));
      });

      this.dragulaService.over.subscribe((value) => {
        this.onOver(value.slice(1));
      });

      this.dragulaService.out.subscribe((value) => {
        this.onOut(value.slice(1));
      });
    }

  ngOnInit() {
    this.listenToEvents();
    this.loggedIn = this.auth.isLoggedIn();
    this.getDefaultWorkItemTypeStates();
    this.spaceSubscription = this.spaces.current.subscribe(space => {
      if (space) {
        console.log('[WorkItemBoardComponent] New Space selected: ' + space.attributes.name);
        this.getDefaultWorkItemTypeStates();
      } else {
        console.log('[WorkItemBoardComponent] Space deselected');
        this.lanes = [];
        this.workItemService.resetWorkItemList();
      }
    });
    this.boardContextSubscription = this.broadcaster.on<WorkItemType>('board_type_context').subscribe(workItemType => {
      if (workItemType) {
        console.log('[WorkItemBoardComponent] New type context selected: ' + workItemType.attributes.name);
        this.workItemService.resetWorkItemList();
      }
    });
  }

  getWorkItems(pageSize, lane) {
    this.workItemService.getWorkItems(pageSize, [{
      active: true,
      paramKey: 'filter[workitemstate]',
      value: lane.option
    }, ...this.filters], true)
      .then(workItems => {
        lane.workItems = workItems;
        lane.nextLink = this.workItemService.getNextLink();
     });
  }

  getDefaultWorkItemTypeStates(workItemTypeId?: string) {
    this.lanes = [];
    if (!workItemTypeId) {
      // we don't have a type is, fetch the first type and the states of it.
      this.workItemService.getWorkItemTypes().then((types: WorkItemType[]) => {
        // the returned list may be empty because the space is not yet selected.
        if (types.length > 0) {
          let lanes = types[0].attributes.fields['system.state'].type.values;
          lanes.forEach((value, index) => {
            this.lanes.push({
              option: value,
              workItems: [] as WorkItem[],
              nextLink: null
            });
          });
          this.filters = [ {
            active: true,
            paramKey: 'filter[workitemtype]',
            value: types[0].id
          } ];
        }
      });
    } else {
      // we have a type id, we just fetch the states from it.
      this.workItemService.getWorkItemTypesById(workItemTypeId).then(workItemType => {
        let lanes = workItemType.attributes.fields['system.state'].type.values;
        lanes.forEach((value, index) => {
          this.lanes.push({
            option: value,
            workItems: [] as WorkItem[],
            nextLink: null
          });
        });
      });
    }
  }

  initWiItems($event, lane) {
    this.getWorkItems($event.pageSize, lane);
  }

  fetchMoreWiItems(lane) {
    console.log('More for ' + lane.option);
    if (lane.nextLink) {
      this.workItemService.setNextLink(lane.nextLink);
      this.workItemService.getMoreWorkItems()
        .then((items) => {
          lane.workItems = [...lane.workItems, ...items];
          lane.nextLink = this.workItemService.getNextLink();
        });
    } else {
      console.log('No More for ' + lane.option);
    }
  }

  gotoDetail(workItem: WorkItem) {
    let link = [ this.router.url.split('detail')[0] + '/detail/' + workItem.id ];
    this.router.navigate(link);
  }

  onDrag(args: any) {
    let [el, source] = args;
  }

  getWI(workItem: WorkItem) {
    console.log(workItem);
    this.workItem = workItem;
  }

  onDrop(args) {
    let [el, target, source, sibling] = args;
    target.parentElement.parentElement.classList.remove('active-lane');
    let state = target.parentElement.parentElement.getAttribute('data-state');
    //this.workItem = this.workItems[el.getAttribute('data-item')];
    //console.log(el.getAttribute('data-item'));
    this.changeState(state);
  }

  onOver(args) {
    let [el, container, source] = args;
    let containerClassList = container.parentElement.parentElement.classList;
    let laneSection = document.getElementsByClassName('board-lane-column');
    for(let i=0; i<laneSection.length; i++) {
      laneSection[i].classList.remove('active-lane');
    }
    containerClassList.add('active-lane');
  }

  onOut(args) {
    let [el, container, source] = args;
    source.parentElement.parentElement.classList.remove('active-lane');
  }

  activeOnList(timeOut: number = 0) {
    setTimeout(() => {
      this.broadcaster.broadcast('activeWorkItem', this.workItem.id);
    }, timeOut);
  }

  changeState(option: any): void {
    this.workItem.attributes['system.state'] = option;
    this.save();
  }

  save(): void {
    if (this.workItem.id){
      this.workItemService
        .update(this.workItem)
        .then((workItem) => {
          this.workItem.attributes['version'] = workItem.attributes['version'];
          this.activeOnList();
      });
    }
  }

  listenToEvents() {
    // filters like assign to me should stack with the current filters
    this.broadcaster.on<string>('item_filter')
        .subscribe((filters: any) => {
          this.filters = filters;
          // this reloads the states for the lanes, and then the wis inside the lanes.
          filters.forEach((filter) => {
            if (filter.paramKey === 'filter[workitemtype]')
              this.getDefaultWorkItemTypeStates(filter.value);
          });
    });
  }

}
