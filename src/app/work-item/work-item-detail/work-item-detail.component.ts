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
import { cloneDeep } from 'lodash';

import { AuthenticationService } from './../../auth/authentication.service';
import { Broadcaster } from './../../shared/broadcaster.service';
import { Logger } from './../../shared/logger.service';
import { UserService } from './../../user/user.service';

import { WorkItem, WorkItemAttributes, WorkItemRelations } from './../../models/work-item';
import { WorkItemService } from './../work-item.service';
import { WorkItemType } from './../work-item-type';

import { User } from './../../models/user';

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

  workItem: WorkItem;
  workItemTypes: WorkItemType[];
  // TODO: These should be read from the WorkitemType of the given Workitem
  workItemStates: Object[];

  showDialog: boolean = false;

  submitted = false;
  active = true;
  loggedIn: Boolean = false;

  headerEditable: Boolean = false;
  descEditable: Boolean = false;

  validTitle: Boolean = true;
  titleText: any = '';
  descText: any = '';

  searchAssignee: Boolean = false;

  users: User[] = [];
  filteredUsers: User[] = [];

  loggedInUser: any;

  addNewWI: Boolean = false;

  panelState: string = 'out';

  constructor(
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private workItemService: WorkItemService,
    private route: ActivatedRoute,
    private location: Location,
    private logger: Logger,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void{
    // console.log('ALL USER DATA', this.route.snapshot.data['allusers']);
    // console.log('AUTH USER DATA', this.route.snapshot.data['authuser']);
    this.listenToEvents();
    this.getWorkItemTypesandStates();
    this.loggedIn = this.auth.isLoggedIn();
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        let id = params['id'];
        if (id.indexOf('new') >= 0){
          //Add a new work item
          this.addNewWI = true;
          this.headerEditable = true;
          let type = id.substring((id.indexOf('?') + 1), id.length);
          this.createWorkItemObj(type);
          this.getAllUsers();
        }else{
          this.addNewWI = false;
          this.workItemService.getWorkItemById(id)
            .then(workItem => {
              this.closeRestFields();
              this.titleText = workItem.attributes['system.title'];
              this.descText = workItem.attributes['system.description'];
              this.workItem = workItem;
              // fetch the list of user
              // after getting the Workitem
              // to set assigned user
              // for this workitem from the list
              this.getAllUsers();
              this.activeOnList(400);
            })
            .catch (err => {
              this.closeDetails()
            });
        }
      }
    });
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
    setTimeout(() => this.panelState = 'in');
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

    this.workItem.attributes = {
      'system.state': 'new'
    } as WorkItemAttributes;
  }

  getAllUsers() {
    this.users = cloneDeep(this.route.snapshot.data['allusers']) as User[];
    this.filteredUsers = cloneDeep(this.route.snapshot.data['allusers']) as User[];
    let authUser = cloneDeep(this.route.snapshot.data['authuser']);
    this.setLoggedInUser(authUser);
    console.log("this.users = " + JSON.stringify(this.users));
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
      this.closeRestFields();
      this.headerEditable = true;
    }
  }

  openDescription(): void {
    if (this.loggedIn) {
      if (this.headerEditable) {
        this.onUpdateTitle();
      }
      this.closeRestFields();
      this.descEditable = true;
    }
  }

  closeDescription(): void {
    this.description.nativeElement.innerHTML =
    this.workItem.attributes['system.description'];
    this.descEditable = false;
  }

  getWorkItemTypesandStates(): void {
    this.workItemService.getWorkItemTypes()
      .then((types) => {
        this.workItemTypes = types;
      })
      .then(() => {
        this.workItemService.getStatusOptions()
          .then((options) => {
            this.workItemStates = options;
        });
      });
  }

  onChangeState(option: any): void {
    this.workItem.attributes['system.state'] = option;
    this.save();
  }

  onChangeType(type: any): void {
    this.workItem.relationships.baseType = {
      data: {
        id: type,
        type: 'workitemtypes'
      }
    };
    this.save();
  }

  onUpdateDescription(): void {
    this.workItem.attributes['system.description'] = this.descText.trim();
    this.save();
    this.closeDescription();
  }

  onUpdateTitle(): void {
    this.isValid(this.titleText.trim());
    if (this.validTitle) {
      this.workItem.attributes['system.title'] = this.titleText;
      this.save();
      this.closeHeader();
    }
  }

  save(): void {
    if (this.workItem.id){
      this.workItemService
        .update(this.workItem)
        .then((workItem) => {
          this.workItem.attributes['version'] = workItem.attributes['version'];
          this.activeOnList();
      });
    } else {
      if (this.validTitle){
        this.workItemService
        .create(this.workItem)
        .then((workItem) => {
          this.router.navigate(['/work-item/list/detail/' + workItem.id]);
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
      this.router.navigate(['/' +
        this.router.url.split('/')[1] +
        '/' +
        this.router.url.split('/')[2]]
      );
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

  activeSearchAssignee() {
    if (this.loggedIn) {
      this.closeRestFields();
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
    this.closeRestFields();
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
    this.workItem.relationships.assignees = {
      data: [{
        id: userId,
        type: 'identities'
      }]
    };
    this.workItemService.resolveUsersForWorkItem(this.workItem);
    this.save();
    this.searchAssignee = false;
  }

  unassignUser(): void {
    this.workItem.relationships.assignees = {
      data: []
    };
    this.save();
    this.workItemService.resolveUsersForWorkItem(this.workItem);
    this.searchAssignee = false;
  }

  cancelAssignment(): void {
    this.searchAssignee = false;
  }

  closeRestFields(): void {
    this.searchAssignee = false;
    this.headerEditable = false;
    this.descEditable = false;
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
      } else {
        this.closeDetails();
      }
    }
  }
}
