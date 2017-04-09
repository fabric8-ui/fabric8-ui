import { FilterService } from './../../shared/filter.service';
import { AreaModel } from './../../models/area.model';
import { AreaService } from './../../area/area.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewChildren,
  QueryList,
  TemplateRef,
  DoCheck,
  ViewEncapsulation
} from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { cloneDeep, trimEnd } from 'lodash';

import { IterationService } from './../../iteration/iteration.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Broadcaster } from 'ngx-base';
import { Space, Spaces } from 'ngx-fabric8-wit';
import { AuthenticationService, User, UserService } from 'ngx-login-client';
import { ArrayCount } from 'ngx-widgets';
import { DragulaService } from 'ng2-dragula';
import { Dialog } from 'ngx-widgets';

import { IterationModel } from './../../models/iteration.model';
import { WorkItem } from '../../models/work-item';
import { WorkItemType } from '../../models/work-item-type';
import { WorkItemService } from '../work-item.service';

@Component({
  // tslint:disable-next-line:use-host-property-decorator
  host: {
     'class': 'app-component height-100 flex-container in-column-direction flex-grow-1'
  },
  selector: 'alm-board',
  templateUrl: './work-item-board.component.html',
  styleUrls: ['./work-item-board.component.scss']
})

export class WorkItemBoardComponent implements OnInit, OnDestroy {

  @ViewChildren('activeFilters', {read: ElementRef}) activeFiltersRef: QueryList<ElementRef>;
  @ViewChild('activeFiltersDiv') activeFiltersDiv: any;

  workItem: WorkItem;
  filters: any[] = [];
  lanes: Array<any> = [];
  pageSize: number = 20;
  loggedIn: Boolean = false;
  spaceSubscription: Subscription;
  contentItemHeight: number = 85;
  boardContextSubscription: Subscription;
  private allUsers: User[] = [];
  private iterations: IterationModel[] = [];
  private workItemTypes: WorkItemType[] = [];
  private readyToInit = false;
  private areas: AreaModel[] = [];
  private loggedInUser: User;
  eventListeners: any[] = [];
  dialog: Dialog;
  showDialog = false;
  dragulaEventListeners: any[] = [];
  private allowedFilterParams: string[] = ['iteration'];
  private existingQueryParams: Object = {};

  constructor(
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private router: Router,
    private workItemService: WorkItemService,
    private dragulaService: DragulaService,
    private iterationService: IterationService,
    private userService: UserService,
    private spaces: Spaces,
    private areaService: AreaService,
    private filterService: FilterService,
    private route: ActivatedRoute) {
      this.dragulaService.drag.subscribe((value) => {
        this.onDrag(value.slice(1));
      });

      this.dragulaService.drop.subscribe((value) => {
        this.onDrop(value.slice(1));
      });

      this.dragulaService.over.subscribe((value) => {
        this.onOver(value.slice(1));
      });

      this.dragulaEventListeners.push(
        this.dragulaService.drag.subscribe((value) => {
          this.onDrag(value.slice(1));
        }),
        this.dragulaService.drop.subscribe((value) => {
          this.onDrop(value.slice(1));
        }),
        this.dragulaService.over.subscribe((value) => {
          this.onOver(value.slice(1));
        }),
         this.dragulaService.out.subscribe((value) => {
          this.onOut(value.slice(1));
        })
      );
    }

  ngOnInit() {
    this.listenToEvents();
    this.loggedIn = this.auth.isLoggedIn();
    this.spaceSubscription = this.spaces.current.subscribe(space => {
      if (space) {
        console.log('[WorkItemBoardComponent] New Space selected: ' + space.attributes.name);
        this.initStuff();
      } else {
        console.log('[WorkItemBoardComponent] Space deselected');
        this.lanes = [];
        this.workItemTypes = [];
      }
    });
    this.boardContextSubscription = this.broadcaster.on<WorkItemType>('board_type_context').subscribe(workItemType => {
      if (workItemType) {
        console.log('[WorkItemBoardComponent] New type context selected: ' + workItemType.attributes.name);
        this.lanes = [];
        this.getDefaultWorkItemTypeStates(workItemType.id);
      }
    });
    this.initStuff();
  }

  ngOnDestroy() {
    console.log('Destroying all the listeners in board component');
    this.eventListeners.forEach(subscriber => subscriber.unsubscribe());
    this.dragulaEventListeners.forEach(subscriber => subscriber.unsubscribe());
  }

