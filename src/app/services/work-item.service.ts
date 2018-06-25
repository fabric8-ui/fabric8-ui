import { Inject, Injectable } from '@angular/core';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import 'rxjs/operators/map';
import { Subject } from 'rxjs/Subject';

import { Logger } from 'ngx-base';
import { Spaces } from 'ngx-fabric8-wit';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import {
  User,
  UserService
} from 'ngx-login-client';

import {
  Comment,
  CommentPost
} from '../models/comment';

import { AreaModel } from '../models/area.model';
import { Link } from '../models/link';
import {
  WorkItem,
  WorkItemService as WIService
} from '../models/work-item';
import { WorkItemType } from '../models/work-item-type';
import { AreaService } from './area.service';
import { HttpService } from './http-service';

@Injectable()
export class WorkItemService {

  private workItemUrl: string = null;
  private renderUrl: string = null;

  public workItemTypes: WorkItemType[] = [];
  public _currentSpace;

  private selfId;

  public addWIObservable: Subject<any> = new Subject();
  public addWIChildObservable: Subject<any> = new Subject();
  public editWIObservable: Subject<WorkItem> = new Subject();
  public selectedWIObservable: Subject<WorkItem> = new Subject();
  public showTree: Subject<boolean> = new Subject();

  constructor(
    private http: HttpService,
    private logger: Logger,
    private areaService: AreaService,
    private userService: UserService,
    private spaces: Spaces,
    @Inject(WIT_API_URL) private baseApiUrl: string
  ) {
    this.spaces.current.subscribe(val => this._currentSpace = val);
    this.selfId = this.createId();
    this.logger.log('Launching WorkItemService instance id ' + this.selfId);
  }

  notifyError(message: string, httpError: any) {
    this.logger.log('ERROR [WorkItemService] ' + message + (httpError.message ? ' ' + httpError.message : ''));
  }

  createId(): string {
    let id = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    console.log('Created new id ' + id);
    return id;
  }

  /**
   * Takes a URL to the list of child
   * work items of a particular work item
   * and performs a get operation for all the child items
   * @param url url to the child work items
   */
  getChildren(url: string): Observable<WIService[]> {
    return this.http
      .get(url)
      .map(response => response.json().data as WIService[]);
  }

