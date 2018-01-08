import { FilterService } from '../../services/filter.service';
import { AreaModel } from '../../models/area.model';
import { AreaService } from '../../services/area.service';
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
  ViewEncapsulation,
  Renderer2,
  AfterViewChecked
} from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { cloneDeep, trimEnd } from 'lodash';

import { IterationService } from '../../services/iteration.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Broadcaster, Notification, NotificationType, Notifications } from 'ngx-base';
import { Space, Spaces } from 'ngx-fabric8-wit';
import { AuthenticationService, User, UserService } from 'ngx-login-client';
import { ArrayCount } from 'ngx-widgets';
import { DragulaService } from 'ng2-dragula';
import { Dialog } from 'ngx-widgets';

import { CardValue } from './../card/card.component';
import { IterationModel } from '../../models/iteration.model';
import { UrlService } from './../../services/url.service';
import { WorkItem } from '../../models/work-item';
import { WorkItemType } from '../../models/work-item-type';
import { WorkItemService } from '../../services/work-item.service';
import { WorkItemDataService } from './../../services/work-item-data.service';
import { CollaboratorService } from '../../services/collaborator.service';
import { LabelService } from '../../services/label.service';
import { LabelModel } from '../../models/label.model';
import { GroupTypesService } from '../../services/group-types.service';
import { GroupTypesModel } from '../../models/group-types.model';

@Component({
  // tslint:disable-next-line:use-host-property-decorator
  selector: 'alm-board',
  templateUrl: './planner-board.component.html',
  styleUrls: ['./planner-board.component.less']
})

