import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
  EventEmitter,
  Renderer2,
  HostListener,
  AfterViewChecked
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  NavigationExtras,
  NavigationStart
} from '@angular/router';

import { Broadcaster } from 'ngx-base';
import { cloneDeep, merge, remove } from 'lodash';
import { Spaces } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs';

import { AreaModel } from './../../models/area.model';
import { AreaService } from './../../services/area.service';
import { Comment } from './../../models/comment';
import { IterationModel } from './../../models/iteration.model';
import { IterationService } from './../../services/iteration.service';
import { LabelModel } from './../../models/label.model';
import { LabelService } from './../../services/label.service';
import { WorkItemTypeControlService } from './../../services/work-item-type-control.service';
import { TypeaheadDropdown, TypeaheadDropdownValue } from '../typeahead-dropdown/typeahead-dropdown.component';
import { WorkItemDataService } from './../../services/work-item-data.service';
import { ModalService } from '../../services/modal.service';
import { UrlService } from './../../services/url.service';
import { WorkItem, WorkItemRelations } from './../../models/work-item';
import { WorkItemService } from './../../services/work-item.service';
import { CollaboratorService } from '../../services/collaborator.service'
import { AuthenticationService,
  User,
  UserService
} from 'ngx-login-client';
import { AssigneeSelectorComponent } from './../assignee-selector/assignee-selector.component';

import {
  SelectDropdownComponent
} from './../../widgets/select-dropdown/select-dropdown.component';


@Component({
  selector: 'work-item-new-detail',
  templateUrl: './work-item-new-detail.component.html',
  styleUrls: [ './work-item-new-detail.component.less' ]
})

