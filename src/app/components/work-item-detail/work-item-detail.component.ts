import { Observable } from 'rxjs/Observable';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  OnDestroy,
  Output,
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
import { AreaService } from '../../services/area.service';
import { Comment } from './../../models/comment';
import { IterationModel } from '../../models/iteration.model';
import { IterationService } from '../../services/iteration.service';
import { LabelSelectorComponent } from './../label-selector/label-selector.component';
import { WorkItemTypeControlService } from '../../services/work-item-type-control.service';
import { MarkdownControlComponent } from '../markdown-control/markdown-control.component';
import { TypeaheadDropdown, TypeaheadDropdownValue } from '../typeahead-dropdown/typeahead-dropdown.component';

import { WorkItem, WorkItemRelations } from '../../models/work-item';
import { WorkItemService } from '../../services/work-item.service';
import { WorkItemDataService } from './../../services/work-item-data.service';
import { WorkItemType } from '../../models/work-item-type';
import { CollaboratorService } from '../../services/collaborator.service';
import { LabelService } from '../../services/label.service';
import { LabelModel } from '../../models/label.model';
import { AssigneeSelectorComponent } from './../assignee-selector/assignee-selector.component';

import {
  SelectDropdownComponent
} from './../../widgets/select-dropdown/select-dropdown.component';

//ngrx stuff
import { Store } from '@ngrx/store';
import { AppState } from './../../states/app.state';
import * as CommentActions from './../../actions/comment.actions';

