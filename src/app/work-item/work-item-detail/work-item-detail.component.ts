import { Observable } from 'rxjs/Observable';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewChildren,
  QueryList
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { Location }               from '@angular/common';
import { Router }                 from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { cloneDeep, trimEnd, merge, remove } from 'lodash';
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
import { WorkItemTypeControlService } from '../work-item-type-control.service';
import { MarkdownControlComponent } from './markdown-control/markdown-control.component';
import { TypeaheadDropdown, TypeaheadDropdownValue } from './typeahead-dropdown/typeahead-dropdown.component';

import { WorkItem, WorkItemRelations } from '../../models/work-item';
import { WorkItemService } from '../work-item.service';
import { WorkItemType } from '../../models/work-item-type';
import { CollaboratorService } from '../../collaborator/collaborator.service'

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
        transform: 'translateX(102%)'
      })),
      transition('in => out', animate('300ms ease-in-out')),
      transition('out => in', animate('500ms ease-in-out'))
    ]),
  ]
})

export class WorkItemDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('title') title: any;
  @ViewChild('userSearch') userSearch: any;
  @ViewChild('userList') userList: any;
  @ViewChild('dropdownButton') dropdownButton: any;
  @ViewChild('areaSelectbox') areaSelectbox: TypeaheadDropdown;
  @ViewChild('iterationSelectbox') iterationSelectbox: TypeaheadDropdown;

  workItem: WorkItem;
  workItemTypes: WorkItemType[];

  showDialog: boolean = false;

  submitted = false;
  active = true;
  loggedIn: Boolean = false;

  headerEditable: Boolean = false;

  validTitle: Boolean = true;
  titleText: any = '';

  descText: any = '';

  searchAssignee: Boolean = false;

  users: User[] = [];
  filteredUsers: User[] = [];

  loggedInUser: User;

  addNewWI: Boolean = false;

  panelState: string = 'out';

  areas: AreaModel[] = [];

  iterations: IterationModel[] = [];

  comments: Comment[] = [];

  spaceSubscription: Subscription;

  workItemPayload: WorkItem;

  eventListeners: any[] = [];

  dynamicFormGroup: FormGroup;
  dynamicFormDataArray: any;
  usersLoaded: Boolean = false;

  saving: Boolean = false;
  queryParams: Object = {};

  itemSubscription: any = null;

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
    private workItemTypeControlService: WorkItemTypeControlService,
    private spaces: Spaces,
    private collaboratorService: CollaboratorService
  ) {}

  ngOnInit(): void {
    this.saving = false;
    this.listenToEvents();
    this.getAreas();
    // this.getAllUsers();
    this.getIterations();
    this.loggedIn = this.auth.isLoggedIn();
    if (this.loggedIn) {
      this.eventListeners.push(
        this.userService.loggedInUser.subscribe(user => {
          this.loggedInUser = user;
        })
      );
    }
    let id = null;
    this.eventListeners.push(
      this.spaces.current.switchMap(space => {
        return this.route.params;
      }).subscribe((params) => {
        if (params['id'] !== undefined) {
          id = params['id'];
          if (id === 'new'){
            //Add a new work item
            this.headerEditable = true;
            let type = this.route.snapshot.queryParams['type'];
            // Create new item with the WI type
            this.createWorkItemObj(type);
            // Open the panel
            if (this.panelState === 'out') {
              this.panelState = 'in';
              setTimeout(() => {
                if (this.headerEditable && typeof(this.title) !== 'undefined') {
                this.title.nativeElement.focus();
              }});
            }
          } else {
            this.loadWorkItem(id);
          }
        }
      })
    );
  }

  ngOnDestroy() {
    console.log('Destroying all the listeners in detail component');
    this.eventListeners.forEach(subscriber => subscriber.unsubscribe());
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
    // setTimeout(() => {
    //   this.panelState = 'in';
    //   if (this.headerEditable) {
    //     this.title.nativeElement.focus();
    //   }
    // });
  }

  loadWorkItem(id: string): void {
    this.itemSubscription =
    this.workItemService.getWorkItemById(id)
      .switchMap(workItem => {
        return Observable.combineLatest(
          Observable.of(workItem),
          this.collaboratorService.getCollaborators(),
          this.workItemService.getWorkItemTypes(),
          this.areaService.getArea(workItem.relationships.area),
          this.iterationService.getIteration(workItem.relationships.iteration),
          this.workItemService.resolveAssignees(workItem.relationships.assignees),
          this.workItemService.resolveCreator2(workItem.relationships.creator),
          this.workItemService.resolveComments(workItem.relationships.comments.links.related),
          this.workItemService.resolveLinks(workItem.links.self + '/relationships/links')
        );
      })
      .subscribe(([workItem, users, workItemTypes, area, iteration, assignees, creator, comments, [links, includes]]) => {

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

        // Resolve comments
        merge(workItem.relationships.comments, comments);
        workItem.relationships.comments.data = workItem.relationships.comments.data.map((comment) => {
          comment.relationships['created-by'].data =
            users.find(user => user.id === comment.relationships['created-by'].data.id);
          return comment;
        });
        this.comments = workItem.relationships.comments.data;

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

        // Open the panel once all the data is ready
        if (this.panelState === 'out') {
          this.panelState = 'in';
          if (this.headerEditable && typeof(this.title) !== 'undefined') {
            this.title.nativeElement.focus();
          }
        }

        // init dynamic form
        this.dynamicFormGroup = this.workItemTypeControlService.toFormGroup(this.workItem);
        this.dynamicFormDataArray = this.workItemTypeControlService.toAttributeArray(this.workItem.relationships.baseType.data.attributes.fields);

        // fetch the list of user
        // after getting the Workitem
        // to set assigned user
        // for this workitem from the list
        // this.getAllUsers();

        this.activeOnList(400);
        // Used with setTimeout for inmemory mode
        // where everything is synchronus
        setTimeout(() => this.itemSubscription.unsubscribe());
      },
      err => {
        console.log(err);
        setTimeout(() => this.itemSubscription.unsubscribe());
        // this.closeDetails();
      });
  }

  createWorkItemObj(type: string) {
    this.workItem = new WorkItem();
    this.workItem.id = null;
    this.workItem.attributes = new Map<string, string | number>();
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
      .subscribe(
        user => {
          this.workItem.relationships = Object.assign(
            this.workItem.relationships,
            {
              creator: {
                data: user
              }
            }
          );
        },
        err => console.log(err)
      );

    this.workItem.relationalData = {};
    this.workItemService.resolveType(this.workItem);
    this.workItem.attributes['system.state'] = 'new';
  }

  getAllUsers(): Observable<any> {
    return Observable.combineLatest(
      this.userService.getUser(),
      this.collaboratorService.getCollaborators()
    )
  }

  activeOnList(timeOut: number = 0) {
    setTimeout(() => {
      this.saving = false;
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

  descOpen(): void {
    if (this.loggedIn) {
      if (this.headerEditable) {
        this.onUpdateTitle();
      }
      this.closeUserRestFields();
    }
  }

  descUpdate(event: any): void {
    this.descText = event;
    this.workItem.attributes['system.description'] = {
      markup: 'Markdown',
      content: this.descText.trim()
    };
    if (this.workItem.id) {
      let payload = cloneDeep(this.workItemPayload);
      payload.attributes['system.description'] = {
        markup: 'Markdown',
        content: this.descText.trim()
      };
      this.save(payload);
    } else {
      this.save();
    }
  }

  // called when a dynamic field is updated.
  dynamicFieldUpdated(event: any) {
    this.workItem.attributes[event.formControlName] = event.newValue;
    if (this.workItem.id) {
      let payload = cloneDeep(this.workItemPayload);
      payload.attributes[event.formControlName] = event.newValue;
      this.save(payload);
    } else {
      this.save();
    }
  }

  closeHeader(): void {
    this.headerEditable = false;
  }

  openHeader(): void {
    if (this.loggedIn) {
      /* TODO: send "close up" to the markdown field
      if (this.descEditable) {
        this.onUpdateDescription();
      }
      */
      this.closeUserRestFields();
      this.headerEditable = true;
      setTimeout(() => {
        if (this.headerEditable && typeof(this.title) !== 'undefined') {
          this.title.nativeElement.focus();
        }
      });
    }
  }

  getAreas() {
    this.areaService.getAreas()
      .subscribe((response: AreaModel[]) => {
        this.areas = response;
        // this.filteredAreas = cloneDeep(response);
      }, err => console.log(err));
  }

  getIterations() {
    this.iterationService.getIterations()
      .subscribe((iteration: IterationModel[]) => {
        this.iterations = iteration;
      }, err => console.log(err));
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
    if(this.workItem.id) {
      let payload = cloneDeep(this.workItemPayload);
      payload.attributes['system.state'] = option;
      this.save(payload);
    }
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

  save(payload?: WorkItem, returnObservable: boolean = false): Observable<WorkItem> {
    let retObservable: Observable<WorkItem>;
    if (this.workItem.id) {
      retObservable = this.workItemService
        .update(payload)
        .switchMap(workItem => {
          return Observable.combineLatest(
            Observable.of(workItem),
            this.collaboratorService.getCollaborators(),
            this.workItemService.getWorkItemTypes(),
            this.areaService.getArea(workItem.relationships.area),
            this.iterationService.getIteration(workItem.relationships.iteration),
            this.workItemService.resolveAssignees(workItem.relationships.assignees),
            this.workItemService.resolveCreator2(workItem.relationships.creator),
            this.workItemService.resolveComments(workItem.relationships.comments.links.related),
            this.workItemService.resolveLinks(workItem.links.self + '/relationships/links')
        );
      })
      .map(([workItem, users, workItemTypes, area, iteration, assignees, creator, comments, [links, includes]]) => {
        // Resolve area
        workItem.relationships.area = {
          data: area
        };

        // Resolve iteration
        if (iteration) {
          workItem.relationships.iteration = {
            data: iteration
          };
        } else {
          workItem.relationships.iteration = { };
        }
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

        // Resolve comments
        merge(workItem.relationships.comments, comments);
        workItem.relationships.comments.data = workItem.relationships.comments.data.map((comment) => {
          comment.relationships['created-by'].data =
            users.find(user => user.id === comment.relationships['created-by'].data.id);
          return comment;
        });
        this.comments = workItem.relationships.comments.data;

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
        return workItem;
      },
        (err) => console.log(err)
      );
    } else {
      if (this.validTitle) {
        this.saving = true;
        retObservable = this.workItemService
        .create(this.workItem)
        .switchMap(workItem => {
          return Observable.forkJoin(
            Observable.of(workItem),
            this.workItemService.getWorkItemTypes(),
            this.workItemService.resolveAssignees(workItem.relationships.assignees),
            this.workItemService.resolveCreator2(workItem.relationships.creator)
          );
        })
        .map(([workItem, workItemTypes, assignees, creator]) => {
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

          let queryParams = cloneDeep(this.queryParams);
          if (Object.keys(queryParams).indexOf('type') > -1) {
            delete queryParams['type'];
          }

          this.router.navigate(
            [this.router.url.split('/detail/')[0] + '/detail/' + workItem.id],
            { queryParams: queryParams } as NavigationExtras
          );
          this.workItemService.emitAddWI(workItem);
          return workItem;
        });
      } else {
        retObservable = Observable.throw('error');
      }
    }
    if (returnObservable) {
      return retObservable;
    } else {
      this.itemSubscription = retObservable.subscribe(() => {
        setTimeout(() => this.itemSubscription.unsubscribe())
      });
    }
  }

  createComment(comment) {
    this.workItemService
        .createComment(this.workItem.relationships.comments.links.related, comment)
        .subscribe((comment) => {
            comment.relationships['created-by'].data = this.loggedInUser;
            this.workItem.relationships.comments.data.splice(0, 0, comment);
            this.workItem.relationships.comments.meta.totalCount += 1;
        },
        (error) => {
            console.log(error);
        });
  }

  updateComment(comment) {
    this.workItemService
        .updateComment(comment)
        .subscribe(response => {
        },
        (error) => {
          console.log(error);
        });
  }

  deleteComment(comment) {
    this.workItemService
        .deleteComment(comment)
        .subscribe(response => {
            if (response.status === 200) {
                remove(this.workItem.relationships.comments.data, cursor => {
                    if (!!comment) {
                        return cursor.id == comment.id;
                    }
                });
            }
        }, err => console.log(err));
  }

  closeDetails(): void {
    //console.log(this.router.url.split('/')[1]);
    this.panelState = 'out';

    // In case detaile wi add, on close type id query param should be removed
    let queryParams = cloneDeep(this.queryParams);
    if (Object.keys(queryParams).indexOf('type') > -1) {
      delete queryParams['type'];
    }

    // Wait for the animation to finish
    // From in to out it takes 300 ms
    // So wait for 400 ms
    setTimeout(() => {
      this.router.navigate(
        [this.router.url.split('/detail/')[0]],
        {queryParams: queryParams}
      );
      this.broadcaster.broadcast('detail_close')
    }, 400);
  }

  listenToEvents() {
    this.eventListeners.push(
      this.broadcaster.on<string>('logout')
        .subscribe(message => {
          this.loggedIn = false;
          this.loggedInUser = null;
      })
    );
    this.eventListeners.push(
      this.route.queryParams.subscribe((params) => {
        this.queryParams = params;
      })
    )
  }

  preventDef(event: any) {
    event.preventDefault();
  }

  activeSearchAssignee() {
    if (this.loggedIn) {
      this.getAllUsers()
      .subscribe(([authUser, allUsers]) => {
        this.users = allUsers;
        this.loggedInUser = authUser;
        this.users = this.users.filter(user => {
          return user.id !== authUser.id;
        });
        this.filteredUsers = this.users;
        this.usersLoaded = true;
      });
      this.closeUserRestFields();
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

  assignUser(user: User): void {
    if(this.workItem.id) {
      let payload = cloneDeep(this.workItemPayload);
      payload = Object.assign(payload, {
        relationships : {
          assignees: {
            data: [{
              id: user.id,
              type: 'identities'
            }]
          }
        }
      });
      this.save(payload);
    } else {
      let assignee = [{
        attributes: {
          fullName: user.attributes.fullName
        },
        id: user.id,
        type: 'identities'
      } as User];
      this.workItem.relationships.assignees = {
        data : assignee
      };
    }
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
    if (this.workItem && this.workItem.id != null) {
      this.headerEditable = false;
    }
    if (this.areaSelectbox && this.areaSelectbox.isOpen()) {
      this.areaSelectbox.close();
    }
    if (this.iterationSelectbox && this.iterationSelectbox.isOpen()) {
      this.iterationSelectbox.close();
    }
  }

  iterationUpdated(iterationId: string): void {
    if (this.workItem.id) {
      // Send out an iteration change event
      let newIteration = iterationId;
      let currenIterationID = this.workItem.relationships.iteration.data ? this.workItem.relationships.iteration.data.id : 0;
      // If already closed iteration
      if (this.workItem.attributes['system.state'] == 'closed') {
        this.broadcaster.broadcast('wi_change_state_it', [{
          iterationId: currenIterationID,
          closedItem: -1
        }, {
          iterationId: newIteration,
          closedItem: +1
        }]);
      }
      let payload = cloneDeep(this.workItemPayload);
      if (newIteration) {
        payload = Object.assign(payload, {
          relationships : {
            iteration: {
              data: {
                id: iterationId,
                type: 'iteration'
              }
            }
          }
        });
      } else {
        payload = Object.assign(payload, {
          relationships : {
            iteration: { }
          }
        });
      }
      this.itemSubscription = this.save(payload, true).subscribe((workItem:WorkItem) => {
        this.logger.log('Iteration has been updated, sending event to iteration panel to refresh counts.');
        this.broadcaster.broadcast('associate_iteration', {
          workItemId: workItem.id,
          currentIterationId: this.workItem.relationships.iteration.data?this.workItem.relationships.iteration.data.id:undefined,
          futureIterationId: workItem.relationships.iteration.data?workItem.relationships.iteration.data.id:undefined
        });
        setTimeout(() => this.itemSubscription.unsubscribe());
      });
    } else {
      //creating a new work item - save the user input
      let iteration = { };
      if (iterationId) {
        iteration = {
          data: {
            attributes: {
              name: this.findIterationById(iterationId).attributes.name
            },
            id: iterationId,
            type: 'iteration'
          }
        }
      }
      this.workItem.relationships.iteration = iteration;
    }
  }

  extractAreaKeyValue(areas: AreaModel[]): TypeaheadDropdownValue[] {
    let result: TypeaheadDropdownValue[] = [];
    let selectedFound: boolean = false;
    let selectedAreaId: string;
    if (this.workItem.relationships.area && this.workItem.relationships.area.data && this.workItem.relationships.area.data.id) {
      selectedAreaId = this.workItem.relationships.area.data.id;
    }
    for (let i=0; i<areas.length; i++) {
      result.push({
        key: areas[i].id,
        value: (areas[i].attributes.parent_path_resolved!='/'?areas[i].attributes.parent_path_resolved:'') + '/' + areas[i].attributes.name,
        selected: selectedAreaId===areas[i].id?true:false,
        cssLabelClass: undefined
      });
      if (selectedAreaId===areas[i].id)
        selectedFound = true;
    };
    return result;
  }

  findAreaById(areaId: string): AreaModel {
    for (let i=0; i<this.areas.length; i++)
      if (this.areas[i].id === areaId)
        return this.areas[i];
    return null;
  }

  extractIterationKeyValue(iterations: IterationModel[]): TypeaheadDropdownValue[] {
    let result: TypeaheadDropdownValue[] = [];
    let selectedFound: boolean = false;
    let selectedIterationId;
    if (this.workItem.relationships.iteration && this.workItem.relationships.iteration.data && this.workItem.relationships.iteration.data.id) {
      selectedIterationId = this.workItem.relationships.iteration.data.id;
    }
    for (let i=0; i<iterations.length; i++) {
      result.push({
        key: iterations[i].id,
        value: (iterations[i].attributes.resolved_parent_path!='/'?iterations[i].attributes.resolved_parent_path:'') + '/' + iterations[i].attributes.name,
        selected: selectedIterationId===iterations[i].id?true:false,
        cssLabelClass: undefined
      });
      if (selectedIterationId===iterations[i].id)
        selectedFound = true;
    };
    return result;
  }

  findIterationById(iterationId: string): IterationModel {
    for (let i=0; i<this.iterations.length; i++)
      if (this.iterations[i].id === iterationId)
        return this.iterations[i];
    return null;
  }

  focusArea() {
    this.iterationSelectbox.close();
    this.cancelAssignment();
  }

  focusIteration() {
    this.areaSelectbox.close();
    this.cancelAssignment();
  }

  areaUpdated(areaId: string) {

    if (this.workItem.id) {
      let payload = cloneDeep(this.workItemPayload);
      if (areaId) {
        // area was set to a value.
        payload = Object.assign(payload, {
          relationships : {
            area: {
              data: {
                id: areaId,
                type: 'area'
              }
            }
          }
        });
      } else {
        // area was unset.
        payload = Object.assign(payload, {
          relationships : {
            area: { }
          }
        });
      }
      this.save(payload);
    } else {
      let area = { };
      if (areaId) {
        // area was set to a value.
        let area = {
          data: {
            attributes: {
              name: this.findAreaById(areaId).attributes.name,
            },
            id: areaId,
            type: 'area'
          }
        };
      };
      this.workItem.relationships.area = area;
    }
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
      if (this.headerEditable) {
        this.closeHeader();
      } else if (this.searchAssignee) {
        this.searchAssignee = false;
      } else if (this.areaSelectbox.isOpen()) {
        this.areaSelectbox.close();
      } else if (this.iterationSelectbox.isOpen()) {
        this.iterationSelectbox.close();
    } else {
        this.closeDetails();
      }
    }
  }
}
