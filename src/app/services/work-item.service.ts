import { Injectable, Component, Inject } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import 'rxjs/operators/map';
import 'rxjs/add/operator/catch';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { cloneDeep } from 'lodash';
import { DropdownOption } from 'ngx-widgets';
import { Broadcaster, Logger } from 'ngx-base';
import {
  AuthenticationService,
  User,
  UserService
} from 'ngx-login-client';
import { Space, Spaces } from 'ngx-fabric8-wit';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { Notification, Notifications, NotificationType } from 'ngx-base';

import {
  Comment,
  Comments,
  CommentPost
} from '../models/comment';

import { AreaModel } from '../models/area.model';
import { AreaService } from './area.service';
import { IterationModel } from '../models/iteration.model';
import { IterationService } from './iteration.service';
import { LinkType } from '../models/link-type';
import { Link } from '../models/link';
import {
  LinkDict,
  WorkItem,
  WorkItemService as WIService
} from '../models/work-item';
import { WorkItemType } from '../models/work-item-type';
import { HttpService } from './http-service';

@Injectable()
export class WorkItemService {

  private workItemUrl: string = null;
  private workItemTypeUrl: string = null;
  private linkTypesUrl: string = null;
  private linksUrl: string = null;
  private reorderUrl: string = null;
  private baseSearchUrl: string = null;
  private renderUrl: string = null;

  private headers = {};
  private availableStates: DropdownOption[] = [];
  public workItemTypes: WorkItemType[] = [];

  private nextLink: string = null;
  private initialWorkItemFetchDone = false;
  private userIdMap = {};
  private workItemIdIndexMap = {};
  private prevFilters: any = [];
  private iterations: IterationModel[] = [];
  public _currentSpace;

  private selfId;

  public addWIObservable: Subject<any> = new Subject();
  public addWIChildObservable: Subject<any> = new Subject();
  public editWIObservable: Subject<WorkItem> = new Subject();
  public selectedWIObservable: Subject<WorkItem> = new Subject();
  public showTree: Subject<boolean> = new Subject();

  constructor(private http: HttpService,
    private broadcaster: Broadcaster,
    private logger: Logger,
    private areaService: AreaService,
    private auth: AuthenticationService,
    private iterationService: IterationService,
    private userService: UserService,
    private notifications: Notifications,
    private spaces: Spaces,
    @Inject(WIT_API_URL) private baseApiUrl: string) {
    this.spaces.current.subscribe(val => this._currentSpace = val);
    this.selfId = this.createId();
    this.logger.log('Launching WorkItemService instance id ' + this.selfId);
  }

  notifyError(message: string, httpError: any) {
    this.logger.log('ERROR [WorkItemService] ' + message + (httpError.message?' '+httpError.message:''));
    /*
    this.notifications.message({
        message: message + (httpError.message?' '+httpError.message:''),
        type: NotificationType.DANGER
      } as Notification);
    */
  }

