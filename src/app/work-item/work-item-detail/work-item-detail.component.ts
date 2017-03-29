import { Observable } from 'rxjs/Observable';
import {
  animate,
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  trigger,
  state,
  style,
  transition,
  ViewChild,
  ViewChildren,
  QueryList
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { Router }                 from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { cloneDeep, trimEnd } from 'lodash';
import { Space, Spaces } from 'ngx-fabric8-wit';
import { Broadcaster, Logger } from 'ngx-base';
import {
  AuthenticationService,
  User,
  UserService
} from 'ngx-login-client';

import { AreaModel } from '../../models/area.model';
import { AreaService } from '../../area/area.service';
import { IterationModel } from '../../models/iteration.model';
import { IterationService } from '../../iteration/iteration.service';

import { WorkItem, WorkItemAttributes, WorkItemRelations } from '../../models/work-item';
import { WorkItemService } from '../work-item.service';
import { WorkItemType } from '../../models/work-item-type';

@Component({
  selector: 'alm-work-item-detail',
  templateUrl: './work-item-detail.component.html',
  styleUrls: ['./work-item-detail.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(0)'
      })),
      state('out', style({
        transform: 'translateX(100%)'
      })),
      transition('in => out', animate('300ms ease-in-out')),
      transition('out => in', animate('500ms ease-in-out'))
    ]),
  ]
})

