import { Broadcaster } from 'ngx-base';
import { WorkItemTypeControlService } from './../../services/work-item-type-control.service';
import { FormGroup } from '@angular/forms';
import { Comment } from './../../models/comment';
import { IterationService } from './../../services/iteration.service';
import { AreaModel } from './../../models/area.model';
import { IterationModel } from './../../models/iteration.model';
import { TypeaheadDropdownValue } from './../typeahead-dropdown/typeahead-dropdown.component';
import { AreaService } from './../../services/area.service';
import { Observable } from 'rxjs';
import { cloneDeep, merge, remove } from 'lodash';
import { WorkItemDataService } from './../../services/work-item-data.service';
import { ActivatedRoute } from '@angular/router';
import { Spaces } from 'ngx-fabric8-wit';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { WorkItem, WorkItemRelations } from './../../models/work-item';
import { WorkItemService } from './../../services/work-item.service';
import { AuthenticationService,
  User,
  UserService
} from 'ngx-login-client';


@Component({
  selector: 'work-item-new-detail',
  templateUrl: './work-item-new-detail.component.html',
  styleUrls: [ './work-item-new-detail.component.less' ]
})

export class WorkItemNewDetailComponent implements OnInit, OnDestroy {
  areas: TypeaheadDropdownValue[] = [];
  comments: Comment[] = [];
  dynamicFormGroup: FormGroup;
  dynamicFormDataArray: any;
  iterations: TypeaheadDropdownValue[] = [];
  workItem: WorkItem;
  workItemPayload: WorkItem;
  eventListeners: any[] = [];
  loadingComments: boolean = true;
  loadingTypes: boolean = false;
  loadingIteration: boolean = false;
  loadingArea: boolean = false;
  loggedInUser: User;
  loggedIn: boolean = false;

  constructor(
    private areaService: AreaService,
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private iterationService: IterationService,
    private route: ActivatedRoute,
    private spaces: Spaces,
    private userService: UserService,
    private workItemService: WorkItemService,
    private workItemDataService: WorkItemDataService,
    private workItemTypeControlService: WorkItemTypeControlService,
  ) {}

  ngOnInit() {
    this.loggedIn = this.auth.isLoggedIn();
    this.spaces.current.switchMap(space => {
        return this.route.params;
      }).filter(params => params['id'] !== undefined)
      .subscribe((params) => {
          let workItemId = params['id'];
          if (workItemId === 'new'){
            // Create new work item ID
          } else {
            console.log('Work item ID: ', workItemId);
            this.loadWorkItem(workItemId);
          }
      })
  }

  ngOnDestroy() {
    console.log('Destroying all the listeners in detail component');
    this.eventListeners.forEach(subscriber => subscriber.unsubscribe());
  }

  loadWorkItem(id: string): void {
    const t1 = performance.now();
    this.eventListeners.push(
      this.workItemDataService.getItem(id)
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
        })
        .switchMap(() => this.workItemService.getWorkItemById(id))
        .do(workItem => {
          this.workItem = workItem;
          this.workItemDataService.setItem(workItem);
          // Open the panel once work item is ready
          const t2 = performance.now();
          console.log('Performance :: Details page first paint - '  + (t2 - t1) + ' milliseconds.');
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
            this.resolveComments()
          )
        })
        .subscribe(() => {
          // this.closeUserRestFields();

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
            this.dynamicFormGroup = this.workItemTypeControlService.toFormGroup(this.workItem);
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
    if (this.workItem.attributes['system.title'] === value) {
      callBack(value);
    } else if (value === '') {
      callBack(value, 'Empty title not allowed');
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
    }
    if (returnObservable) {
      return retObservable;
    } else {
      retObservable.subscribe();
    }
  }

  createWorkItemObj(type: string) {

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
}