  /**
   * Usage: Performs a get operation on work items
   *
   * @param pageSize number of work items to be fetched
   * @param filters filters to the work items
   */
  getWorkItems(pageSize: number = 20, filters: object): Observable<{workItems: WorkItem[], nextLink: string, totalCount?: number | null, included?: WorkItem[] | null, ancestorIDs?: Array<string>}> {
    if (this._currentSpace) {
      let url = '';
      this.workItemUrl = this._currentSpace.links.self.split('spaces')[0] + 'search';
      url = this.workItemUrl + '?page[limit]=' + pageSize + '&' + Object.keys(filters).map(k => 'filter[' + k + ']=' + encodeURIComponent(JSON.stringify(filters[k]))).join('&');
      return this.http.get(url)
        .map((resp) => {
          return {
            workItems: resp.json().data as WorkItem[],
            nextLink: resp.json().links.next,
            totalCount: resp.json().meta ? resp.json().meta.totalCount : 0,
            included: resp.json().included ? resp.json().included as WorkItem[] : [],
            ancestorIDs: resp.json().meta.ancestorIDs ? resp.json().meta.ancestorIDs : []
          };
        }).catch((error: Error | any) => {
          this.notifyError('Getting work items failed.', error);
          return Observable.throw(new Error(error.message));
        });
    } else {
      return Observable.of<{workItems: WorkItem[], nextLink: string | null}>({workItems: [] as WorkItem[], nextLink: null});
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
            ancestorIDs: resp.json().meta.ancestorIDs ? resp.json().meta.ancestorIDs : []
          };
        }).catch((error: Error | any) => {
          this.notifyError('Getting more work items failed.', error);
          return Observable.throw(new Error(error.message));
        });
    } else {
      return Observable.throw('No more item found');
    }
  }

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
      return Observable.of<WorkItem>(new WorkItem());
    }
  }

  /**
   * Usage: This method is to get the events for a work item
   * This method is only called when a single item is fetched for the
   * details page.
   *
   * @param: WorkItem - wItem
   */
  getEvents(url: string): Observable<any> {
    return this.http
      .get(url)
      .map(response => {
        return response.json().data;
      });
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
      });
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
   * Usage: fetch all the work item types
   *
   * @param workItemTypeUrl : string
   */
  getWorkItemTypes(workItemTypeUrl: string): Observable<any[]> {
    return this.http
      .get(workItemTypeUrl)
      .map((response) => {
        let resultTypes = response.json().data as WorkItemType[];

        // THIS IS A HACK!
        for (let i = 0; i < resultTypes.length; i++) {
          if (resultTypes[i].id === '86af5178-9b41-469b-9096-57e5155c3f31') {
            resultTypes.splice(i, 1);
          }
        }

        this.workItemTypes = resultTypes;
        return this.workItemTypes;
      }).catch((error: Error | any) => {
        this.notifyError('Getting work item type information failed.', error);
        return Observable.throw(new Error(error.message));
      });
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
      .map(() => {return; });
  }

  /**
    * Usage: This method create a new item
    *
    * @param: url
    * @param: WorkItem - workItem (Item to be created)
  */
  create(url: string, workItem: WorkItem): Observable<WorkItem> {
    let payload = JSON.stringify({data: workItem});
      return this.http
        .post(url, payload)
        .map(response => {
          return response.json().data as WorkItem;
        });
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

  /**
   * Usage: to update comment pass in with the ID
   *
   * @param comment Comment type
   */
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

  /**
   * Usage: To delete a comment
   * @param comment Comment
   */
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

  /**
   * Usage: Makes an API call to create a link
   * Recieves the new link response
   * Resolves and add the new link to the workItem
   *
   * @param link: Link - The new link object for request params
   * @returns Promise<Link>
   */
  createLink(url: string, link: Object): Observable<any> {
    return this.http
      .post(url, JSON.stringify(link))
      .map(response => [response.json().data as Link, response.json().included]);
  }

  /**
   * Usage: Makes an API call to delete a link
   * Removes the new link to the workItem
   *
   * @param link: Link
   * @param currentWiId: string - The work item ID where the link is created
   * @returns Promise<void>
   */
  deleteLink(url: string, currentWiId: string): Observable<void> {
    return this.http
      .delete(url)
      .map(response => {});
  }

  searchLinkWorkItem(term: string): Observable<WorkItem[]> {
    if (this._currentSpace) {
      // FIXME: make the URL great again (when we know the right API URL for this)!
      // search within selected space
      let searchUrl = this.baseApiUrl + 'search?spaceID=' + this._currentSpace.id + '&q=' + term;
      //let searchUrl = currentSpace.links.self + 'search?q=' + term;
      return this.http
          .get(searchUrl)
          .map((response) => response.json().data as WorkItem[]);
    } else {
      return Observable.of<WorkItem[]>([] as WorkItem[]);
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
    } else {
      Observable.throw('No space selected');
    }
  }

  /**
   * Usage: This function is used to render markdown text in html
   * @param markDownText string
   */
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
        .map(response => response.json().data.attributes.renderedContent);
    } else {
      return Observable.of<any>({} as any);
    }
  }


  /**
   * All the soon to be deprecated method stays behind this line
   */

  /**
   * @deprecated Planner :: this property will be deprecated soon
   */
  private userIdMap = {};

  /**
   * @deprecated Planner :: this function will be deprecated soon
   * @function buildUserIdMap builds a ID-User map to dynamically access list of users
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
   * @deprecated Planner :: we save all the types in the store in a key - value pair.
   * Therefore, this function is not needed anymore.
   *
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
      return Observable.of<WorkItemType>({} as WorkItemType);
    }
  }

  /**
   * @deprecated Planner :: this method will be deprecated soon
   * Resolving relations is moved to querries
   *
   * Usage: Resolve the wi type for a WorkItem
   */
  resolveType(workItem: WorkItem): void {
    this.getWorkItemTypesById(workItem.relationships.baseType.data.id)
      .subscribe((type: WorkItemType) => {
        workItem.relationships.baseType.data = type;
    });
  }

  /**
   * @deprecated Planner :: this method will be deprecated soon
   * Usage: Fetch an area by it's ID from the areas list
   */
  getAreaById(areaId: string): Observable<AreaModel> {
    return this.areaService.getAreas().map((areas) => {
      return areas.find(item => item.id == areaId);
    });
  }

  /**
   * @deprecated Planner :: this method will be deprecated soon
   * Resolving relations is moved to querries
   *
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
   * @deprecated Planner ::
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
   * @deprecated Planner :: this method will be deprecated soon
   * Resolving relations is moved to querries
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
}