export class WorkItemDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('desc') description: any;
  @ViewChild('title') title: any;
  @ViewChild('userSearch') userSearch: any;
  @ViewChild('userList') userList: any;
  @ViewChild('dropdownButton') dropdownButton: any;
  @ViewChild('areaSearch') areaSearch: any;
  @ViewChild('areaList') areaList: any;
  @ViewChild('iterationSearch') iterationSearch: any;
  @ViewChild('iterationList') iterationList: any;

  workItem: WorkItem;
  workItemTypes: WorkItemType[];

  showDialog: boolean = false;

  submitted = false;
  active = true;
  loggedIn: Boolean = false;

  headerEditable: Boolean = false;
  descEditable: Boolean = false;

  validTitle: Boolean = true;
  titleText: any = '';
  descText: any = '';

  searchArea: Boolean = false;
  searchAssignee: Boolean = false;

  hasIteration: Boolean = false;
  searchIteration: Boolean = false;

  // TODO: should take current iteration as value after fetching
  selectedIteration: any;
  selectedArea: AreaModel;

  users: User[] = [];
  filteredUsers: User[] = [];

  loggedInUser: any;

  addNewWI: Boolean = false;

  panelState: string = 'out';

  areas: AreaModel[] = [];
  filteredAreas: AreaModel[] = [];

  iterations: IterationModel[] = [];

  renderedDesc: any = '';
  descViewType: any = 'html';

  spaceSubscription: Subscription;

  activeButton: boolean = true;

  arrowUp: boolean = true;

  workItemPayload: WorkItem;

  constructor(
    private areaService: AreaService,
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private workItemService: WorkItemService,
    private route: ActivatedRoute,
    private location: Location,
    private logger: Logger,
    private router: Router,
    private iterationService: IterationService,
    private userService: UserService,
    private spaces: Spaces
  ) {}

  ngOnInit(): void{
    // console.log('ALL USER DATA', this.route.snapshot.data['allusers']);
    // console.log('AUTH USER DATA', this.route.snapshot.data['authuser']);
    this.listenToEvents();
    this.getAreas();
    this.getIterations();
    this.loggedIn = this.auth.isLoggedIn();
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        let id = params['id'];

        // On changing item's details page
        // Reset the description value
        this.renderedDesc = '';
        this.descViewType = 'html';

        if (id.indexOf('new') >= 0){
          //Add a new work item
          this.addNewWI = true;
          this.headerEditable = true;
          let type = this.route.queryParams.forEach(params => {
            this.createWorkItemObj(params['type']);
          });
          this.getAllUsers();
        } else {
          this.loadWorkItem(id);
        }
      }
    });
    this.spaceSubscription = this.spaces.current.subscribe(space => {
      this.getAreas();
      this.getIterations();
    });
  }

  // toggles active state for Preview as HTML and Write in Markdown
  toggleActive(newValue: boolean) {
    if (this.activeButton === newValue) {
      this.activeButton = true;
    }
    else {
      this.activeButton = newValue;
    }
  }

  arrowDescription(newValue: boolean) {
    if (this.arrowUp === newValue) {
      this.arrowUp = true;
    } else {
      this.arrowUp = newValue;
    }
  }

  ngAfterViewInit() {
    // Open the panel

    // Why use a setTimeOut -
    // This is for unit testing.
    // After every round of change detection,
    // dev mode immediately performs a second round to verify
    // that no bindings have changed since the end of the first,
    // as this would indicate that changes are being caused by change detection itself.
    // I had to triggers another round of change detection
    // during that method - emit an event, whatever. Wrapping it in a timeout would do the job
    setTimeout(() => {
      this.panelState = 'in';
      if (this.headerEditable) {
        this.title.nativeElement.focus();
      }
    });
  }

  loadWorkItem(id: string): void {
    this.workItemService.getWorkItemById(id)
      .switchMap(workItem => {
        return Observable.forkJoin(
          Observable.of(workItem),
          this.workItemService.getWorkItemTypes(),
          this.areaService.getArea(workItem.relationships.area),
          this.iterationService.getIteration(workItem.relationships.iteration),
          this.workItemService.resolveAssignees(workItem.relationships.assignees),
          this.workItemService.resolveCreator2(workItem.relationships.creator),
          this.workItemService.resolveLinks(workItem.links.self + '/relationships/links')
        );
      })
      .subscribe(([workItem, workItemTypes, area, iteration, assignees, creator, [links, includes]]) => {
        // Resolve area
        workItem.relationships.area = {
          data: area
        };

        // Resolve iteration
        workItem.relationships.iteration = {
          data: iteration
        };

        // Resolve work item type
        workItem.relationships.baseType.data =
          workItemTypes.find(type => type.id === workItem.relationships.baseType.data.id) ||
          workItem.relationships.baseType.data;

        // Resolve assignees
        workItem.relationships.assignees = {
          data: assignees
        };

        // Resolve creator
        workItem.relationships.creator = {
          data: creator
        };

        // Resolve links
        workItem = Object.assign(
          workItem,
          {
            relationalData: {
              linkDicts: [],
              totalLinkCount: 0
            }
          }
        );
        links.forEach((link) => {
          this.workItemService.addLinkToWorkItem(link, includes, workItem);
        });

        this.closeUserRestFields();
        this.titleText = workItem.attributes['system.title'];
        this.descText = workItem.attributes['system.description'] || '';
        this.renderedDesc = workItem.attributes['system.description.rendered'];
        this.workItem = workItem;
        this.workItemPayload = {
          id: this.workItem.id,
          attributes: {
            version: this.workItem.attributes['version']
          },
          links: {
            self: this.workItem.links.self
          },
          type: this.workItem.type
        };
        // fetch the list of user
        // after getting the Workitem
        // to set assigned user
        // for this workitem from the list
        this.getAllUsers();
        this.activeOnList(400);
      },
      err => {
        this.closeDetails();
      });
  }

  createWorkItemObj(type: string) {
    this.workItem = new WorkItem();
    this.workItem.id = null;
    this.workItem.attributes = new WorkItemAttributes();
    this.workItem.relationships = new WorkItemRelations();
    this.workItem.type = 'workitems';
    this.workItem.relationships = {
      baseType: {
        data: {
          id: type,
          type: 'workitemtypes'
        }
      }
    } as WorkItemRelations;

    // Add creator
    this.userService.getUser()
      .subscribe(user => {
        this.workItem.relationships = Object.assign(
          this.workItem.relationships,
          {
            creator: {
              data: user
            }
          }
        );
      });

    this.workItem.relationalData = {};
    this.workItemService.resolveType(this.workItem);
    this.workItem.attributes = {
      'system.state': 'new'
    } as WorkItemAttributes;
  }

  getAllUsers() {
    this.users = cloneDeep(this.route.snapshot.data['allusers']) as User[];
    this.filteredUsers = cloneDeep(this.route.snapshot.data['allusers']) as User[];
    let authUser = cloneDeep(this.route.snapshot.data['authuser']);
    this.setLoggedInUser(authUser);
  }

  setLoggedInUser(authUser: any) {
    for (let i = 0; i < this.users.length; i++) {
      // This check needs to be updated by ID
      // once we have the new user format
      // on getting loggedIn user i.e. /user endpoint
      if (this.users[i].id === authUser.id) {
        this.loggedInUser = this.users[i];

        // removing logged in user from the list
        this.users.splice(i, 1);
        this.filteredUsers.splice(i, 1);
      }
    }
  }

  activeOnList(timeOut: number = 0) {
    setTimeout(() => {
      this.broadcaster.broadcast('activeWorkItem', this.workItem.id);
    }, timeOut);
  }

  updateOnList() {
    this.broadcaster.broadcast('updateWorkItem', JSON.stringify(this.workItem));
  }

  addNewItem(workItem: WorkItem) {
    this.broadcaster.broadcast('addWorkItem', JSON.stringify(workItem));
  }

  checkTitle(event: any): void {
    this.titleText = event;
    this.isValid(this.titleText);
  }

  isValid(checkTitle: String): void {
    this.validTitle = checkTitle.trim() != '';
  }

  descUpdate(event: any): void {
    this.descText = event;
  }

  closeHeader(): void {
    this.headerEditable = false;
  }

  openHeader(): void {
    if (this.loggedIn) {
      if (this.descEditable) {
        this.onUpdateDescription();
      }
      this.closeUserRestFields();
      this.headerEditable = true;
      setTimeout(() => {
        if (this.headerEditable) {
          this.title.nativeElement.focus();
        }
      });
    }
  }

  openDescription(): void {
    if (this.loggedIn) {
      if (this.headerEditable) {
        this.onUpdateTitle();
      }
      this.closeUserRestFields();
      this.descEditable = true;
      this.descViewType = 'markdown';
      setTimeout(() => {
        if (this.descEditable) {
          this.description.nativeElement.focus();
        }
      });
    }
  }

  closeDescription(): void {
    this.description.nativeElement.innerHTML = this.workItem.attributes['system.description.rendered'];
    this.showHtml(this.descText);
    this.descEditable = false;
  }

  showDescription(): void {
    this.description.toggle('show-more');
  }

  getAreas() {
    this.areaService.getAreas()
      .subscribe((response: AreaModel[]) => {
        this.areas = response;
        this.filteredAreas = cloneDeep(response);
      });
  }

  getIterations() {
    this.iterationService.getIterations()
      .subscribe((iteration: IterationModel[]) => {
        this.iterations = iteration;
      });
  }

  onChangeState(option: any): void {
    if (this.workItem.relationships.iteration) {
      this.broadcaster.broadcast('wi_change_state', [{
        workItem: this.workItem,
        oldState: this.workItem.attributes['system.state'],
        newState: option
      }]);
      // Item closed for an iteration
      if (this.workItem.attributes['system.state'] !== option && option === 'closed') {
        this.broadcaster.broadcast('wi_change_state_it', [{
          iterationId: this.workItem.relationships.iteration.data.id,
          closedItem: +1
        }]);
      }
      // Item opened for an iteration
      if (this.workItem.attributes['system.state'] == 'closed' && option != 'closes') {
        this.broadcaster.broadcast('wi_change_state_it', [{
          iterationId: this.workItem.relationships.iteration.data.id,
          closedItem: -1
        }]);
      }
    }
    this.workItem.attributes['system.state'] = option;
    let payload = cloneDeep(this.workItemPayload);
    payload.attributes['system.state'] = option;
    this.save(payload);
  }

  // onChangeType(type: any): void {
  //   this.workItem.relationships.baseType = {
  //     data: {
  //       id: type,
  //       type: 'workitemtypes'
  //     }
  //   };
  //   let payload = cloneDeep(this.workItemPayload);
  //   payload['relationships']['baseType'] = {
  //     data: {
  //       id: type,
  //       type: 'workitemtypes'
  //     }
  //   };
  //   this.save(payload);
  // }

  onUpdateDescription(): void {
    this.workItem.attributes['system.description'] = {
      markup: 'Markdown',
      content: this.descText.trim()
    };
    this.showHtml(this.descText.trim());

    let payload = cloneDeep(this.workItemPayload);
    payload.attributes['system.description'] = {
      markup: 'Markdown',
      content: this.descText.trim()
    };
    this.save(payload);
    this.closeDescription();
  }

  onUpdateTitle(): void {
    this.isValid(this.titleText.trim());
    if (this.validTitle) {
      this.workItem.attributes['system.title'] = this.titleText;
      if (this.workItem.id) {
        let payload = cloneDeep(this.workItemPayload);
        payload.attributes['system.title'] = this.titleText;
        this.save(payload);
      } else {
        this.save();
      }
      this.closeHeader();
    }
  }

  save(payload?: WorkItem): void {
    if (this.workItem.id){
      this.workItemService
        .update(payload)
        .switchMap(workItem => {
        return Observable.forkJoin(
          Observable.of(workItem),
          this.workItemService.getWorkItemTypes(),
          this.areaService.getArea(workItem.relationships.area),
          this.iterationService.getIteration(workItem.relationships.iteration),
          this.workItemService.resolveAssignees(workItem.relationships.assignees),
          this.workItemService.resolveCreator2(workItem.relationships.creator),
          this.workItemService.resolveLinks(workItem.links.self + '/relationships/links')
        );
      })
      .subscribe(([workItem, workItemTypes, area, iteration, assignees, creator, [links, includes]]) => {
        // Resolve area
        workItem.relationships.area = {
          data: area
        };

        // Resolve iteration
        workItem.relationships.iteration = {
          data: iteration
        };

        // Resolve work item type
        workItem.relationships.baseType.data =
          workItemTypes.find(type => type.id === workItem.relationships.baseType.data.id) ||
          workItem.relationships.baseType.data;

        // Resolve assignees
        workItem.relationships.assignees = {
          data: assignees
        };

        // Resolve creator
        workItem.relationships.creator = {
          data: creator
        };

        // Resolve links
        workItem = Object.assign(
          workItem,
          {
            relationalData: {
              linkDicts: [],
              totalLinkCount: 0
            }
          }
        );
        links.forEach((link) => {
          this.workItemService.addLinkToWorkItem(link, includes, workItem);
        });

        this.workItem = workItem;
        this.workItemPayload.attributes['version'] = workItem.attributes['version'];
        this.updateOnList();
        this.activeOnList();
      });
    } else {
      if (this.validTitle){
        this.workItemService
        .create(this.workItem)
        .switchMap(workItem => {
          return Observable.forkJoin(
            Observable.of(workItem),
            this.workItemService.getWorkItemTypes(),
            this.workItemService.resolveAssignees(workItem.relationships.assignees),
            this.workItemService.resolveCreator2(workItem.relationships.creator)
          );
        })
        .subscribe(([workItem, workItemTypes, assignees, creator]) => {
          // Resolve work item type
          workItem.relationships.baseType.data =
            workItemTypes.find(type => type.id === workItem.relationships.baseType.data.id) ||
            workItem.relationships.baseType.data;

          // Resolve assignees
          workItem.relationships.assignees = {
            data: assignees
          };

          // Resolve creator
          workItem.relationships.creator = {
            data: creator
          };

          this.addNewItem(workItem);
          this.router.navigateByUrl(trimEnd(this.router.url.split('detail')[0], '/') + '/detail/' + workItem.id, { relativeTo: this.route });
        });
      }
    }
  }

  closeDetails(): void {
    //console.log(this.router.url.split('/')[1]);
    this.panelState = 'out';

    // Wait for the animation to finish
    // From in to out it takes 300 ms
    // So wait for 400 ms
    setTimeout(() => {
      this.router.navigateByUrl(trimEnd(this.router.url.split('detail')[0], '/'));
    }, 400);
  }

  listenToEvents() {
    this.broadcaster.on<string>('logout')
      .subscribe(message => {
        this.loggedIn = false;
        this.loggedInUser = null;
    });
  }

  preventDef(event: any) {
    event.preventDefault();
  }

  lookupIterations() {
    this.searchIteration = !this.searchIteration;
  }

  activeSearchAssignee() {
    if (this.loggedIn) {
      this.closeUserRestFields();
      this.filteredUsers = this.users.length ? this.users : null;
      this.searchAssignee = true;
      // Takes a while to render the component
      setTimeout(() => {
        if (this.userSearch) {
          this.userSearch.nativeElement.focus();
        }
      }, 50);
    }
  }

  deactiveSearchAssignee() {
    this.closeUserRestFields();
  }

  filterUser(event: any) {
    // Down arrow or up arrow
    if (event.keyCode == 40 || event.keyCode == 38) {
      let lis = this.userList.nativeElement.children;
      let i = 0;
      for (; i < lis.length; i++) {
        if (lis[i].classList.contains('selected')) {
          break;
        }
      }
      if (i == lis.length) { // No existing selected
        if (event.keyCode == 40) { // Down arrow
          lis[0].classList.add('selected');
          lis[0].scrollIntoView(false);
        } else { // Up arrow
          lis[lis.length - 1].classList.add('selected');
          lis[lis.length - 1].scrollIntoView(false);
        }
      } else { // Existing selected
        lis[i].classList.remove('selected');
        if (event.keyCode == 40) { // Down arrow
          lis[(i + 1) % lis.length].classList.add('selected');
          lis[(i + 1) % lis.length].scrollIntoView(false);
        } else { // Down arrow
          // In javascript mod gives exact mod for negative value
          // For example, -1 % 6 = -1 but I need, -1 % 6 = 5
          // To get the round positive value I am adding the divisor
          // with the negative dividend
          lis[(((i - 1) % lis.length) + lis.length) % lis.length].classList.add('selected');
          lis[(((i - 1) % lis.length) + lis.length) % lis.length].scrollIntoView(false);
        }
      }
    } else if (event.keyCode == 13) { // Enter key event
      let lis = this.userList.nativeElement.children;
      let i = 0;
      for (; i < lis.length; i++) {
        if (lis[i].classList.contains('selected')) {
          break;
        }
      }
      if (i < lis.length) {
        let selectedId = lis[i].dataset.value;
        this.assignUser(selectedId);
      }
    } else {
      let inp = this.userSearch.nativeElement.value.trim();
      this.filteredUsers = this.users.filter((item) => {
        return item.attributes.fullName.toLowerCase().indexOf(inp.toLowerCase()) > -1;
      });
    }
  }

  assignUser(userId: any): void {
    let payload = cloneDeep(this.workItemPayload);
    payload = Object.assign(payload, {
      relationships : {
        assignees: {
          data: [{
            id: userId,
            type: 'identities'
          }]
        }
      }
    });
    this.save(payload);
    this.searchAssignee = false;
  }

  unassignUser(): void {
    let payload = cloneDeep(this.workItemPayload);
    payload = Object.assign(payload, {
      relationships : {
        assignees: {
          data: []
        }
      }
    });
    this.save(payload);
    this.searchAssignee = false;
  }

  cancelAssignment(): void {
    this.searchAssignee = false;
  }

  closeUserRestFields(): void {
    this.searchAssignee = false;
    this.searchIteration = false;
    if (this.workItem && this.workItem.id != null) {
      this.headerEditable = false;
    }
    this.descEditable = false;
  }

  selectIteration(iteration: any): void {
    this.selectedIteration = iteration;
    this.dropdownButton.nativeElement.innerHTML = this.selectedIteration.attributes.name +
                                                  ' <span class="caret"></span>';
  }

  assignIteration(): void {
    // Send out an iteration change event
    let currenIterationID = this.workItem.relationships.iteration.data ?
      this.workItem.relationships.iteration.data.id : 0;
    this.broadcaster.broadcast('associate_iteration', {
      workItemId: this.workItem.id,
      currentIterationId: currenIterationID,
      futureIterationId: this.selectedIteration.id
    });

    // If already closed iteration
    if (this.workItem.attributes['system.state'] === 'closed') {
      this.broadcaster.broadcast('wi_change_state_it', [{
        iterationId: currenIterationID,
        closedItem: -1
      }, {
        iterationId: this.selectedIteration.id,
        closedItem: +1
      }]);
    }

    let payload = cloneDeep(this.workItemPayload);
    payload = Object.assign(payload, {
      relationships : {
        iteration: {
          data: {
            id: this.selectedIteration.id,
            type: 'iteration'
          }
        }
      }
    });
    this.save(payload);
    this.searchIteration = false;
  }

  closeIteration() {
    this.searchIteration = false;
  }

  activeSearchIteration() {
    if (this.loggedIn) {
      this.closeUserRestFields();
      this.searchIteration = true;
      // Takes a while to render the component
      setTimeout(() => {
        if (this.iterationSearch) {
          this.iterationSearch.nativeElement.focus();
        }
      }, 50);
    }
  }

  deactiveSearchIteration() {
    this.closeUserRestFields();
  }

  //On clicking the area drop down option the selected value needs to get displayed in the input box
  showAreaOnInput(area: AreaModel): void {
    this.areaSearch.nativeElement.value = area.attributes.name;
    this.selectedArea = area;
  }
  //set an area
  setArea(): void {
    let payload = cloneDeep(this.workItemPayload);
    payload = Object.assign(payload, {
      relationships : {
        area: {
          data: {
            id: this.selectedArea.id,
            type: 'area'
          }
        }
      }
    });
    this.save(payload);
    this.searchArea = false;
  }

  closeAreaDropdown(): void {
    this.searchArea = false;
  }

  activeSearchArea() {
    //close the assignees
    this.closeUserRestFields();
    if (this.loggedIn) {
      this.searchArea = true;
      // Takes a while to render the component
      setTimeout(() => {
        if (this.areaSearch) {
          this.areaSearch.nativeElement.focus();
        }
      }, 50);
    }
  }

  deactiveSearchArea() {
    this.closeAreaRestFields();
  }

  closeAreaRestFields(): void {
    this.searchArea = false;
  }

  filterArea(event: any) {
    // Down arrow or up arrow
    if (event.keyCode == 40 || event.keyCode == 38) {
      let lis = this.areaList.nativeElement.children;
      let i = 0;
      for (; i < lis.length; i++) {
        if (lis[i].classList.contains('selected')) {
          break;
        }
      }
      if (i == lis.length) { // No existing selected
        if (event.keyCode == 40) { // Down arrow
          lis[0].classList.add('selected');
          lis[0].scrollIntoView(false);
        } else { // Up arrow
          lis[lis.length - 1].classList.add('selected');
          lis[lis.length - 1].scrollIntoView(false);
        }
      } else { // Existing selected
        lis[i].classList.remove('selected');
        if (event.keyCode == 40) { // Down arrow
          lis[(i + 1) % lis.length].classList.add('selected');
          lis[(i + 1) % lis.length].scrollIntoView(false);
        } else { // Down arrow
          // In javascript mod gives exact mod for negative value
          // For example, -1 % 6 = -1 but I need, -1 % 6 = 5
          // To get the round positive value I am adding the divisor
          // with the negative dividend
          lis[(((i - 1) % lis.length) + lis.length) % lis.length].classList.add('selected');
          lis[(((i - 1) % lis.length) + lis.length) % lis.length].scrollIntoView(false);
        }
      }
    } else if (event.keyCode == 13) { // Enter key event
      let lis = this.areaList.nativeElement.children;
      let i = 0;
      for (; i < lis.length; i++) {
        if (lis[i].classList.contains('selected')) {
          break;
        }
      }
      if (i < lis.length) {
        let selectedId = lis[i].dataset.value;
        this.selectedArea = lis[i];
        this.setArea();
      }
    } else {
      let inp = this.areaSearch.nativeElement.value.trim();
      this.filteredAreas = this.areas.filter((item) => {
         return item.attributes.name.toLowerCase().indexOf(inp.toLowerCase()) > -1;
      });
    }
  }

  showHtml(innerText: string): void {
    this.workItemService.renderMarkDown(innerText)
      .subscribe(renderedHtml => {
        this.renderedDesc = renderedHtml;
        this.descViewType = 'html';
      });
  }

  @HostListener('window:keydown', ['$event'])
  onKeyEvent(event: any) {
    event = (event || window.event);
    // for ESC key handling
    if (event.keyCode == 27) {
      try {
        event.preventDefault(); //Non-IE
      } catch (x){
        event.returnValue = false; //IE
      }
      if (this.descEditable) {
        this.closeDescription();
      } else if (this.headerEditable) {
        this.closeHeader();
      } else if (this.searchAssignee) {
        this.searchAssignee = false;
      } else if (this.searchArea) {
        this.closeAreaRestFields();
    } else {
        this.closeDetails();
      }
    }
  }
}