  createId(): string {
    let id = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++)
      id += possible.charAt(Math.floor(Math.random() * possible.length));
    console.log('Created new id ' + id);
    return id;
  }

  // switchSpace(space: Space) {
  //   this.logger.log('[WorkItemService] New Space selected: ' + space.name);
  //   this.workItemUrl = space.spaceBaseUrl + 'workitems';
  //   this.workItemTypeUrl = space.spaceBaseUrl + 'workitemtypes';
  //   this.linkTypesUrl = space.spaceBaseUrl + 'workitemlinktypes';
  //   this.linksUrl = space.spaceBaseUrl + 'workitemlinks';
  //   this.reorderUrl = space.spaceBaseUrl + 'workitems/reorder';
  //   this.baseSearchUrl = space.spaceBaseUrl + 'search?q=';
  //   this.renderUrl = space.spaceBaseUrl + 'render';
  //   this.logger.log('WorkItemService using url ' + this.workItemUrl);
  // }

  getChildren(parent: WorkItem): Observable<WorkItem[]> {
    // TODO: it looks like the children are not retrieved with paging. This may cause problems in the future.
    if (parent.relationships.children) {
      this.logger.log('Requesting children for work item ' + parent.id);
      let url = parent.relationships.children.links.related;
      return this.http
        .get(url)
        .map(response => {
          let wItems: WorkItem[];
          wItems = response.json().data as WorkItem[];
          wItems.forEach((item) => {
            // put the hasChildren on the root level for the tree
            if (item.relationships.children.meta)
              item.hasChildren = item.relationships.children.meta.hasChildren;
            // Resolve the assignee and creator
            this.resolveUsersForWorkItem(item);
            this.resolveIterationForWorkItem(item);
            this.resolveType(item);
            this.resolveAreaForWorkItem(item);
          });
          return wItems;
        }).catch((error: Error | any) => {
          this.notifyError('Getting children of work item failed.', error);
          return Observable.throw(new Error(error.message));
        });
    } else {
      this.logger.log('Work item does not have child related link, skipping: ' + parent.id);
      return Observable.of([]);
    }
  }

  getChildren2(url: string): Observable<WIService[]>{
    return this.http
        .get(url)
        .map(response => response.json().data as WIService[]);
  }

  getWorkItems(pageSize: number = 20, filters: any[] = []): Observable<{workItems: WorkItem[], nextLink: string, totalCount?: number | null, included?: WorkItem[] | null, ancestorIDs?: Array<string> }> {
    if (this._currentSpace) {
      this.workItemUrl = this._currentSpace.links.self + '/workitems';
      let url = this.workItemUrl + '?page[limit]=' + pageSize;
      filters.forEach((item) => {
        url += '&' + item.paramKey + '=' + item.value;
      });
      return this.http.get(url)
        .map((resp) => {
          return {
            workItems: resp.json().data as WorkItem[],
            nextLink: resp.json().links.next,
            totalCount: resp.json().meta ? resp.json().meta.totalCount : 0,
            included: resp.json().included ? resp.json().included as WorkItem[] : [] as WorkItem[],
            ancestorIDs: resp.json().meta.ancestorIDs ? resp.json().meta.ancestorIDs : [],
          };
        }).catch((error: Error | any) => {
          this.notifyError('Getting work items failed.', error);
          return Observable.throw(new Error(error.message));
        });
    } else {
      return Observable.of<{workItems: WorkItem[], nextLink: string | null}>( {workItems: [] as WorkItem[], nextLink: null} );
    }
  }

  // TODO Filter temp
  getWorkItems2(pageSize: number = 20, filters: object): Observable<{workItems: WorkItem[], nextLink: string, totalCount?: number | null, included?: WorkItem[] | null, ancestorIDs?: Array<string>}> {
    if (this._currentSpace) {
      let url = '';
      if (process.env.ENV === 'inmemory') {
        url = 'http://mock.service/api/spaces/space-id0/workitems?page[limit]=42&filter[space]=space-id0&filter[typegroup.name]=Scenarios';
      } else {
        this.workItemUrl = this._currentSpace.links.self.split('spaces')[0] + 'search';
        url = this.workItemUrl + '?page[limit]=' + pageSize + '&' + Object.keys(filters).map(k => 'filter['+k+']='+JSON.stringify(filters[k])).join('&');
      }
      return this.http.get(url)
        .map((resp) => {
          return {
            workItems: resp.json().data as WorkItem[],
            nextLink: resp.json().links.next,
            totalCount: resp.json().meta ? resp.json().meta.totalCount : 0,
            included: resp.json().included ? resp.json().included as WorkItem[] : [],
            ancestorIDs: resp.json().meta.ancestorIDs ? resp.json().meta.ancestorIDs : [],
          };
        }).catch((error: Error | any) => {
          this.notifyError('Getting work items failed.', error);
          return Observable.throw(new Error(error.message));
        });
    } else {
      return Observable.of<{workItems: WorkItem[], nextLink: string | null}>( {workItems: [] as WorkItem[], nextLink: null} );
    }
  }


  /**
   * This function is called from next page onwards in the scroll
   * It does pretty much same as the getWorkItems function
   */
  getMoreWorkItems(url): Observable<{workItems: WorkItem[], nextLink: string | null, included?: WorkItem[] | null, ancestorIDs?: Array<string>}> {
    if (url) {
      return this.http.get(url)
        .map((resp) => {
          return {
            workItems: resp.json().data as WorkItem[],
            nextLink: resp.json().links.next,
            included: resp.json().included ? resp.json().included as WorkItem[] : [],
            ancestorIDs: resp.json().meta.ancestorIDs ? resp.json().meta.ancestorIDs : [],
          };
        }).catch((error: Error | any) => {
          this.notifyError('Getting more work items failed.', error);
          return Observable.throw(new Error(error.message));
        });
    } else {
      return Observable.throw('No more item found');
    }
  }


  resolveWorkItems(workItems, iterations, users, wiTypes, labels, included: WorkItem[] = []): WorkItem[] {
    let resolvedWorkItems = workItems.map((item) => {
      // Resolve assignnees
      if (item.relationships.assignees && item.relationships.assignees.data) {
        let assignees = item.relationships.assignees.data ? cloneDeep(item.relationships.assignees.data) : [];
        item.relationships.assignees.data = assignees.map((assignee) => {
          return users.find((user) => user.id === assignee.id) || assignee;
        });
      }

      // Resolve creator
      let creator = cloneDeep(item.relationships.creator.data);
      item.relationships.creator.data = users.find((user) => user.id === creator.id) || creator;

      // Resolve iteration
      let iteration = cloneDeep(item.relationships.iteration.data);
      if (iteration) {
        item.relationships.iteration.data = iterations.find((it) => it.id === iteration.id) || iteration;
      }

      // Resolve labels
      let WIlabels = item.relationships.labels.data ? cloneDeep(item.relationships.labels.data) : [];
      item.relationships.labels.data = WIlabels.map(label => {
        return labels.find(l => l.id === label.id);
      })

      // Sort labels in alphabetical order
      item.relationships.labels.data = item.relationships.labels.data.sort(function(labelA, labelB) {
        let labelAName = labelA.attributes.name.toUpperCase();
        let labelBName = labelB.attributes.name.toUpperCase();
        return labelAName.localeCompare(labelBName);
      });

      // Resolve work item types
      let wiType = cloneDeep(item.relationships.baseType.data);
      if (wiType) {
        item.relationships.baseType.data = wiTypes.find((type) => type.id === wiType.id) || wiType;
      }
      return item;
    });
    return resolvedWorkItems;
  }

  getNextLink(): string {
    return this.nextLink;
  }

  setNextLink(link: string): void {
    this.nextLink = link;
  }

  /*
  // converts a any object to a WorkItem (creating the attribute Map)
  toWorkItem(input: any): WorkItem {
    let newWorkItem = cloneDeep(input) as WorkItem;
    newWorkItem.attributes = new Map<string, string | number>();
    for (var property in input.attributes) {
      if (input.attributes.hasOwnProperty(property)) {
        newWorkItem.attributes.set(property, input.attributes[property]);
      }
    }
    return newWorkItem;
  }
  */

  /**
   * Usage: This method gives a single work item by display number.
   *
   * @param id : string - number
   * @param owner : string
   * @param space : string
   */
  getWorkItemByNumber(id: string | number, owner: string = '', space: string = ''): Observable<WorkItem> {
    if (this._currentSpace) {
      if (owner && space) {
        return this.http.get(
          this._currentSpace.links.self.split('/spaces/')[0] +
          '/namedspaces' +
          '/' + owner +
          '/' + space +
          '/workitems/' + id,
          {'no-header': null}
        )
        .map(item => item.json().data)
        .catch((error: Error | any) => {
          this.notifyError('Getting work item data failed.', error);
          return Observable.throw(new Error(error.message));
        });
      } else {
        return this.http.get(this._currentSpace.links.self.split('/spaces/')[0] + '/workitems/' + id)
          .map(item => item.json().data)
          .catch((error: Error | any) => {
            this.notifyError('Getting work item data failed.', error);
            return Observable.throw(new Error(error.message));
          });
      }
    } else {
      return Observable.of<WorkItem>( new WorkItem() );
    }
  }

  /**
   * Usage: To resolve the users in eact WorkItem
   * For now it resolves assignne and creator
   */
  resolveUsersForWorkItem(workItem: WorkItem): void {
    if (!workItem.hasOwnProperty('relationalData')) {
      workItem.relationalData = {};
    }
    this.resolveAssignee(workItem);
    this.resolveCreator(workItem);
  }

  /**
   * Usage: Resolve the list of assignees for a WorkItem
   */
  resolveAssignee(workItem: WorkItem): void {
    workItem.relationalData.assignees = [];
    if (!workItem.relationships.hasOwnProperty('assignees') || !workItem.relationships.assignees) {
      return;
    }
    if (!workItem.relationships.assignees.hasOwnProperty('data')) {
      return;
    }
    if (!workItem.relationships.assignees.data || !workItem.relationships.assignees.data.length) {
      return;
    }
    workItem.relationships.assignees.data.forEach((assignee) => {
      workItem.relationalData.assignees.push(this.getUserById(assignee.id));
    });
  }

  resolveAssignees(assignees: any): Observable<User[]> {
    if (Object.keys(assignees).length && assignees.data.length) {
      let observableBatch = assignees.data.map((assignee) => {
        return this.http.get(assignee.links.self)
          .map((res) => res.json().data)
          .catch((error: Error | any) => {
            return Observable.throw(new Error(error.message));
          });
      });
      return Observable.forkJoin(observableBatch);
    } else {
      return Observable.of([]);
    }
  }

  getUsersByURLs(userURLs: string[]): Observable<User[]> {
    let observableBatch = userURLs.map((url) => {
        return this.http.get(url)
          .map((res) => res.json().data)
          .catch((error: Error | any) => {
            return Observable.throw(new Error(error.message));
          });
      });
      return Observable.forkJoin(observableBatch);
  }

  resolveCreator2(creator): Observable<User>{
    if (Object.keys(creator).length) {
      let creatorLink = creator.data.links.self;
      return this.http.get(creatorLink)
        .map(creator => creator.json().data)
        .catch((error: Error | any) => {
          this.notifyError('Getting work item creator failed.', error);
          return Observable.throw(new Error(error.message));
        });
    } else {
      return Observable.of(creator);
    }
  }

  resolveCommentCreator(creator): Observable<User>{
    if (Object.keys(creator).length) {
      let creatorLink = creator.links.related;
      return this.http.get(creatorLink)
        .map(creator => creator.json().data)
        .catch((error: Error | any) => {
          this.notifyError('Getting work item creator failed.', error);
          return Observable.throw(new Error(error.message));
        });
    } else {
      return Observable.of(creator);
    }
  }

  /**
   * Usage: Resolve the creator for a WorkItem
   */
  resolveCreator(workItem: WorkItem): void {
    if (!workItem.relationships.hasOwnProperty('creator') || !workItem.relationships.creator) {
      workItem.relationalData.creator = null;
      return;
    }
    if (!workItem.relationships.creator.hasOwnProperty('data')) {
      workItem.relationalData.creator = null;
      return;
    }
    if (!workItem.relationships.creator.data) {
      workItem.relationalData.creator = null;
      return;
    }
    // To handle some old items with no creator
    if (workItem.relationships.creator.data.id === 'me') {
      workItem.relationalData.creator = null;
      return;
    }
    workItem.relationalData.creator = this.getUserById(workItem.relationships.creator.data.id);
  }

  /**
   * Usage: Resolve the wi type for a WorkItem
   */
  resolveType(workItem: WorkItem): void {
    this.getWorkItemTypesById(workItem.relationships.baseType.data.id)
      .subscribe((type: WorkItemType) => {
        workItem.relationships.baseType.data = type;
    });
  }


  /**
   * Usage: To resolve the users in eact WorkItem
   * For now it resolves assignne and creator
   */
  resolveIterationForWorkItem(workItem: WorkItem): void {
    if (!workItem.hasOwnProperty('relationalData')) {
      workItem.relationalData = {};
    }
    if (!workItem.relationships.hasOwnProperty('iteration') || !workItem.relationships.iteration) {
      workItem.relationalData.iteration = null;
      return;
    }
    if (!workItem.relationships.iteration.hasOwnProperty('data')) {
      workItem.relationalData.iteration = null;
      return;
    }
    if (!workItem.relationships.iteration.data) {
      workItem.relationalData.iteration = null;
      return;
    }
    this.getIterationById(workItem.relationships.iteration.data.id)
      .subscribe((iteration) => workItem.relationalData.iteration = iteration);
  }

  /**
   * Usage: To resolve the areas in eact WorkItem
   * For now it resolves assignne and creator
   */
  resolveAreaForWorkItem(workItem: WorkItem): void {
    if (!workItem.hasOwnProperty('relationalData')) {
      workItem.relationalData = {};
    }
    if (!workItem.relationships.hasOwnProperty('area') || !workItem.relationships.area) {
      workItem.relationalData.area = null;
      return;
    }
    if (!workItem.relationships.area.hasOwnProperty('data')) {
      workItem.relationalData.area = null;
      return;
    }
    if (!workItem.relationships.area.data) {
      workItem.relationalData.area = null;
      return;
    }
    this.getAreaById(workItem.relationships.area.data.id)
      .subscribe((area) => workItem.relationalData.area = area);
  }

  /**
   * Usage: Build a ID-User map to dynamically access list of users
   * This method takes the locally saved list of users from User Service
   * Before coming to this method we fetch the list of users using router resolver
   * in detail and list component.
   */
  buildUserIdMap(): void {
    // Fetch the current updated locally saved user list
    let users: User[] = this.userService.getLocallySavedUsers() as User[];
    // Check if the map is putdated or not and if yes then rebuild it
    if (Object.keys(this.userIdMap).length < users.length) {
      this.userIdMap = {};
      users.forEach((user) => {
        this.userIdMap[user.id] = user;
      });
    }
  }

  /**
   * Usage: Fetch an use by it's ID from the User-ID map
   */
  getUserById(userId: string): User {
    if (userId in this.userIdMap) {
      return this.userIdMap[userId];
    } else {
      return null;
    }
  }

  /**
   * Usage: Fetch an area by it's ID from the areas list
   */
  getAreaById(areaId: string): Observable<AreaModel> {
    return this.areaService.getAreas().map((areas) => {
      return areas.find(item => item.id == areaId);
    });
  }

  /**
   * Usage: Fetch an iteration by it's ID from the iterations list
   */
  getIterationById(iterationId: string): Observable<IterationModel> {
    return this.iterationService.getIterations().map((iterations) => {
      return iterations.find(item => item.id == iterationId);
    });
  }

  /**
   * Usage: This method is to resolve the events for a work item
   * This method is only called when a single item is fetched for the
   * details page.
   *
   * @param: WorkItem - wItem
   */
  resolveEvents(url: string): Observable<any> {
    return this.http
      .get(url)
      .map(response => {
        return response.json().data;
      })
}

  /**
   * Usage: This method is to resolve the comments for a work item
   * This method is only called when a single item is fetched for the
   * details page.
   *
   * @param: WorkItem - wItem
   */
  resolveComments(url: string): Observable<any> {
      return this.http
        .get(url)
        .map(response => {
          return { data: response.json().data, meta: response.json().meta, links: response.json().links};
        })
  }

  /**
   * Usage: This method is to resolve the linked items for a work item
   * This method is only called when a single item is fetched for the
   * details page.
   *
   * @param: WorkItem - wItem
   */
  resolveLinks(url: string): Observable<any> {
    return this.http
      .get(url)
      .map(response => [response.json().data as Link[], response.json().included])
      .catch((error: Error | any) => {
        this.notifyError('Getting linked items data failed.', error);
        return Observable.throw(new Error(error.message));
      });
  }

  /**
   * Usage: This method is to fetch the work item types
   * This method will be deprecated and types will come from
   * router resolver
   * ToDo: Use router resolver to fetch types here
   */
  getWorkItemTypes(): Observable<any[]> {
    if (this._currentSpace) {
      this.workItemTypeUrl = this._currentSpace.links.self + '/workitemtypes';
      return this.http
        .get(this.workItemTypeUrl)
        .map((response) => {
          let resultTypes = response.json().data as WorkItemType[];

          // THIS IS A HACK!
          for (let i=0; i<resultTypes.length; i++)
            if (resultTypes[i].id==='86af5178-9b41-469b-9096-57e5155c3f31')
              resultTypes.splice(i, 1);

          this.workItemTypes = resultTypes;
          return this.workItemTypes;
        }).catch((error: Error | any) => {
          this.notifyError('Getting work item type information failed.', error);
          return Observable.throw(new Error(error.message));
        });
    } else {
      return Observable.of<WorkItemType[]>( [] as WorkItemType[] );
    }
  }

  getWorkItemTypes2(workItemTypeUrl): Observable<any[]> {
    return this.http
      .get(workItemTypeUrl)
      .map((response) => {
        let resultTypes = response.json().data as WorkItemType[];

        // THIS IS A HACK!
        for (let i=0; i<resultTypes.length; i++)
          if (resultTypes[i].id==='86af5178-9b41-469b-9096-57e5155c3f31')
            resultTypes.splice(i, 1);

        this.workItemTypes = resultTypes;
        return this.workItemTypes;
      }).catch((error: Error | any) => {
        this.notifyError('Getting work item type information failed.', error);
        return Observable.throw(new Error(error.message));
      });
  }

  /**
   * Usage: This method is to fetch the work item types by ID
   */

  getWorkItemTypesById(id: string): Observable<WorkItemType> {
    if (this._currentSpace && typeof(id) !== 'undefined') {
      let workItemType = this.workItemTypes ? this.workItemTypes.find((type) => type.id === id) : null;
      if (workItemType) {
        return Observable.of(workItemType);
      } else {
        let workItemTypeUrl = this._currentSpace.links.self.split('/spaces/')[0] +
          '/workitemtypes/' + id;
        return this.http.get(workItemTypeUrl)
          .map((response) => {
            workItemType = response.json().data as WorkItemType;
            if (this.workItemTypes) {
              let existingType = this.workItemTypes.find((type) => type.id === workItemType.id);
              if (existingType) {
                existingType = workItemType;
              } else {
                this.workItemTypes.push(workItemType);
              }
            }
            return workItemType;
          }).catch((error: Error | any) => {
            this.notifyError('Getting work item type info failed.', error);
            return Observable.throw(new Error(error.message));
          });
      }
    } else {
      return Observable.of<WorkItemType>( {} as WorkItemType );
    }
  }

  /**
   * Usage: This method is to fetch the work item states
   * This method will be deprecated and states will come from
   * router resolver
   * ToDo: Use router resolver to fetch states here
   */
  getStatusOptions(): Observable<any[]> {
    if (this.availableStates.length) {
      return Observable.of(this.availableStates);
    } else {
      return this.getWorkItemTypes()
        .map((response) => {
          this.availableStates = response[0].attributes.fields['system.state'].type.values.map((item: string, index: number) => {
            return {
              option: item,
            };
          });
          console.log('availableStates = ', this.availableStates);
          return this.availableStates;
        }).catch((error: Error | any) => {
          this.notifyError('Getting available status options for work item failed.', error);
          return Observable.throw(new Error(error.message));
        });
    }
  }

  /**
   * Usage: This method deletes an item
   * removes the delted item from the big list
   * re build the ID-Index map
   *
   * @param: WorkItem - workItem (Item to be delted)
   */
  delete(workItem: WorkItem): Observable<void> {
    return this.http
      .delete(workItem.links.self)
      .map(() => {
        this.broadcaster.broadcast('delete_workitem', workItem);
      }).catch((error: Error | any) => {
          this.notifyError('Deleting work item failed.', error);
          return Observable.throw(new Error(error.message));
      });
  }

   /**
    * Usage: This method create a new item
    * adds the new item to the big list
    * resolve the users for the item
    * re build the ID-Index map
    *
    * @param: WorkItem - workItem (Item to be created)
    */
  create(workItem: WorkItem): Observable<WorkItem> {
    console.log('work item in create ', workItem);
    let payload = JSON.stringify({data: workItem});
    if (this._currentSpace) {
      this.workItemUrl = this._currentSpace.links.self + '/workitems';
      return this.http
        .post(this.workItemUrl, payload)
        .map(response => {
          return response.json().data as WorkItem;
        }).catch((error: Error | any) => {
          this.notifyError('Creating work item failed.', error);
          return Observable.throw(new Error(error.message));
        });
    } else {
      return Observable.of<WorkItem>( new WorkItem() );
    }
  }

  /**
   * Usage: This method emit a new work item created event
   * The list view and board view listens to this event
   * and updates the view based on applied filters.
   */

  emitAddWI(workitemDetail) {
    this.addWIObservable.next(workitemDetail);
  }

  emitAddWIChild(workitemDetail) {
    this.addWIChildObservable.next(workitemDetail);
  }

  /**
   * Usage: This method emit a new work item created event
   * The list view and board view listens to this event
   * and updates the view based on applied filters.
   */

  emitEditWI(workItem: WorkItem) {
    this.editWIObservable.next(workItem);
  }

  /**
   * Usage: This method emit a event when WI get seleceted.
   */
  emitSelectedWI(workItem: WorkItem) {
    this.selectedWIObservable.next(workItem);
  }

  /**
   * Usage: this method emit a event when showTree is toggled
   */
  emitShowTree(showTree: boolean) {
    this.showTree.next(showTree);
  }

  /**
   * Usage: This method update an existing item
   * updates the item in the big list
   * resolve the users for the item
   *
   * @param: WorkItem - workItem (Item to be created)
   */
  update(workItem: WorkItem): Observable<WorkItem> {
    return this.http
      .patch(workItem.links.self, JSON.stringify({data: workItem}))
      .map(response => {
        return response.json().data;
      }).catch((error: Error | any) => {
        this.notifyError('Updating work item failed.', error);
        return Observable.throw(new Error(error.message));
      });
  }

  /**
   * Usage: This method create a comment for a workItem
   *
   * @param: string - id (Work Item ID)
   * @param: Comment
   */
  createComment(url: string, comment: Comment): Observable<Comment> {
    let c = new CommentPost();
    c.data = comment;
    return this.http
      .post(url, c)
      .map(response => {
        return response.json().data as Comment;
      }).catch((error: Error | any) => {
        this.notifyError('Creating comment failed.', error);
        return Observable.throw(new Error(error.message));
      });
  }

  updateComment(comment: Comment): Observable<Comment> {
    let endpoint = comment.links.self;
    return this.http
      .patch(endpoint, { 'data': comment })
      .map(response => {
        let comment: Comment = response.json().data as Comment;
        let theUser: User = this.userService.getSavedLoggedInUser();
        comment.relationalData = { 'creator' : theUser };
        return comment;
      }).catch((error: Error | any) => {
        this.notifyError('Updating comment failed.', error);
        return Observable.throw(new Error(error.message));
      });
  }

  deleteComment(comment: Comment): Observable<any> {
    let endpoint = comment.links.self;
    return this.http.delete(endpoint)
      .catch((error: Error | any) => {
          this.notifyError('Deleting comment failed.', error);
          return Observable.throw(new Error(error.message));
      });
  }

  /**
   * Usage: This function fetches all the work item link types
   * Store it in an instance variable
   *
   * @return Promise of LinkType[]
   */
  getAllLinkTypes(url: string): Observable<any> {
    return this.http.get(url)
      .catch((error: Error | any) => {
        this.notifyError('Getting link meta info failed (forward).', error);
        return Observable.throw(new Error(error.message));
      });
  }

  formatLinkTypes(linkTypes: any): any {
    let opLinkTypes = [];
    linkTypes.forwardLinks.forEach((linkType: LinkType) => {
      opLinkTypes.push({
        name: linkType.attributes['forward_name'],
        linkId: linkType.id,
        linkType: 'forward'
      });
    });
    linkTypes.backwardLinks.forEach((linkType: LinkType) => {
      opLinkTypes.push({
        name: linkType.attributes['reverse_name'],
        linkId: linkType.id,
        linkType: 'reverse'
      });
    });
    return opLinkTypes;
  }

  /**
   * Usage: This function adds a link to a work item
   * Stroes the resolved link in relationalData
   * Updates the reference of workItem so doesn't return anything
   *
   * @param link: Link
   * @param includes: any - Data relavent to the link
   * @param wItem: WorkItem
   */
  addLinkToWorkItem(link: Link, includes: any, wItem: WorkItem): void {
    wItem.relationalData.totalLinkCount += 1;
    // Get the link type of this link
    let linkType_id = link.relationships.link_type.data.id;
    let linkType = includes.find(
      (i: any) => i.id == linkType_id && i.type == 'workitemlinktypes'
    );

    // Resolve source
    if (link.relationships.source.data.id == wItem.id) {
      // Setting target info from the data in included
      let targetWItem = includes.find(
        (i: any) => i.type == 'workitems' && i.id == link.relationships.target.data.id
      );

      link.relationalData = {
        source: {
          title: wItem.attributes['system.title'],
          id: wItem.id,
          number: wItem.attributes['system.number'],
          state: wItem.attributes['system.state']
        },
        target: {
          title: targetWItem.attributes['system.title'],
          id: targetWItem.id,
          number: targetWItem.attributes['system.number'],
          state: targetWItem.attributes['system.state']
        },
        linkType: linkType.attributes.forward_name
      };
    } else {
      // Setting source info from the data in included
      let sourceWItem = includes.find(
        (i: any) => i.type == 'workitems' && i.id == link.relationships.source.data.id
      );

      link.relationalData = {
        target: {
          title: wItem.attributes['system.title'],
          id: wItem.id,
          number: wItem.attributes['system.number'],
          state: wItem.attributes['system.state']
        },
        source: {
          title: sourceWItem.attributes['system.title'],
          id: sourceWItem.id,
          number: sourceWItem.attributes['system.number'],
          state: sourceWItem.attributes['system.state']
        },
        linkType: linkType.attributes.reverse_name
      };
    }
    let lTypeIndex = wItem.relationalData.linkDicts.findIndex(i => i.linkName == link.relationalData.linkType);
    if ( lTypeIndex > -1) {
      // Add this link
      wItem.relationalData.linkDicts[lTypeIndex].count += 1;
      wItem.relationalData.linkDicts[lTypeIndex].links.splice( wItem.relationalData.linkDicts[lTypeIndex].links.length, 0, link);
    } else {
      // Create a new LinkDict item
      let newLinkDict = new LinkDict();
      newLinkDict.linkName = link.relationalData.linkType;
      newLinkDict.count = 1;
      newLinkDict.links = [link];
      wItem.relationalData.linkDicts.splice(0, 0, newLinkDict);
    }
  }


  /**
   * Usage: This function removes a link from a work item
   * Removes the link from relationalData
   * Updates the reference of workItem so doesn't return anything
   *
   * @param link: Link
   * @param wItem: WorkItem
   */
  removeLinkFromWorkItem(deletedLink: Link, wItem: WorkItem) {
    wItem.relationalData.totalLinkCount -= 1;
    wItem.relationalData.linkDicts.every((item: LinkDict, index: number): boolean => {
      let linkIndex = item.links.findIndex((link: Link) => link.id == deletedLink.id);
      if (linkIndex > -1) {
        item.links.splice(linkIndex, 1);
        if (!item.links.length) {
          wItem.relationalData.linkDicts.splice(index, 1);
        }
        return false;
      }
      return true;
    });
  }

  /**
   * Usage: Makes an API call to create a link
   * Recieves the new link response
   * Resolves and add the new link to the workItem
   *
   * @param link: Link - The new link object for request params
   * @returns Promise<Link>
   */
  createLink(link: Object): Observable<any> {
    if (this._currentSpace) {
      // FIXME: make the URL great again (when we know the right API URL for this)!
      this.linksUrl = this.baseApiUrl + 'workitemlinks';
      // this.linksUrl = currentSpace.links.self + '/workitemlinks';
      return this.http
        .post(this.linksUrl, JSON.stringify(link))
        .map(response => [response.json().data as Link, response.json().included]);
        // .catch ((e) => {
        //   if (e.status === 401) {
        //     this.auth.logout();
        //   } else {
        //     this.handleError(e);
        //   }
        // });
    } else {
      return Observable.of<Link>( {} as Link );
    }
  }

  /**
   * Usage: Makes an API call to delete a link
   * Removes the new link to the workItem
   *
   * @param link: Link
   * @param currentWiId: string - The work item ID where the link is created
   * @returns Promise<void>
   */
  deleteLink(link: any, currentWiId: string): Observable<void> {
    if (this._currentSpace) {
      // FIXME: make the URL great again (when we know the right API URL for this)!
      this.linksUrl = this.baseApiUrl + 'workitemlinks';
      // this.linksUrl = currentSpace.links.self + '/workitemlinks';
      const url = `${this.linksUrl}/${link.id}`;
      return this.http
        .delete(url)
        .map(response => {} );
        // .catch ((e) => {
        //   if (e.status === 401) {
        //     this.auth.logout();
        //   } else {
        //     this.handleError(e);
        //   }
        // });
    }
  }

  searchLinkWorkItem(term: string): Observable<WorkItem[]> {
    if (this._currentSpace) {
      // FIXME: make the URL great again (when we know the right API URL for this)!
      // search within selected space
      let searchUrl = this.baseApiUrl + 'search?spaceID=' + this._currentSpace.id + '&q=' + term;
      //let searchUrl = currentSpace.links.self + 'search?q=' + term;
      return this.http
          .get(searchUrl)
          .map((response) => response.json().data as WorkItem[])
          // .catch ((e) => {
          //   if (e.status === 401) {
          //     this.auth.logout();
          //   } else {
          //     this.handleError(e);
          //   }
          // });
    } else {
      return Observable.of<WorkItem[]>( [] as WorkItem[] );
    }
  }

  /**
   * Usage: Make a API call to save
   * the order of work item.
   *
   * @param workItemId: string
   */
  reOrderWorkItem(workItem: WorkItem, prevWiId: string | null = null, direction: string): Observable<any> {
    let newWItem = new WorkItem();
    let arr = [];
    newWItem.id = workItem.id.toString();
    newWItem.attributes = new Map<string, string | number>();
    newWItem.attributes['version'] = workItem.attributes['version'];
    newWItem.type = workItem.type;
    arr.push(newWItem);

    if (this._currentSpace) {
      let url = `${this._currentSpace.links.self}/workitems/reorder`;
      return this.http
        .patch(url, JSON.stringify({data: arr, position: {direction: direction, id: prevWiId}}))
        .map(response => {
          let updatedWorkItem: WorkItem = response.json().data[0] as WorkItem;
          return updatedWorkItem;
        });
        // .catch ((e) => {
        //   if (e.status === 401) {
        //     this.auth.logout();
        //   } else {
        //     this.handleError(e);
        //   }
        // });
    } else {
      Observable.throw('No space selected');
    }
  }

  renderMarkDown(markDownText: string): Observable<any> {
    let params = {
      data: {
        attributes: {
          content: markDownText,
          markup: 'Markdown'
        },
        type: 'rendering'
      }
    };

    if (this._currentSpace) {
      // FIXME: make the URL great again (when we know the right API URL for this)!
      this.renderUrl = this.baseApiUrl + 'render';
      // this.renderUrl = currentSpace.links.self + '/render';
      return this.http
        .post(this.renderUrl, JSON.stringify(params))
        .map(response => response.json().data.attributes.renderedContent)
        // .catch ((e) => {
        //   if (e.status === 401) {
        //     this.auth.logout();
        //   } else {
        //     this.handleError(e);
        //   }
        // });
    } else {
      return Observable.of<any>( {} as any );
    }
  }
}