@Component({
  selector: 'work-item-preview',
  templateUrl: './work-item-detail.component.html',
  styleUrls: ['./work-item-detail.component.less'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(0)',
        left: 'auto'
      })),
      state('out', style({
        transform: 'translateX(100%)',
        left: '100%'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})

export class WorkItemDetailComponent implements OnInit, OnDestroy {

  @ViewChild('title') title: any;
  @ViewChild('userList') userList: any;
  @ViewChild('dropdownButton') dropdownButton: any;
  @ViewChild('areaSelectbox') areaSelectbox: TypeaheadDropdown;
  @ViewChild('iterationSelectbox') iterationSelectbox: TypeaheadDropdown;
  @ViewChild('labelSelector') labelSelector: LabelSelectorComponent;
  @ViewChild('assignee') assignee : any;
  @ViewChild('labelname') labelnameInput: ElementRef;
  @ViewChild('dropdown') dropdownRef: SelectDropdownComponent;
  @ViewChild('AssigneeSelector') AssigneeSelector: AssigneeSelectorComponent;
  @Input() selectedLabels: LabelModel[] = [];
  @Input() selectedAssignees: User[] = [];

  @Output() onOpenSelector: EventEmitter<any> = new EventEmitter();
  @Output() onCloseSelector: EventEmitter<LabelModel[]> = new EventEmitter();

  workItem: WorkItem;
  workItemRef: WorkItem;
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

  loggedInUser: User;

  addNewWI: Boolean = false;

  panelState: string = 'out';

  areas: TypeaheadDropdownValue[] = [];

  iterations: TypeaheadDropdownValue[] = [];

  comments: Comment[] = [];

  spaceSubscription: Subscription;

  workItemPayload: WorkItem;

  eventListeners: any[] = [];

  dynamicFormGroup: FormGroup;
  dynamicFormDataArray: any;

  saving: Boolean = false;
  savingError: Boolean = false;
  errorMessage: String = '';
  queryParams: Object = {};

  itemSubscription: any = null;

  loadingComments: boolean = true;
  loadingTypes: boolean = false;
  loadingIteration: boolean = false;
  loadingArea: boolean = false;
  loadingLabels: boolean = false;
  loadingAssignees: boolean = false;
  labels: LabelModel[] = [];

  private activeAddAssignee: boolean = false;
  private searchValue: string = '';

  constructor(
    private areaService: AreaService,
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private labelService: LabelService,
    private workItemService: WorkItemService,
    private workItemDataService: WorkItemDataService,
    private route: ActivatedRoute,
    private location: Location,
    private logger: Logger,
    private router: Router,
    private iterationService: IterationService,
    private userService: UserService,
    private workItemTypeControlService: WorkItemTypeControlService,
    private spaces: Spaces,
    private collaboratorService: CollaboratorService,
    private store: Store<AppState>
  ) {}

  @HostListener('document:click', ['$event.target','$event.target.classList.contains('+'"assigned_user"'+')'])
  public onClick(targetElement,assigned_user) {
    if (this.assignee) {
      const clickedInsidePopup = this.assignee.nativeElement.contains(targetElement);
      if (!clickedInsidePopup&&!assigned_user) {
          this.cancelAssignment();
      }
    }
  }

  ngOnInit(): void {
    this.saving = false;
    this.loggedIn = this.auth.isLoggedIn();
    this.listenToEvents();
  }

  ngOnDestroy() {
    console.log('Destroying all the listeners in detail component');
    this.eventListeners.forEach(subscriber => subscriber.unsubscribe());
  }

  openPreview(workitem: WorkItem) {
    if (!workitem) return;
    this.workItemRef = workitem;
    this.loadWorkItem(workitem.id);
  }

  closePreview() {
    this.panelState = 'out';
    this.eventListeners.forEach(subscriber => subscriber.unsubscribe());
    setTimeout(() => {
      this.workItem = null;
    }, 400);
  }

  loadWorkItem(id: string): void {
    const t1 = performance.now();
    this.eventListeners.push(
      this.workItemDataService.getItem(id)
        .do(workItem => {
          if (workItem) {
            this.workItem = cloneDeep(workItem);
            this.store.dispatch(new CommentActions.Get(this.workItem.relationships.comments.links.related))
            this.titleText = this.workItem.attributes['system.title'];
            this.descText = this.workItem.attributes['system.description'] || '';
            // Open the panel once work item is ready
            const t2 = performance.now();
            if (this.panelState === 'out') {
              this.panelState = 'in';
              console.log('Performance :: Details page first paint (local data) - '  + (t2 - t1) + ' milliseconds.');
              if (this.headerEditable && typeof(this.title) !== 'undefined') {
                this.title.nativeElement.focus();
              }
            }
          }
        })
        .do (() => {
          this.loadingComments = true;
          this.loadingTypes = true;
          this.loadingIteration = true;
          this.loadingArea = true;
          this.loadingLabels = true;
          this.loadingAssignees = true;
        })
        .switchMap(() => this.workItemService.getWorkItemByNumber(id))
        .do(workItem => {
          this.workItem = workItem;
          this.workItemDataService.setItem(workItem);
          this.titleText = this.workItem.attributes['system.title'];
          this.descText = this.workItem.attributes['system.description'] || '';
          // Open the panel once work item is ready
          const t2 = performance.now();
          if (this.panelState === 'out') {
            this.panelState = 'in';
            console.log('Performance :: Details page first paint - '  + (t2 - t1) + ' milliseconds.');
            if (this.headerEditable && typeof(this.title) !== 'undefined') {
              this.title.nativeElement.focus();
            }
          }
        })
        .do (workItem => console.log('Work item fethced: ', cloneDeep(workItem)))
        .take(1)
        .switchMap(() => {
          return Observable.combineLatest(
            this.resolveWITypes(),
            this.resolveAssignees(),
            this.resolveCreators(),
            this.resolveArea(),
            this.resolveIteration(),
            this.resolveLinks(),
            this.resolveComments(),
            this.resolveLabels()
          )
        })
        .subscribe(() => {
          this.closeUserRestFields();

          this.workItemPayload = {
            id: this.workItem.id,
            number: this.workItem.number,
            attributes: {
              version: this.workItem.attributes['version']
            },
            links: {
              self: this.workItem.links.self
            },
            type: this.workItem.type
          };

          // init dynamic form
          if (this.workItem.relationships.baseType.data.attributes) {
            // this.dynamicFormGroup = this.workItemTypeControlService.toFormGroup(this.workItem);
            this.dynamicFormDataArray = this.workItemTypeControlService.toAttributeArray(this.workItem.relationships.baseType.data.attributes.fields);
          }
        },
        err => {
          //console.log(err);
          //setTimeout(() => this.itemSubscription.unsubscribe());
          // this.closeDetails();
        })
      );
  }

  resolveWITypes(): Observable<any> {
    return this.workItemService.getWorkItemTypes()
      .do(workItemTypes => {
        // Resolve work item type
        this.workItem.relationships.baseType.data =
          workItemTypes.find(type => type.id === this.workItem.relationships.baseType.data.id) ||
          this.workItem.relationships.baseType.data;
        this.loadingTypes = false;
      })
  }

  resolveAssignees(): Observable<any> {
    return this.workItemService.resolveAssignees(this.workItem.relationships.assignees)
      .do(assignees => {
        // Resolve assignees
        this.workItem.relationships.assignees = {
          data: assignees
        };
        this.loadingAssignees = false;
      })
  }

  resolveCreators(): Observable<any> {
    return this.workItemService.resolveCreator2(this.workItem.relationships.creator)
      .do(creator => {
        // Resolve creator
        this.workItem.relationships.creator = {
          data: creator
        };
      })
  }

  resolveArea(): Observable<any> {
    return this.areaService.getArea(this.workItem.relationships.area)
      .do(area => {
        // Resolve area
        this.workItem.relationships.area = {
          data: area
        };
        this.areas = this.extractAreaKeyValue([area]);
        this.loadingArea = false;
      })
  }

  resolveIteration(): Observable<any> {
    return this.iterationService.getIteration(this.workItem.relationships.iteration)
      .do(iteration => {
        // Resolve iteration
        this.workItem.relationships.iteration = {
          data: iteration
        };
        this.iterations = this.extractIterationKeyValue([iteration]);
        this.loadingIteration = false;
      })
  }

  resolveLinks(): Observable<any> {
    return this.workItemService.resolveLinks(this.workItem.links.self + '/relationships/links')
      .do(([links, includes]) => {
        // Resolve links
        this.workItem = Object.assign(
          this.workItem,
          {
            relationalData: {
              linkDicts: [],
              totalLinkCount: 0
            }
          }
        );
        links.forEach((link) => {
          this.workItemService.addLinkToWorkItem(link, includes, this.workItem);
        });
      })
  }

  resolveComments(): Observable<any> {
    return this.workItemService.resolveComments(this.workItem.relationships.comments.links.related)
      .do(comments => {
        // Resolve comments
        merge(this.workItem.relationships.comments, comments);
        this.workItem.relationships.comments.data.forEach((comment, index) => {
          this.workItemService.resolveCommentCreator(comment.relationships['created-by'])
            .subscribe(creator => {
              comment.relationships['created-by'] = {
                data: creator
              };
            });
        });
        this.comments = this.workItem.relationships.comments.data;
        this.loadingComments = false;
      })
  }

  resolveLabels(): Observable<any> {
    return this.labelService.getLabels()
      .do(labels => {
        this.loadingLabels = false;
        this.labels = cloneDeep(labels);
        if (this.workItem.relationships.labels.data) {
          this.workItem.relationships.labels.data =
          this.workItem.relationships.labels.data.map(label => {
            return this.labels.find(l => l.id === label.id);
          });
          // Sort labels in alphabetical order
          this.workItem.relationships.labels.data =
          this.workItem.relationships.labels.data.sort(function(labelA, labelB) {
            let labelAName = labelA.attributes.name.toUpperCase();
            let labelBName = labelB.attributes.name.toUpperCase();
            return labelAName.localeCompare(labelBName);
          });
        } else {
          this.workItem.relationships.labels = {
            data: []
          }
        }
      })
  }

  createWorkItemObj(type: string) {
    this.workItem = new WorkItem();
    this.workItem.id = null;
    this.workItem.attributes = new Map<string, string | number>();
    this.workItem.attributes['system.description'] = '';
    this.workItem.attributes['system.description.rendered'] = '';
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

  updateOnList() {
    this.workItemService.emitEditWI(this.workItem);
  }

  descUpdate(event: any): void {
    const rawText = event.rawText;
    const callBack = event.callBack;
    this.descText = rawText;
    this.workItem.attributes['system.description'] = this.descText.trim();
    this.workItem.attributes['system.description.markup'] = 'Markdown';
    if (this.workItem.id) {
      let payload = cloneDeep(this.workItemPayload);
      payload.attributes['system.description'] = this.descText.trim();
      payload.attributes['system.description.markup'] = 'Markdown';
      this.save(payload, true)
        .subscribe(workItem => {
          callBack(
            workItem.attributes['system.description'],
            workItem.attributes['system.description.rendered']
          )
          this.workItem.attributes['system.description.rendered'] =
          workItem.attributes['system.description.rendered'];
          this.workItem.attributes['system.description'] =
          workItem.attributes['system.description'];

          // TODO: List update hack. should go away
          this.workItemRef.attributes['system.description.rendered'] =
          workItem.attributes['system.description.rendered'];
          this.workItemRef.attributes['system.description'] =
          workItem.attributes['system.description'];

          this.updateOnList();
        })
    } else {
      this.save();
    }
  }

  showPreview(event: any): void {
    const rawText = event.rawText;
    const callBack = event.callBack;
    this.workItemService.renderMarkDown(rawText)
      .subscribe(renderedHtml => {
        callBack(
          rawText,
          renderedHtml
        );
      })
  }

  // called when a dynamic field is updated.
  dynamicFieldUpdated(event: any) {
    this.workItem.attributes[event.formControlName] = event.newValue;
    if (this.workItem.id) {
      let payload = cloneDeep(this.workItemPayload);
      payload.attributes[event.formControlName] = event.newValue;
      this.save(payload, true)
        .subscribe(workItem => {
          this.workItem.attributes[event.formControlName] =
          workItem.attributes[event.formControlName];

          // TODO: List update hack. should go away
          this.workItemRef.attributes[event.formControlName] =
          workItem.attributes[event.formControlName];

          this.updateOnList();
        });
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
        this.areas = this.extractAreaKeyValue(response);
      }, err => console.log(err));
  }

  getIterations() {
    this.iterationService.getIterations()
      .subscribe((iteration: IterationModel[]) => {
        this.iterations = this.extractIterationKeyValue(iteration);
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
      this.save(payload, true)
      .subscribe(
        workItem => {
          this.workItem.attributes['system.state'] = workItem.attributes['system.state'];

          // TODO : List update hack, should go away
          this.workItemRef.attributes['system.state'] = workItem.attributes['system.state'];

          this.updateOnList();
        });
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

  saveTitle(event: any) {
    const value = event.value.trim();
    const callBack = event.callBack;
    if (value === '') {
      callBack(value, 'Empty title not allowed');
    } else if (this.workItem.attributes['system.title'] === value) {
      callBack(value);
    } else {
      this.workItem.attributes['system.title'] = value;
      let payload = cloneDeep(this.workItemPayload);
      payload.attributes['system.title'] = value;
      this.save(payload, true)
        .subscribe((workItem: WorkItem) => {
          this.workItem.attributes['system.title'] = workItem.attributes['system.title'];
          callBack(value);

          // TODO: List update hack. should go away
          this.workItemRef.attributes['system.title'] = workItem.attributes['system.title'];

          this.updateOnList();
      });
    }
  }

  updateLabels(selectedLabels: LabelModel[]) {
    console.log('labels in WI detail >>>>', selectedLabels);
    if(this.workItem.id) {
      this.loadingLabels = true;
      let payload = cloneDeep(this.workItemPayload);
      payload = Object.assign(payload, {
        relationships : {
          labels: {
            data: selectedLabels.map(label => {
              return {
                id: label.id,
                type: label.type
              }
            })
          }
        }
      });
      this.save(payload, true)
        .subscribe(workItem => {
          this.loadingLabels = false;
          // Sort labels in alphabetical order
          selectedLabels = selectedLabels.sort(function(labelA, labelB) {
            let labelAName = labelA.attributes.name.toUpperCase();
            let labelBName = labelB.attributes.name.toUpperCase();
            return labelAName.localeCompare(labelBName);
          });
          this.workItem.relationships.labels = {
            data: selectedLabels
          };

          // TODO: List update hack. should go away
          this.workItemRef.relationships.labels = {
            data: selectedLabels
          };

          this.updateOnList();
        })
    } else {
      this.workItem.relationships.labels = {
        data : selectedLabels
      };
    }
  }

  save(payload?: WorkItem, returnObservable: boolean = false): Observable<WorkItem> {
    let retObservable: Observable<WorkItem>;
    if (this.workItem.id) {
      retObservable = this.workItemService
        .update(payload)
        .do(workItem => {
          this.workItemPayload.attributes['version'] =
          this.workItem.attributes['version'] =
          workItem.attributes['version'];
        })
        .take(1)
        .catch((error: Error | any) => {
          this.savingError = true;
          this.errorMessage = 'Something went wrong. Try again.'
          if (error && error.status && error.statusText) {
            this.errorMessage = error.status + ' : ' + error.statusText+ '. Try again.';
          }
          return Observable.throw(error);
        });
    } else {
      const t1 = performance.now();
      if (this.validTitle) {
        this.saving = true;
        this.savingError = false;
        retObservable = this.workItemService
        .create(this.workItem)
        .do(workItem => {
          let queryParams = cloneDeep(this.queryParams);
          if (Object.keys(queryParams).indexOf('type') > -1) {
            delete queryParams['type'];
          }
          this.router.navigate(
            [this.router.url.split('/detail/')[0] + '/detail/' + workItem.id],
            { queryParams: queryParams } as NavigationExtras
          );
          this.workItemService.emitAddWI(workItem);
          this.saving = false;
          const t2 = performance.now();
          console.log('Performance :: Detail add work item - '  + (t2 - t1) + ' milliseconds.');
        })
        .catch((error: Error | any) => {
          this.saving = false;
          this.savingError = true;
          this.errorMessage = 'Something went wrong. Try again.'
          if (error && error.status && error.statusText) {
            this.errorMessage = error.status + ' : ' + error.statusText+ '. Try again.';
          }
          return Observable.throw(error);
        });
      }
    }
    if (returnObservable) {
      return retObservable;
    } else {
      retObservable.subscribe();
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
    // Nothing required here
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

  removeLable(event) {
    let labels = cloneDeep(this.workItem.relationships.labels.data);
    let index = labels.indexOf(labels.find(l => l.id === event.id));
    if(index > -1) {
      labels.splice(index, 1);
      this.updateLabels(labels);
    }
  }

  closeDetails(): void {

  }

  listenToEvents() {
    this.eventListeners.push(
      this.broadcaster.on<string>('logout')
        .subscribe(message => {
          this.loggedIn = false;
          this.loggedInUser = null;
      })
    );
    if (this.loggedIn) {
      this.eventListeners.push(
        this.userService.loggedInUser.subscribe(user => {
          this.loggedInUser = user;
        })
      );
    }
    let id = null;
    this.eventListeners.push(
      this.spaces.current.subscribe(space => {
        this.closePreview();
      })
    );
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
      });
      this.closeUserRestFields();
      this.searchAssignee = true;
    }
  }

  assignUser(users: User[]): void {
    this.loadingAssignees = true;
    this.closeUserRestFields();
    if(this.workItem.id) {
      this.selectedAssignees = users;

      let payload = cloneDeep(this.workItemPayload);
      payload = Object.assign(payload, {
        relationships : {
          assignees: {
            data: this.selectedAssignees.map(assignee => {
              return {
                id: assignee.id,
                type: 'identities'
              }
            })
          }
        }
      });
      this.save(payload, true)
        .switchMap(workItem => this.workItemService.resolveAssignees(workItem.relationships.assignees))
        .subscribe(assignees => {
          this.loadingAssignees = false;
          this.workItem.relationships.assignees = {
            data: assignees
          };

          // TODO: List update hack. should go away
          this.workItemRef.relationships.assignees = {
            data: assignees
          };
          this.updateOnList();
        })
    } else {
      let assignees = users.map(user => {
        return {
          attributes: {
            fullName: user.attributes.fullName
          },
          id: user.id,
          type: 'identities'
        } as User;
      });
      this.workItem.relationships.assignees = {
        data : assignees
      };
    }
    //this.searchAssignee = false;
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
    if (iterationId === '0') return; // Loading item
    this.loadingIteration = true;
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
      this.save(payload, true).subscribe((workItem: WorkItem) => {
        this.loadingIteration = false;
        this.iterations.forEach(it => it.selected = it.key === iterationId);
        this.workItem.relationships.iteration = workItem.relationships.iteration;

        // TODO: List update hack. should go away
        this.workItemRef.relationships.iteration = workItem.relationships.iteration;

        this.updateOnList();
        this.logger.log('Iteration has been updated, sending event to iteration panel to refresh counts.');
        this.broadcaster.broadcast('associate_iteration', {
          workItemId: workItem.id,
          currentIterationId: this.workItem.relationships.iteration.data?this.workItem.relationships.iteration.data.id:undefined,
          futureIterationId: workItem.relationships.iteration.data?workItem.relationships.iteration.data.id:undefined
        });
      });
    } else {
      //creating a new work item - save the user input
      let iteration = { };
      if (iterationId) {
        iteration = {
          data: {
            // Why do we need attribute for the relationship
            // attributes: {
            //   name: this.findIterationById(iterationId).attributes.name
            // },
            id: iterationId,
            type: 'iteration'
          }
        }
      }
      // Need setTimeout for typeahead drop down't change detection to work
      setTimeout(() => {
        this.loadingIteration = false;
        this.iterations.forEach(it => it.selected = it.key === iterationId);
        this.workItem.relationships.iteration = iteration;
      });
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

  // findIterationById(iterationId: string): IterationModel {
  //   for (let i=0; i<this.iterations.length; i++)
  //     if (this.iterations[i].id === iterationId)
  //       return this.iterations[i];
  //   return null;
  // }

  focusArea() {
    this.iterationSelectbox.close();
    this.cancelAssignment();
    this.areas = [
      ...this.areas,
      {
        key: '0',
        value: '',
        selected: false,
        cssLabelClass: 'spinner spinner-sm spinner-inline'
      }
    ];
    this.getAreas();
  }

  focusIteration() {
    this.areaSelectbox.close();
    this.cancelAssignment();
    this.iterations = [
      ...this.iterations,
      {
        key: '0',
        value: '',
        selected: false,
        cssLabelClass: 'spinner spinner-sm spinner-inline'
      }
    ];
    this.getIterations();
  }

  areaUpdated(areaId: string) {
    this.loadingArea = true;
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
      this.save(payload, true)
        .subscribe((workItem: WorkItem) => {
          this.loadingArea = false;
          this.areas.forEach(area => area.selected = area.key === areaId);
          this.workItem.relationships.area = workItem.relationships.area;

          // TODO: List update hack. should go away
          this.workItemRef.relationships.area = workItem.relationships.area;

          this.updateOnList();
      });
    } else {
      let area = { };
      if (areaId) {
        // area was set to a value.
        let area = {
          data: {
            id: areaId,
            type: 'area'
          }
        };
      };
      // Need setTimeout for typeahead drop down't change detection to work
      setTimeout(() => {
        this.loadingArea = false;
        this.areas.forEach(area => area.selected = area.key === areaId);
        this.workItem.relationships.area = area;
      });
    }
  }

  constructUrl(workItem: WorkItem) {
    return this.router.url.split('plan')[0] + 'plan/detail/' + workItem.attributes['system.number'];
  }

  onLabelClick(event) {
    let params = {
      label: event.attributes.name
    }
    // Prepare navigation extra with query params
    let navigationExtras: NavigationExtras = {
      queryParams: params
    };

    // Navigated to filtered view
    this.router.navigate([], navigationExtras);
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
      } else if (this.areaSelectbox && this.areaSelectbox.isOpen()) {
        this.areaSelectbox.close();
      } else if (this.iterationSelectbox && this.iterationSelectbox.isOpen()) {
        this.iterationSelectbox.close();
    } else {
        this.closePreview();
      }
    }
  }
  onOpen(event) {
    this.onOpenSelector.emit('open');
  }
   onClose(event) {
    this.onCloseSelector.emit(cloneDeep(this.selectedLabels));
  }

  openDropdown() {
    this.dropdownRef.openDropdown();
  }

  closeDropdown() {
    this.dropdownRef.closeDropdown();
  }
  closeAddAssignee() {
    this.activeAddAssignee = false;
  }
}
