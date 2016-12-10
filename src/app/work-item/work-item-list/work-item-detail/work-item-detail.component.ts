import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { Router }                 from '@angular/router';
import { cloneDeep } from 'lodash';

import { AuthenticationService } from '../../../auth/authentication.service';
import { Broadcaster } from '../../../shared/broadcaster.service';
import { Logger } from '../../../shared/logger.service';
import { UserService } from '../../../user/user.service';

import { WorkItem } from '../../../models/work-item';
import { WorkItemService } from '../../work-item.service';
import { WorkItemType } from '../../work-item-type';

@Component({
  selector: 'alm-work-item-detail',
  templateUrl: './work-item-detail.component.html',
  styleUrls: ['./work-item-detail.component.scss'],
})

export class WorkItemDetailComponent implements OnInit {
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

  users: any[] = [];
  filteredUsers: any[] = [];

  assignedUser: any;
  loggedInUser: any;

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
    this.listenToEvents();
    this.getWorkItemTypesandStates();
    this.loggedIn = this.auth.isLoggedIn();
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        let id = params['id'];
        this.workItemService.getWorkItem(id)
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
          .catch (err => this.closeDetails());
      }
    });
  }

  getAllUsers() {
    this.userService.getAllUsers()
      .then((users) => {
        this.users = cloneDeep(users);
        this.filteredUsers = cloneDeep(users);
        // setting user details of loggedIn User
        if (this.auth.isLoggedIn()) {
          this.userService
            .getUser()
            .then(user => this.setLoggedInUser(user));
        }
        // setting assigned User
        if (this.workItem.relationships.assignee.hasOwnProperty('data')) {
          this.assignedUser = this.getAssignedUserDetails(
            this.workItem.relationships.assignee.data.id
          );
        } else {
          this.assignedUser = null;
        }
      });
  }

  setLoggedInUser(authUser: any) {
    for (let i = 0; i < this.users.length; i++) {
      // This check needs to be updated by ID 
      // once we have the new user format
      // on getting loggedIn user i.e. /user endpoint
      if (this.users[i].attributes.imageURL == authUser.imageURL) {
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
    this.workItemService
      .update(this.workItem)
      .then((workItem) => {
        this.workItem.attributes['version'] = workItem.attributes['version'];
        this.activeOnList();          
    });
     
  }

  closeDetails(): void {
    this.router.navigate(['/work-item-list']);
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
    this.workItem.relationships.assignee = {
      data: {
        id: userId,
        type: 'identities'
      }
    };
    this.save();
    this.assignedUser = this.getAssignedUserDetails(userId);
    this.searchAssignee = false;
  }

  unassignUser(): void {
    this.workItem.relationships.assignee = {
      data: null
    };
    this.assignedUser = null;
    this.save();
    this.searchAssignee = false;
  }

  cancelAssignment(): void {
    this.searchAssignee = false;
  }

  getAssignedUserDetails(userId: any): string {
    let user: any = null;
    if (this.loggedInUser && this.loggedInUser.id == userId) {
      user = this.loggedInUser;
    } else {
      user = this.users.find((item) => item.id == userId);
    }
    return user ? user.attributes : null;
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