  initStuff() {
    Observable.combineLatest(
      this.iterationService.getIterations(),
      this.userService.getAllUsers(),
      this.workItemService.getWorkItemTypes(),
      this.areaService.getAreas(),
      this.userService.getUser(),
    )
    .subscribe(([iterations, users, wiTypes, areas, loggedInUser]) => {
      this.allUsers = users;
      this.iterations = iterations;
      this.workItemTypes = wiTypes;
      this.readyToInit = true;
      this.areas = areas;
      this.loggedInUser = loggedInUser;

      // Resolve iteration filter on the first load of board view
      // If there is an existing iteration query params already
      // Set the filter service with iteration filter
      if (Object.keys(this.existingQueryParams).indexOf('iteration') > -1) {
        const filterIteration = this.iterations.find(it => {
          return it.attributes.resolved_parent_path + '/' + it.attributes.name ===
            this.existingQueryParams['iteration'];
        })
        if (filterIteration) {
           this.filterService.setFilterValues('iteration', filterIteration.id)
        }
      }

      // Set lanes
      this.getDefaultWorkItemTypeStates();
    });
  }

  getWorkItems(pageSize, lane) {
    this.pageSize = pageSize;
    this.workItemService.getWorkItems(pageSize, [{
        active: true,
        paramKey: 'filter[workitemstate]',
        value: lane.option
      }, ...this.filters, ...this.filterService.getAppliedFilters()])
    .subscribe(workItemResp => {
      const workItems = workItemResp.workItems;
      lane.workItems = this.workItemService.resolveWorkItems(
        workItems,
        this.iterations,
        this.allUsers,
        this.workItemTypes
      );
      lane.nextLink = workItemResp.nextLink;
    });
  }