export class PlannerBoardComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChildren('activeFilters', {read: ElementRef}) activeFiltersRef: QueryList<ElementRef>;
  @ViewChild('activeFiltersDiv') activeFiltersDiv: any;
  @ViewChild('associateIterationModal') associateIterationModal: any;
  @ViewChild('sidePanel') sidePanelRef: any;
  @ViewChild('toolbarHeight') toolbarHeight: ElementRef;
  @ViewChild('boardContainer') boardContainer: any;
  @ViewChild('containerHeight') containerHeight: ElementRef;
  workItem: WorkItem;
  cardItem: CardValue;
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
  private loggedInUser: any[];
  eventListeners: any[] = [];
  dialog: Dialog;
  showDialog = false;
  dragulaEventListeners: any[] = [];
  private allowedFilterParams: string[] = ['iteration'];
  private urlListener = null;
  private currentIteration: BehaviorSubject<string | null>;
  private currentWIType: BehaviorSubject<string | null>;
  private existingQueryParams: Object = {};
  private wiSubscription = null;
  lane: any;
  private labels: LabelModel[] = [];
  private uiLockedAll = false;
  private uiLockedBoard = true;
  private uiLockedSidebar = false;
  private currentSpace: Space;
  private included: WorkItem[];
  groupTypes: GroupTypesModel[] = [];

  sidePanelOpen: boolean = true;
  constructor(
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private collaboratorService: CollaboratorService,
    private notifications: Notifications,
    private router: Router,
    private workItemService: WorkItemService,
    private groupTypesService: GroupTypesService,
    private workItemDataService: WorkItemDataService,
    private dragulaService: DragulaService,
    private iterationService: IterationService,
    private labelService: LabelService,
    private userService: UserService,
    private urlService: UrlService,
    private spaces: Spaces,
    private areaService: AreaService,
    private filterService: FilterService,
    private route: ActivatedRoute,
    private renderer: Renderer2) {
      let bag: any = this.dragulaService.find('wi-bag');
      this.dragulaEventListeners.push(
        this.dragulaService.drag.subscribe((value) => {
          this.onDrag(value.slice(1));
        }),
        this.dragulaService.drop
        .map(value => value.slice(1))
        .filter(value => {
          return !value[1].classList.contains('f8-itr') &&
                 !value[1].classList.contains('iteration-header');
        }).subscribe((args) => this.onDrop(args)),

        this.dragulaService.over
        .map(value => value.slice(1))
        .filter(value => {
          return value[1].classList.contains('f8-board__card');
        })
        .subscribe((args) => this.onOver(args)),

         this.dragulaService.out.subscribe((value) => {
          this.onOut(value.slice(1));
        })
      );
      if(bag !== undefined) {
        this.dragulaService.destroy('wi-bag');
      }
    }

  ngOnInit() {
    // If there is an iteration on the URL
    // Setting the value to currentIteration
    // BehaviorSubject so that we can compare
    // on update the value on URL
    const queryParams = this.route.snapshot.queryParams;
    if (Object.keys(queryParams).indexOf('iteration') > -1) {
      this.currentIteration = new BehaviorSubject(queryParams['iteration']);
    } else {
      this.currentIteration = new BehaviorSubject(null);
    }
    if (Object.keys(queryParams).indexOf('workitemtype') > -1) {
      this.currentWIType = new BehaviorSubject(queryParams['workitemtype']);
    } else {
      this.currentWIType = new BehaviorSubject(null);
    }

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

  }

  ngAfterViewChecked() {
    if(this.toolbarHeight) {
      let toolbarHt:any =  this.toolbarHeight.nativeElement.offsetHeight;
      let hdrHeight;
      if(document.getElementsByClassName('navbar-pf').length > 0) {
        hdrHeight = (document.getElementsByClassName('navbar-pf')[0] as HTMLElement).offsetHeight;
      }
      let expHeight: number = 0;
      if(document.getElementsByClassName('experimental-bar').length > 0) {
        expHeight = (document.getElementsByClassName('experimental-bar')[0] as HTMLElement).offsetHeight;
      }
      let targetHeight:any = window.innerHeight - toolbarHt - hdrHeight - expHeight ;
      this.renderer.setStyle(this.boardContainer.nativeElement, 'height', targetHeight + "px");

      let targetContHeight:number = window.innerHeight - hdrHeight - expHeight;
      this.renderer.setStyle(this.containerHeight.nativeElement, 'height', targetContHeight + "px");
      if(document.getElementsByTagName('body')) {
        document.getElementsByTagName('body')[0].style.overflow = "hidden";
      }
    }
  }
  ngOnDestroy() {
    console.log('Destroying all the listeners in board component');
    if (this.wiSubscription !== null) this.wiSubscription.unsubscribe();
    this.eventListeners.forEach(subscriber => subscriber.unsubscribe());
    this.dragulaEventListeners.forEach(subscriber => subscriber.unsubscribe());
    if (this.urlListener) {
      this.urlListener.unsubscribe();
      this.urlListener = null;
    }
    document.getElementsByTagName('body')[0].style.overflow = "auto";
  }

  initStuff() {
    this.uiLockedBoard = true;
    Observable.combineLatest(
      this.iterationService.getIterations(),
      // this.collaboratorService.getCollaborators(),
      this.workItemService.getWorkItemTypes(),
      this.areaService.getAreas(),
      this.labelService.getLabels(),
      this.userService.getUser().catch(err => Observable.of({} as User)),
      this.currentIteration,
      this.groupTypesService.getGroupTypes()
    )
    .subscribe(([iterations, wiTypes, areas, labels, loggedInUser, currentIteration, groupTypes]) => {
      this.iterations = iterations;
      this.workItemTypes = wiTypes;
      this.readyToInit = true;
      this.areas = areas;
      this.labels = labels;
      this.loggedInUser = loggedInUser;
      this.groupTypes = groupTypes;
      // Resolve iteration filter on the first load of board view
      // If there is an existing iteration query params already
      // Set the filter service with iteration filter
      if (currentIteration !== null) {
        const filterIteration = this.iterations.find(it => {
          return it.attributes.resolved_parent_path + '/' + it.attributes.name ===
            currentIteration.toString();
        })
        if (filterIteration) {
           this.filterService.setFilterValues('iteration', filterIteration.id);
        }
      } else {
        this.filterService.clearFilters(['iteration']);
      }

      // Set lanes
      this.prepareLanes();
      this.uiLockedBoard = false;
    });
  }

  getWorkItems(pageSize, mainLane, payload) {
    let lane = cloneDeep(mainLane);

    let exp = {
      expression: this.filterService.queryJoiner(
        cloneDeep(payload.expression),
        this.filterService.and_notation,
        this.filterService.queryBuilder(
          'state', this.filterService.equal_notation, lane.option
        )
    )}

    return this.workItemService.getWorkItems2(pageSize, exp)
    .map(workItemResp => {
      let workItems = workItemResp.workItems;
      this.included = workItemResp.included;
      let cardValue: CardValue[] = [];
      this.workItemDataService.setItems(workItems);
      lane.workItems = this.workItemService.resolveWorkItems(
        workItems,
        this.iterations,
        [],
        this.workItemTypes,
        this.labels,
        this.included
      );
      lane.cardValue = lane.workItems.map(item => {
        return {
            id: item.attributes['system.number'],
            type: item.relationships.baseType.data.attributes['icon'],
            title: item.attributes['system.title'],
            avatar: '',
            hasLink: true,
            link: "./../detail/"+item.attributes['system.number'],
            menuItem: [{
              id: 'card_associate_iteration',
              value: 'Associate with iteration...'
            },
            {
              id: 'card_open',
              value: 'Open',
              link: "./../detail/"+item.attributes['system.number']
            },
            {
              id: 'card_move_to_backlog',
              value: 'Move to backlog'
            }],
            extraData: {
              selfLink: item.links.self,
              version: item.attributes['version'],
              UUID: item.id,
              labels: item.relationships.labels.data
            }
        }
      });
      lane.nextLink = workItemResp.nextLink;
      return lane;
    });
  }

  createCardItem(workItems: WorkItem[]) {
    let lane;
    let cardValues: CardValue[] = [];

    workItems = this.workItemService.resolveWorkItems(
      workItems,
      this.iterations,
      [],
      this.workItemTypes,
      this.labels
    );
    for(let i=0; i<workItems.length; i++) {
      lane = this.lanes.find((lane) => lane.option === workItems[i].attributes['system.state']);
      cardValues.push({
        id: workItems[i].attributes['system.number'],
        type: workItems[i].relationships.baseType.data.attributes['icon'],
        title: workItems[i].attributes['system.title'],
        avatar: (() => {
                if(workItems[i].relationships.assignees.data.length > 0)
                  return workItems[i].relationships.assignees.data[0].attributes['imageURL'];
                else return '';})(),
        hasLink: true,
        link: "./../detail/"+workItems[i].attributes['system.number'],
        menuItem: [{
          id: 'card_associate_iteration',
          value: 'Associate with iteration...'
        },
        {
          id: 'card_open',
          value: 'Open',
          link: "./../detail/"+workItems[i].attributes['system.number']
        },
        {
          id: 'card_move_to_backlog',
          value: 'Move to backlog'
        }],
        extraData: {
          selfLink: workItems[i].links.self,
          version: workItems[i].attributes['version'],
          UUID: workItems[i].id,
          labels: workItems[i].relationships.labels.data
        }
      });
      lane.cardValue = [...cardValues, ...lane.cardValue];
    }
  }

  updateCardItem(workItem: WorkItem) {
    this.workItemService.resolveType(workItem);
    let lane = this.lanes.find((lane) => lane.option === workItem.attributes['system.state']);
    let cardItem = lane.cardValue.find((item) => item.id === workItem.attributes['system.number']);
    cardItem.title = workItem.attributes['system.title'];
    cardItem.type = workItem.relationships.baseType.data.attributes['icon'];
    cardItem.extraData['version'] = workItem.attributes['version'];
    this.workItemService.resolveAssignees(workItem.relationships.assignees)
      .subscribe(assignees => {
        workItem.relationships.assignees.data = assignees;
        cardItem.avatar = (() => {
          if(workItem.relationships.assignees.data.length > 0)
            return workItem.relationships.assignees.data[0].attributes['imageURL'];
          else return '';})()
      });

  }

   cardMenuClick(menuId: string, itemNumber: string, lane: any) {
    this.workItem = lane.workItems.find((item) => item.attributes['system.number'] === itemNumber);
    if (menuId === 'card_associate_iteration') {
      this.associateIterationModal.open();
    }
    else if (menuId === 'card_move_to_backlog') {
      this.onMoveToBacklog();
    }
  }

  onMoveToBacklog(): void {
    //set this work item's iteration to None
    //send a patch request
    this.workItem.relationships.iteration = {};
    this.workItemService
      .update(this.workItem)
      .switchMap(item => {
        return this.iterationService.getIteration(item.relationships.iteration)
          .map(iteration => {
            item.relationships.iteration.data = iteration;
            return item;
          });
      })
      .subscribe(workItem => {
        this.workItem.relationships.iteration = workItem.relationships.iteration;
        this.workItem.attributes['version'] = workItem.attributes['version'];
        this.updateCardItem(workItem);
        this.workItemDataService.setItem(workItem);
        try {
          this.notifications.message({
            message: workItem.attributes['system.title'] + ' has been moved to the Backlog.',
            type: NotificationType.SUCCESS
          } as Notification);
        } catch (e) {
          console.log('Error displaying notification. Iteration was moved to Backlog.');
        }

    },
    (err) => {
      try {
        this.notifications.message({
          message: this.workItem.attributes['system.title'] + ' could not be moved to the Backlog.',
          type: NotificationType.DANGER
        } as Notification);
      } catch (e) {
        console.log('Error displaying notification. Error moving Iteration to Backlog.');
      }

    });
  }

  prepareLanes() {
    this.lanes = [];
    let lanes = ['new', 'open', 'in progress', 'resolved', 'closed'];
    lanes.forEach((value, index) => {
      this.lanes.push({
        option: value,
        workItems: [] as WorkItem[],
        nextLink: null
      });
    });
  }

  /**
   * Called from each lane
   * @param event
   * @param lane
   */

  initWiItems($event, lane) {
    this.pageSize = $event.pageSize;
    // Subscribe only once
    // When the first lane is ready
    // we have the page size
    if (this.urlListener === null) {
      this.listenToUrlParams();
    }

    // Once all the lanes inititated, apply the filters to load work items
    if (lane.option === this.lanes[this.lanes.length - 1].option) {
      this.filterService.applyFilter();
    }
  }

  fetchMoreWiItems(lane) {
    console.log('More for ' + lane.option);
    if (lane.nextLink) {
      let resolveFromIndex = lane.workItems.length;
      this.workItemService.getMoreWorkItems(lane.nextLink)
        .map((workItemResp) => {
          lane.workItems = [
            ...lane.workItems,
            ...this.workItemService.resolveWorkItems(
              workItemResp.workItems,
              this.iterations,
              [],
              this.workItemTypes,
              this.labels,
              workItemResp.included
          )];
          lane.cardValue = [
            ...lane.cardValue,
            ...workItemResp.workItems.map(item => {
              return {
                id: item.attributes['system.number'],
                type: item.relationships.baseType.data.attributes['icon'],
                title: item.attributes['system.title'],
                avatar: '',
                hasLink: true,
                link: "./../detail/"+item.attributes['system.number'],
                menuItem: [{
                  id: 'card_associate_iteration',
                  value: 'Associate with iteration...'
                },
                {
                  id: 'card_open',
                  value: 'Open',
                  link: "./../detail/"+item.attributes['system.number']
                },
                {
                  id: 'card_move_to_backlog',
                  value: 'Move to backlog'
                }],
                extraData: {
                  selfLink: item.links.self,
                  version: item.attributes['version'],
                  UUID: item.id,
                  labels: item.relationships.labels.data
                }
              }
            })
          ];
          lane.nextLink = workItemResp.nextLink;
          return resolveFromIndex;
        })
        .map(indexFrom => {
          let itemsToTakeCare = cloneDeep(lane.workItems);
          let usersToFetch = [];
          itemsToTakeCare.splice(0, indexFrom);
          itemsToTakeCare
            .filter((item: WorkItem) => {
              return item.relationships.assignees.data &&
                item.relationships.assignees.data.length;
            })
            .forEach((item:WorkItem) => {
              item.relationships.assignees.data.forEach((user) => {
                if (usersToFetch.indexOf(user.links.self) === -1) {
                  usersToFetch.push(user.links.self);
                }
              })
            });
          return usersToFetch;
        })
        .flatMap((usersToFetch) => {
          return this.workItemService.getUsersByURLs(usersToFetch);
        })
        .do((users) => {
          for (let w_index = resolveFromIndex; w_index < lane.workItems.length; w_index++) {
            // Resolve assignee here
            if (Object.keys(lane.workItems[w_index].relationships.assignees).length
              && lane.workItems[w_index].relationships.assignees.data.length) {
              lane.workItems[w_index].relationships.assignees.data.forEach((assignee, a_index) => {
                lane.workItems[w_index].relationships.assignees.data[a_index] =
                  users.find(u => u.id === assignee.id);
                lane.cardValue[w_index].avatar =
                  lane.workItems[w_index].relationships.assignees.data[a_index].attributes['imageURL'];
              });
            }
          }
        })
        .subscribe();
    } else {
      console.log('No More for ' + lane.option);
    }
  }

  onCreateWorkItem(workItem) {
    let resolveItem = this.workItemService.resolveWorkItems(
      [workItem],
      this.iterations,
      [],
      this.workItemTypes,
      this.labels
    );

    let lane = this.lanes.find((lane) => lane.option === workItem.attributes['system.state']);
    lane.workItems = [...resolveItem, ...lane.workItems];
    this.createCardItem([workItem]);
  }

  // gotoDetail(workItem: WorkItem) {
  //   let link = trimEnd(this.router.url.split('detail')[0], '/') + '/detail/' + workItem.id;
  //   this.router.navigateByUrl(link);
  // }

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
    console.log('board component on drag');
  }

  getWI(workItemNumber: string, lane: any) {
    //let lane = this.lanes.find((lane) => lane.option === workItem.attributes['system.state']);
    let _workItem = lane.workItems.find((item) => item.attributes['system.number'] === workItemNumber);
    let _cardItem = lane.cardValue.find((item) => item.id === workItemNumber);
    this.workItem = cloneDeep(_workItem);
    this.cardItem = cloneDeep(_cardItem);
  }

  isSelected(wi: WorkItem){
    return this.workItem == wi;
  }

  onDrop(args) {
    console.log('board component on drop', args);
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
      this.changeState(state, el.getAttribute('data-id'), adjElm.getAttribute('data-UUID'), 'below');
    }
    else if(el.nextElementSibling) {
      adjElm = el.nextElementSibling;
      this.changeState(state, el.getAttribute('data-id'), adjElm.getAttribute('data-UUID'), 'above');
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
    el.classList.remove('hide');
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
    let prevState = this.workItem.attributes['system.state'];
    this.workItem.attributes['system.state'] = option;
    let lane = this.lanes.find((lane) => lane.option === this.workItem.attributes['system.state']);
    if (this.workItem.id) {
      this.workItemService
        .update(this.workItem)
        .subscribe((workItem) => {
          let wItem = lane.workItems.find((item) => item.id === workItem.id);
          wItem.attributes['version'] = workItem.attributes['version'];
          this.updateCardItem(workItem);
          this.workItemDataService.setItem(workItem);
          if (wItem.relationships.iteration) {
            // Item closed for an iteration
            if (wItem.attributes['system.state'] !== 'closed' && prevState === 'closed') {
              this.broadcaster.broadcast('wi_change_state_it', [{
                iterationId: wItem.relationships.iteration.data.id,
                closedItem: +1
              }]);
            }
            // Item opened for an iteration
            if (wItem.attributes['system.state'] === 'closed' && prevState !== 'closed') {
              this.broadcaster.broadcast('wi_change_state_it', [{
                iterationId: wItem.relationships.iteration.data.id,
                closedItem: -1
              }]);
            }
          }
          this.activeOnList();
          if (adjElmId !== null) {
            this.workItemService.reOrderWorkItem(wItem, adjElmId, direction)
                .subscribe((workitem) => {
                  this.workItemDataService.setItem(workItem);
                  lane.workItems.find(item => item.id === workItem.id).attributes['version'] = workitem.attributes['version'];
                  lane.workItems.find(item => item.id === workItem.id).attributes['system.order'] = workitem.attributes['system.order'];
                  this.updateCardItem(workitem);
                });
          }
      });
    }
  }

  changeLane(oldState, newState, workItem, prevIdEl: string | null = null) {
    let oldLane = this.lanes.find((lane) => lane.option === oldState);
    let newLane = this.lanes.find((lane) => lane.option === newState);
    let index = oldLane.workItems.findIndex((item) => item.id === workItem.id);
    let _index = oldLane.cardValue.findIndex((item) => item.id === workItem.attributes['system.number']);

    oldLane.workItems.splice(index, 1);
    oldLane.cardValue.splice(_index, 1);

    if (prevIdEl !== null) {
      let newIndex = newLane.workItems.findIndex((item) => item.attributes['system.number'] == prevIdEl);
      let _newIndex = newLane.cardValue.findIndex((item) => item.id == prevIdEl);
      if (newIndex > -1 && _newIndex > -1) {
        newIndex += 1;
        _newIndex += 1;
        newLane.workItems.splice(newIndex, 0, workItem);
        newLane.cardValue.splice(_newIndex, 0, this.cardItem);
      } else {
        newLane.workItems.splice(0, 0, workItem);
        newLane.cardValue.splice(0, 0, this.cardItem);
      }
    } else {
      newLane.workItems.push(workItem);
      newLane.cardValue.push(this.cardItem);
    }
  }

  listenToEvents() {
    this.eventListeners.push(
      this.broadcaster.on<string>('wi_change_state')
          .subscribe((data: any) => {
            this.changeLane(data[0].oldState, data[0].newState, data[0].workItem);
      })
    );

    this.eventListeners.push(
      this.workItemService.editWIObservable.subscribe(updatedItem => {
        let lane = this.lanes.find(lane => lane.option === updatedItem.attributes['system.state']);
        let index = lane.workItems.findIndex((item) => item.id == updatedItem.id);
        let cardItem = lane.cardValue.find((item) => item.id == updatedItem.attributes['system.number']);
        this.workItemDataService.setItem(updatedItem);
        if (this.filterService.doesMatchCurrentFilter(updatedItem)) {
          if(index > -1) {
            lane.workItems[index] = updatedItem;
            this.updateCardItem(updatedItem);
          } else {
            lane.workItems.splice(0, 0, updatedItem);
            this.createCardItem([updatedItem]);
          }
        } else {
          lane.workItems.splice(index, 1);
          lane.cardValue.splice(index, 1);
        }
      })
    );

    this.eventListeners.push(
      Observable.combineLatest(
        this.filterService.filterChange,
        this.route.queryParams
      ).subscribe(([filters, params]) => {
        if (this.wiSubscription !== null) {
          this.wiSubscription.unsubscribe();
        }

        this.wiSubscription =
        this.spaces.current.switchMap(space => {
          let appliedFilters = this.filterService.getAppliedFilters();
          // remove the filter item from the filters
          for (let f=0; f<appliedFilters.length; f++) {
            if (appliedFilters[f].paramKey=='filter[parentexists]') {
              appliedFilters.splice(f, 1);
            }
          }
          // TODO Filter temp
          // Take all the applied filters and prepare an object to make the query string
          let newFilterObj = {};
          appliedFilters.forEach(item => {
            newFilterObj[item.id] = item.value;``
          })
          newFilterObj['space'] = space.id;
          let payload = {};
          if ( this.route.snapshot.queryParams['q'] ) {
            let existingQuery = this.filterService.queryToJson(this.route.snapshot.queryParams['q']);
            let filterQuery = this.filterService.queryToJson(this.filterService.constructQueryURL('', newFilterObj));
            let exp = this.filterService.queryJoiner(existingQuery, this.filterService.and_notation, filterQuery);
            Object.assign(payload, {
              expression: exp
            });
          } else {
            payload = {
              expression: this.filterService.queryToJson(this.filterService.constructQueryURL('', newFilterObj))
            }
          }
          return Observable.forkJoin(
            this.lanes.map(lane => this.getWorkItems(this.pageSize, lane, payload))
          )
        })
        .take(1)
        .map(finalLanes => {
          let usersToFetch = [];
          this.lanes.forEach((lane, index) => {
            this.lanes[index].cardValue = cloneDeep(finalLanes[index].cardValue);
            this.lanes[index].workItems = cloneDeep(finalLanes[index].workItems);
            this.lanes[index].nextLink = finalLanes[index].nextLink;
            this.lanes[index].workItems
              .filter((item: WorkItem) => {
                return item.relationships.assignees.data &&
                  item.relationships.assignees.data.length;
              })
              .forEach((item:WorkItem) => {
                item.relationships.assignees.data.forEach((user) => {
                  if (usersToFetch.indexOf(user.links.self) === -1) {
                    usersToFetch.push(user.links.self);
                  }
                })
              });
          });
          return usersToFetch;
        })
        .flatMap((usersToFetch) => {
          return this.workItemService.getUsersByURLs(usersToFetch);
        })
        .do(users => {
          this.lanes.forEach((lane, l_index) => {
            this.lanes[l_index].workItems.forEach((item, w_index) => {
              // Resolve assignee here
              if (Object.keys(item.relationships.assignees).length && item.relationships.assignees.data.length) {
                item.relationships.assignees.data.forEach((assignee, a_index) => {
                  this.lanes[l_index].workItems[w_index].relationships.assignees.data[a_index] =
                    users.find(u => u.id === assignee.id);
                  this.lanes[l_index].cardValue[w_index].avatar =
                    this.lanes[l_index].workItems[w_index].relationships.assignees.data[a_index].attributes['imageURL'];
                });
              }
            })
          })
        })
        .subscribe();
      })
    );

    this.eventListeners.push(
      this.workItemService.addWIObservable.subscribe(item => {
        if(this.filterService.doesMatchCurrentFilter(item)) {
          this.onCreateWorkItem(item);
        }
      })
    );

    this.eventListeners.push(
      this.iterationService.dropWIObservable
        .flatMap(data => {
          if (data.error) {
            return this.workItemDataService.getItem(data.workItem.id);
          }
          return Observable.of(data.workItem);
        })
        .map((WI: WorkItem) => {
          let lane = this.lanes.find((lane) => lane.option === WI.attributes['system.state']);
          let index = lane.workItems.findIndex((item) => item.id == WI.id);
          return [index, lane, WI];
        })
        .filter(([index, lane, WI]) => {
          return index > -1;
        })
        .map(([index, lane, WI]) => {
          let workItem = cloneDeep(lane.workItems.splice(index, 1)[0]);
          let cardItem = cloneDeep(lane.cardValue.splice(index, 1)[0]);
          workItem.attributes['version'] = WI.attributes['version'];
          workItem.relationships.iteration = WI.relationships.iteration;
          cardItem.extraData['version'] = WI.attributes['version'];
          return [lane, index, cardItem, workItem];
        })
        .delay(0)
        .subscribe(([lane, index, cardItem, workItem]) => {
          if(this.filterService.doesMatchCurrentFilter(workItem)) {
            lane.cardValue.splice(index, 0, cardItem);
            lane.workItems.splice(index, 0, workItem);
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
          switch (context){
            case 'workitems':
              this.uiLockedBoard = true;
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
          switch (context){
            case 'workitems':
              this.uiLockedBoard = false;
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
  }

  listenToUrlParams() {
    this.urlListener =
      this.route.queryParams.subscribe((params) => {
        this.existingQueryParams = params;

        if (Object.keys(params).indexOf('iteration') > -1) {
          if (params['iteration'] !== this.currentIteration.getValue()) {
            this.currentIteration.next(params['iteration']);
          }
        } else if (this.currentIteration.getValue() !== null) {
          this.currentIteration.next(null);
        }

        if (Object.keys(params).indexOf('workitemtype') > -1) {
          if (params['workitemtype'] !== this.currentWIType.getValue()) {
            console.log('[WorkItemBoardComponent] New type context selected: ' + params['workitemtype']);
            this.currentWIType.next(params['workitemtype']);
          }
        } else if (this.currentWIType.getValue() !== null) {
          this.currentWIType.next(null);
        }
      });
  }

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
  }
}