export class WorkItemNewDetailComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('userSearch') userSearch: any;
  @ViewChild('areaSelectbox') areaSelectbox: TypeaheadDropdown;
  @ViewChild('iterationSelectbox') iterationSelectbox: TypeaheadDropdown;
  @ViewChild('userList') userList: any;
  @ViewChild('detailHeader') detailHeader: ElementRef;
  @ViewChild('detailContent') detailContent: ElementRef;
  @ViewChild('assignee') assignee: any;
  @ViewChild('dropdown') dropdownRef: SelectDropdownComponent;
  @ViewChild('AssigneeSelector') AssigneeSelector: AssigneeSelectorComponent;
  @Input() selectedLabels: LabelModel[] = [];
  @Input() selectedAssignees: User[] = [];

  @Output() onOpenSelector: EventEmitter<any> = new EventEmitter();
  @Output() onCloseSelector: EventEmitter<LabelModel[]> = new EventEmitter();


  areas: TypeaheadDropdownValue[] = [];
  comments: Comment[] = [];
  dynamicFormGroup: FormGroup;
  dynamicFormDataArray: any;
  iterations: TypeaheadDropdownValue[] = [];
  workItem: WorkItem;
  workItemRef: WorkItem;
  workItemPayload: WorkItem;
  eventListeners: any[] = [];
  loadingComments: boolean = true;
  loadingTypes: boolean = false;
  loadingIteration: boolean = false;
  loadingArea: boolean = false;
  loadingLabels: boolean = false;
  loadingAssignees: boolean = false;
  loggedInUser: User;
  loggedIn: boolean = false;
  users: User[] = [];
  filteredUsers: User[] = [];
  usersLoaded: Boolean = false;
  searchAssignee: Boolean = false;
  headerEditable: Boolean = false;
  descText: any = '';
  labels: LabelModel[] = [];

  private activeAddAssignee: boolean = false;

  constructor(
    private areaService: AreaService,
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private collaboratorService: CollaboratorService,
    private iterationService: IterationService,
    private labelService: LabelService,
    private route: ActivatedRoute,
    private router: Router,
    private spaces: Spaces,
    private userService: UserService,
    private urlService: UrlService,
    private workItemService: WorkItemService,
    private workItemDataService: WorkItemDataService,
    private workItemTypeControlService: WorkItemTypeControlService,
    private renderer: Renderer2,
    private modalService: ModalService
  ) {}

  @HostListener('document:click', ['$event.target','$event.target.classList.contains('+'"assigned_user"'+')'])
  public onClick(targetElement,assigned_user) {
      const clickedInsidePopup = this.assignee.nativeElement.contains(targetElement);
      if (!clickedInsidePopup&&!assigned_user) {
          this.cancelAssignment();
      }
  }

  ngOnInit() {
    this.loggedIn = this.auth.isLoggedIn();
    const takeUntilObserver = this.router.events
      .filter((event) => event instanceof NavigationStart)
      .filter((event: NavigationStart) => event.url.indexOf('plan/detail') == -1);
    this.eventListeners.push(
      this.spaces.current.switchMap(space => {
        return this.route.params;
      })
      .filter(params => params['id'] !== undefined)
      .takeUntil(takeUntilObserver)
      .subscribe((params) => {
          let workItemId = params['id'];
          if (workItemId === 'new') {
            // Create new work item ID
            // you can add type, iteration and area GET params to the url to preselect values
            let type = this.route.snapshot.queryParams['type'];
            let iteration = this.route.snapshot.queryParams['iteration'];
            let area = this.route.snapshot.queryParams['area'];
            this.createWorkItemObj(type, iteration, area);
          } else if (workItemId.split('-').length > 1) {
            // The ID is a UUID
            // To make it backword compaitable
            // We find the number and redirect
            // the URL to the new humna readable URL
            this.workItemService.getWorkItemByNumber(workItemId)
              .subscribe((workItem: WorkItem) => {
                let urlSplit = location.pathname.split('/');
                urlSplit[urlSplit.length - 1] = workItem.attributes['system.number'];
                const redirectTo = urlSplit.join('/');
                this.router.navigateByUrl(redirectTo);
              })
          } else {
            if (Object.keys(params).indexOf('entity') > -1
              && Object.keys(params).indexOf('space') > -1) {
              console.log('Work item ID: ', workItemId);
              this.loadWorkItem(workItemId, params['entity'], params['space']);
            } else {
              console.log('Work item ID: ', workItemId);
              this.loadWorkItem(workItemId);
            }
          }
      })
    );
    this.listenToEvents();
  }

  ngOnDestroy() {
    console.log('Destroying all the listeners in detail component');
    this.eventListeners.forEach(subscriber => subscriber.unsubscribe());
    document.getElementsByTagName('body')[0].style.overflow = "auto";
  }

  ngAfterViewChecked() {
    if(this.detailHeader) {
      let HdrDivHeight:any =  this.detailHeader.nativeElement.offsetHeight;
      let targetHeight:any = window.innerHeight - HdrDivHeight - 90;
      this.renderer.setStyle(this.detailContent.nativeElement, 'height', targetHeight + "px");
    }
    if(document.getElementsByTagName('body')) {
      document.getElementsByTagName('body')[0].style.overflow = "hidden";
    }
  }
  @HostListener('window:resize', ['$event'])
    onResize(event){

    }
  createWorkItemObj(type: string, iterationId: string, areaId: string) {
    this.workItem = new WorkItem();
    this.workItem.id = null;
    this.workItem.attributes = new Map<string, string | number>();
    this.workItem.attributes['system.title'] = '';
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
    // create base empty relationship structure
    this.workItem.relationships = Object.assign(this.workItem.relationships, {});
    // Add creator
    this.userService.getUser()
      .subscribe(
        user => {
          this.workItem.relationships.creator = {
            data: user
          };
        },
        err => console.log(err)
      );
    // if the iteration is given, add the iteration
    if (iterationId) {
      this.iterationService.getIterationById(iterationId)
      .subscribe(
        iteration => {
          // update the iteration value list
          this.getIterations();
          // select the returned iteration in that list
          this.iterations.forEach(thisIteration => thisIteration.selected = thisIteration.key === iteration.id);
          // set the value on the model
          this.workItem.relationships.iteration = {
            data: iteration
          };
        },
        err => console.log(err)
      );
    }
    // if the area is given, add the area
    if (areaId) {
      this.areaService.getAreaById(areaId)
      .subscribe(
        area => {
          // update the area value list
          this.getAreas();
          // select the returned area in that list
          this.areas.forEach(thisArea => thisArea.selected = thisArea.key === area.id);
          // set the value on the model
          this.workItem.relationships.area = {
            data: area
          };
        },
        err => console.log(err)
      );
    }
    this.workItem.relationalData = {};
    this.workItemService.resolveType(this.workItem);
    this.workItem.attributes['system.state'] = 'new';
  }

  loadWorkItem(id: string, owner: string = '', space: string = ''): void {
    const t1 = performance.now();
    this.eventListeners.push(
      this.workItemDataService.getItembyNumber(id)
        .do(workItem => {
          if (workItem) {
            this.workItem = workItem;
            const t2 = performance.now();
            console.log('Performance :: Details page first paint (local data) - '  + (t2 - t1) + ' milliseconds.');
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
        .switchMap(() => this.workItemService.getWorkItemByNumber(id, owner, space))
        .do(workItem => {
          this.workItem = workItem;
          this.workItemDataService.setItem(workItem);
          // Open the panel once work item is ready
          const t2 = performance.now();
          console.log('Performance :: Details page first paint - '  + (t2 - t1) + ' milliseconds.');
        })
        .do (workItem => console.log('Work item fetched: ', cloneDeep(workItem)))
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
    this.activeSearchAssignee();
    return this.workItemService.resolveAssignees(this.workItem.relationships.assignees)
      .do(assignees => {
        // Resolve assignees
        this.workItem.relationships.assignees = {
          data: assignees
        };
        this.loadingAssignees = false;

    console.log("RESOLVE");
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
        this.labels = labels;
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

  onLabelSelectorOpen(event) {
    if (!this.workItem.id) {
      this.labelService.getLabels()
        .subscribe(labels => this.labels = labels);
    }
  }
  onAssigneeSelectorOpen(event) {
    console.log("Dropdown open");
  }

  getAllUsers(): Observable<any> {
    return Observable.combineLatest(
      this.userService.getUser(),
      this.collaboratorService.getCollaborators()
    )
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

  saveTitle(event: any) {
    const value = event.value.trim();
    const callBack = event.callBack;
    if (value === '') {
      callBack(value, 'Empty title not allowed');
    } else if (this.workItem.attributes['system.title'] === value) {
      callBack(value);
    } else {
      this.workItem.attributes['system.title'] = value;
      if (this.workItem.id) {
        let payload = cloneDeep(this.workItemPayload);
        payload.attributes['system.title'] = value;
        this.save(payload, true)
          .subscribe((workItem: WorkItem) => {
            this.workItem.attributes['system.title'] = workItem.attributes['system.title'];
            callBack(value);
          });
      } else {
        let payload = cloneDeep(this.workItem);
        payload.attributes['system.title'] = value;
        this.save(payload, true)
          .subscribe(() => {
            callBack(value);
          },
          (err) => {
            console.log(err);
            callBack(value, 'Something went wrong');
          })
      }
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
          return Observable.throw(error);
        });
    } else {
      const t1 = performance.now();
      if (this.workItem.attributes['system.title']) {
        retObservable = this.workItemService
        .create(this.workItem)
        .do(workItem => {
          let queryParams = cloneDeep(this.route.snapshot.queryParams);
          if (Object.keys(queryParams).indexOf('type') > -1) {
            delete queryParams['type'];
          }
          this.router.navigate(
            [this.router.url.split('/detail/')[0] + '/detail/' + workItem.id],
            { queryParams: queryParams } as NavigationExtras
          );
          this.workItemService.emitAddWI(workItem);
          const t2 = performance.now();
          console.log('Performance :: Detail add work item - '  + (t2 - t1) + ' milliseconds.');
        })
        .catch((error: Error | any) => {
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
          // this.updateOnList();
        });
    }
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
  }

  updateOnList() {
    this.workItemService.emitEditWI(this.workItem);
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

  assignUser(users: User[]): void {
    this.loadingAssignees = true;
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
        this.updateOnList()
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
      console.log("STEP 3");
    }
    //this.searchAssignee = false;
  }

  updateLabels(selectedLabels: LabelModel[]) {
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
          // Sort labels in alphabetical order
          selectedLabels = selectedLabels.sort(function(labelA, labelB) {
            let labelAName = labelA.attributes.name.toUpperCase();
            let labelBName = labelB.attributes.name.toUpperCase();
            return labelAName.localeCompare(labelBName);
          });
          this.workItem.relationships.labels = {
            data: selectedLabels
          };
          this.loadingLabels = false;
        })
    } else {
      this.workItem.relationships.labels = {
        data : selectedLabels
      };
    }
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

  removeLable(event) {
    let labels = cloneDeep(this.workItem.relationships.labels.data);
    let index = labels.indexOf(labels.find(l => l.id === event.id));
    if(index > -1) {
      labels.splice(index, 1);
      this.updateLabels(labels);
    }
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
          this.updateOnList();
      });
    } else {
      let area = { };
      if (areaId) {
        // area was set to a value.
        area = {
          data: {
            id: areaId,
            type: 'area'
          }
        };
      };
      this.workItem.relationships.area = area;
      // Need setTimeout for typeahead drop down't change detection to work
      setTimeout(() => {
        this.loadingArea = false;
        this.areas.forEach(area => area.selected = area.key === areaId);
      });
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
        this.updateOnList();
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
      this.workItem.relationships.iteration = iteration;
      // Need setTimeout for typeahead drop down't change detection to work
      setTimeout(() => {
        this.loadingIteration = false;
        this.iterations.forEach(it => it.selected = it.key === iterationId);
      });
    }
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
          this.updateOnList();
        })
    } else {
      this.workItem.attributes['system.description'] = this.descText.trim();
      this.workItem.attributes['system.description.markup'] = 'Markdown';
      this.workItemService.renderMarkDown(
        this.workItem.attributes['system.description']
      ).subscribe(rendered => {
        callBack(
          this.workItem.attributes['system.description'],
          rendered
        )
      });
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

  navigateBack() {
    if (this.urlService.getLastListOrBoard() === '') {
      this.router.navigate(['../..'], { relativeTo: this.route });
    } else {
      this.router.navigateByUrl(this.urlService.getLastListOrBoard());
    }
  }

  onLabelClick(label) {
    if (this.urlService.getLastListOrBoard() === '') {
      let params = {
        label: label.attributes.name
      }
      // Prepare navigation extra with query params
      let navigationExtras: NavigationExtras = {
        relativeTo: this.route,
        queryParams: params
      };
      this.router.navigate(['../..'], navigationExtras);
    } else {
      let url = this.urlService.getLastListOrBoard().split('?')[0]
        + '?label=' + label.attributes.name;
      this.router.navigateByUrl(url);
    }
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