  getDefaultWorkItemTypeStates(workItemTypeId?: string) {
    this.lanes = [];
    if (!workItemTypeId) {
        if (this.workItemTypes.length) {
          let lanes = this.workItemTypes[0].attributes.fields['system.state'].type.values;
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
            value: this.workItemTypes[0].id
          } ];
        }
    } else {
      // we have a type id, we just fetch the states from it.
      let witype = this.workItemTypes.find(type => type.id === workItemTypeId);
      if (witype) {
        let lanes = witype.attributes.fields['system.state'].type.values;
        lanes.forEach((value, index) => {
          this.lanes.push({
            option: value,
            workItems: [] as WorkItem[],
            nextLink: null
          });
        });
      } else {
        this.getDefaultWorkItemTypeStates();
      }
    }
  }

  initWiItems($event, lane) {
    this.getWorkItems($event.pageSize, lane);
  }

  fetchMoreWiItems(lane) {
    console.log('More for ' + lane.option);
    if (lane.nextLink) {
      this.workItemService.getMoreWorkItems(lane.nextLink)
        .subscribe((workItemResp) => {
          lane.workItems = [
            ...lane.workItems,
            ...this.workItemService.resolveWorkItems(
              workItemResp.workItems,
              this.iterations,
              this.allUsers,
              this.workItemTypes
          )];
          lane.nextLink = workItemResp.nextLink;
        });
    } else {
      console.log('No More for ' + lane.option);
    }
  }

  onCreateWorkItem(workItem) {
    let resolveItem = this.workItemService.resolveWorkItems(
      [workItem],
      this.iterations,
      this.allUsers,
      this.workItemTypes
    );

    let lane = this.lanes.find((lane) => lane.option === 'new');
    lane.workItems = [...resolveItem, ...lane.workItems];
  }

  gotoDetail(workItem: WorkItem) {
    let link = trimEnd(this.router.url.split('detail')[0], '/') + '/detail/' + workItem.id;
    this.router.navigateByUrl(link);
  }

  kebabClick(event: any): void {
    event.stopPropagation();
  }

  openDetail(event: any): void {
    event.stopPropagation();
  }

  confirmDelete(event: MouseEvent) {
    event.stopPropagation();
    this.dialog = {
      'title': 'Confirm deletion of Work Item',
      'message': 'Are you sure you want to delete Work Item - ' + this.workItem.attributes['system.title'] + ' ?',
      'actionButtons': [
        {'title': 'Confirm', 'value': 1, 'default': false},
        {'title': 'Cancel', 'value': 0, 'default': true}
      ]
    } as Dialog;
    this.showDialog = true;
  }

  onButtonClick(val: number) {
    // callback from the confirm delete dialog
    if (val == 1) {
      this.onDelete(null);
    }
    this.showDialog = false;
  }

  onMoveToBacklog(event: any): void {
    alert('Not Implemented yet');
    event.stopPropagation();
  }

  onDelete(event: MouseEvent): void {
    if (event)
      event.stopPropagation();
    this.workItemService.delete(this.workItem)
    .subscribe(() => {
      console.log('Deleted');
    });
  }

  onTouchstart(event: any) {
    event.preventDefault();
  }

  onDrag(args: any) {
    let [el, source] = args;
  }

  getWI(workItem: WorkItem) {
    let lane = this.lanes.find((lane) => lane.option === workItem.attributes['system.state']);
    let _workItem = lane.workItems.find((item) => item.id === workItem.id);
    this.workItem = _workItem;
  }

  isSelected(wi: WorkItem){
    return this.workItem == wi;
  }

  onDrop(args) {
    let [el, target, source, sibling] = args;
    target.parentElement.parentElement.classList.remove('active-lane');
    let state = target.parentElement.parentElement.getAttribute('data-state');
    let adjElm = null;

    let prevElId = '0';
    try {
      prevElId = el.previousElementSibling.getAttribute('data-id');
    } catch (e) {}

    this.changeLane(this.workItem.attributes['system.state'], state, this.workItem, prevElId);

    if (el.previousElementSibling) {
      adjElm = el.previousElementSibling;
      this.changeState(state, el.getAttribute('data-id'), adjElm.getAttribute('data-id'), 'below');
    }
    else if(el.nextElementSibling) {
      adjElm = el.nextElementSibling;
      this.changeState(state, el.getAttribute('data-id'), adjElm.getAttribute('data-id'), 'above');
    }
    else {
      this.changeState(state, el.getAttribute('data-id'), null, 'above');
    }
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

  changeState(option: any, elId: string, adjElmId: string | null = null, direction: string): void {
    this.workItem.attributes['system.state'] = option;
    let lane = this.lanes.find((lane) => lane.option === this.workItem.attributes['system.state']);
    if (this.workItem.id) {
      this.workItemService
        .update(this.workItem)
        .subscribe((workItem) => {
          let wItem = lane.workItems.find((item) => item.id === workItem.id);
          wItem.attributes['version'] = workItem.attributes['version'];
          this.activeOnList();
          if (adjElmId !== null) {
            this.workItemService.reOrderWorkItem(wItem, adjElmId, direction)
                .subscribe((workitem) => {
                  lane.workItems.find((item) => item.id === workItem.id).attributes['version'] = workitem.attributes['version'];
                  lane.workItems.find((item) => item.id === workItem.id).attributes['system.order'] = workitem.attributes['system.order'];
                });
          }
      });
    }
  }

  changeLane(oldState, newState, workItem, prevIdEl: string | null = null) {
    let oldLane = this.lanes.find((lane) => lane.option === oldState);
    let newLane = this.lanes.find((lane) => lane.option === newState);
    let index = oldLane.workItems.findIndex((item) => item.id === workItem.id);

    oldLane.workItems.splice(index, 1);

    if (prevIdEl !== null) {
      let newIndex = newLane.workItems.findIndex((item) => item.id === prevIdEl);
      if (newIndex > -1) {
        newIndex += 1;
        newLane.workItems.splice(newIndex, 0, workItem);
      } else {
        newLane.workItems.splice(0, 0, workItem);
      }
    } else {
      newLane.workItems.push(workItem);
    }
  }

  listenToEvents() {

    this.eventListeners.push(
      this.broadcaster.on<string>('updateWorkItem')
        .subscribe((workItem: string) => {
          let updatedItem = JSON.parse(workItem) as WorkItem;
          let lane = this.lanes.find((lane) => lane.option === updatedItem.attributes['system.state']);
          let index = lane.workItems.findIndex((item) => item.id === updatedItem.id);
          if (index > -1) {
            lane.workItems[index] = updatedItem;
          }
        })
    );

    // filters like assign to me should stack with the current filters
    this.eventListeners.push(
      this.broadcaster.on<string>('item_filter')
        .subscribe((filters: any) => {
          this.filters = filters;
          // this reloads the states for the lanes, and then the wis inside the lanes.
          filters.forEach((filter) => {
            if (filter.paramKey === 'filter[workitemtype]')
              this.getDefaultWorkItemTypeStates(filter.value);
          });
      })
    );

    this.eventListeners.push(
      this.broadcaster.on<string>('wi_change_state')
          .subscribe((data: any) => {
            this.changeLane(data[0].oldState, data[0].newState, data[0].workItem);
      })
    );

    this.eventListeners.push(
      this.broadcaster.on<string>('detail_close')
        .subscribe(()=>{
          this.workItem = <WorkItem>{};
        })
    );

    this.eventListeners.push(
      this.broadcaster.on<string>('wi_item_filter')
        .subscribe((filters: any) => {
          this.lanes.forEach(lane => this.getWorkItems(this.pageSize, lane));
      })
    );

    this.eventListeners.push(
      this.route.queryParams.subscribe((params) => {
        this.existingQueryParams = params;
        // on no params and not the first ever call
        if (!Object.keys(params).length && this.lanes.length) {
          // Cleaning up filters from filter service
          this.filterService.clearFilters();
          // Apply all cleaned up filters
          this.filterService.applyFilter();
        } else if(Object.keys(params).length &&
          Object.keys(params).indexOf('iteration') > -1) {

          if (Object.keys(params).length === 1) {
            this.filterService.clearFilters();
          } else {
            this.filterService.clearFilters(this.allowedFilterParams);
          }

          // Resolve filter iteration once the board view is loaded
          if (this.lanes.length) {
            const filterIteration = this.iterations.find(it => {
              return it.attributes.resolved_parent_path + '/' + it.attributes.name ===
                this.existingQueryParams['iteration'];
            })
            if (filterIteration) {
              this.filterService.setFilterValues('iteration', filterIteration.id)
            }
          }
          this.filterService.applyFilter();
        }
      })
    );
  }

}
