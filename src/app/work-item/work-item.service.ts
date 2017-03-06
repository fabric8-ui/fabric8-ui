import { Injectable, Component, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { cloneDeep } from 'lodash';
import { DropdownOption } from 'ngx-widgets';
import {
  AuthenticationService,
  Broadcaster,
  Logger,
  User,
  UserService
} from 'ngx-login-client';
import { Space } from 'ngx-fabric8-wit';
import { WIT_API_URL } from 'ngx-fabric8-wit';

import {
  Comment,
  Comments,
  CommentPost
} from '../models/comment';
import { AreaModel } from '../models/area.model';
import { AreaService } from '../area/area.service';
import { IterationModel } from '../models/iteration.model';
import { IterationService } from '../iteration/iteration.service';
import { LinkType } from '../models/link-type';
import { Link } from '../models/link';
import {
  LinkDict,
  WorkItem,
  WorkItemAttributes
} from '../models/work-item';
import { WorkItemType } from './../models/work-item-type';

import { MockHttp } from '../shared/mock-http';

@Injectable()
export class WorkItemService {

  private workItemUrl: string = null;
  private workItemTypeUrl: string = null;
  private linkTypesUrl: string = null;
  private linksUrl: string = null;
  private reorderUrl: string = null;
  private baseSearchUrl: string = null;
  private renderUrl: string = null;

  private headers = new Headers({'Content-Type': 'application/json'});
  private availableStates: DropdownOption[] = [];
  public workItemTypes: WorkItemType[] = [];

  // FIXME: this is the live list of work items, held in this instance of
  // workItemService. This prevents us from displaying two different lists of WIs.
  // This might have to change in the future.
  private workItems: WorkItem[] = [];
  private nextLink: string = null;
  private initialWorkItemFetchDone = false;
  private userIdMap = {};
  private workItemIdIndexMap = {};
  private prevFilters: any = [];
  private iterations: IterationModel[] = [];
  public _currentSpace;

  constructor(private http: Http,
    private broadcaster: Broadcaster,
    private logger: Logger,
    private areaService: AreaService,
    private auth: AuthenticationService,
    private iterationService: IterationService,
    private userService: UserService,
    @Inject(WIT_API_URL) private baseApiUrl: string)
  {
    this.broadcaster.on<Space>('spaceChanged').subscribe(val => this._currentSpace = val);
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
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

  getChildren(parent: WorkItem): Promise<WorkItem[]> {
    if (parent.relationships.childs) {
      this.logger.log('Requesting children for work item ' + parent.id);
      let url = parent.relationships.childs.links.related;
      return this.http
        .get(url, { headers: this.headers })
        .toPromise()
        .then(response => {
          let wItems: WorkItem[];
          wItems = response.json().data as WorkItem[];
          wItems.forEach((item) => {
            // Resolve the assignee and creator
            this.resolveUsersForWorkItem(item);
            this.resolveIterationForWorkItem(item);
            this.resolveType(item);
            this.resolveAreaForWorkItem(item);
          });
          return wItems;
        })
        .catch ((e) => {
          if (e.status === 401) {
            this.auth.logout();
          } else {
            this.handleError(e);
          }
        });
    } else {
      this.logger.log('Work item does not have child related link, skipping: ' + parent.id);
      return Observable.of([]).toPromise();
    }
  }

  /**
   * We maintain a big list of work WorkItem
   * We also maintain a Map of the index and WorkItem.id in another object for easy access
   */

  /**
   * We call this function from the list page to get first initial set of data
   * Add the data to workItems array
   * Resolve the users for work item as in get the details of assignee and creator
   * and store them with the data in the array
   */
  getWorkItems(pageSize: number = 20, filters: any[] = [], onlyResponse: boolean = false): Promise<WorkItem[]> {
    if (this._currentSpace) {
      // FIXME: make the URL great again (when we know the right API URL for this)!
      this.workItemUrl = this.baseApiUrl + 'workitems';
      //this.workItemUrl = currentSpace.links.self + '/workitems';
      this.nextLink = null;
      let url = this.workItemUrl + '?page[limit]=' + pageSize;
      filters.forEach((item) => {
        if (item.active) {
          url += '&' + item.paramKey + '=' + item.value;
        }
      });
      // Reseting stored data
      // if filter value is changed
      if (JSON.stringify(this.prevFilters) != JSON.stringify(filters)) {
        this.resetWorkItemList();
      }
      // Setting current filter as previous filter value
      this.prevFilters = cloneDeep(filters);

      return this.http
        .get(url, { headers: this.headers })
        .toPromise()
        .then(response => {
          // Build the user - id map
          this.buildUserIdMap();
          let wItems: WorkItem[];
          let links = response.json().links;
          if (links.hasOwnProperty('next')) {
            this.nextLink = links.next;
          }
          wItems = response.json().data as WorkItem[];
          wItems.forEach((item) => {
            // Resolve the assignee and creator
            this.resolveUsersForWorkItem(item);
            this.resolveIterationForWorkItem(item);
            this.resolveType(item);
            this.resolveAreaForWorkItem(item);
          });
          // Update the existing workItem big list with new data
          this.updateWorkItemBigList(wItems);

          // Boradcast that the big list is prepared initially
          this.broadcaster.broadcast('list_first_load_done');

          return onlyResponse ? wItems : this.workItems;
        })
        .catch ((e) => {
          if (e.status === 401) {
            this.auth.logout();
          } else {
            this.handleError(e);
          }
        });
    } else {
      return Promise.resolve<WorkItem[]>( [] as WorkItem[] );
    }
  }

  // Reset work item big list
  resetWorkItemList() {
    this.workItems = [];
    this.workItemIdIndexMap = {};
  }

  isListLoaded() {
    return !!this.workItems.length;
  }

  /**
   * This function is called from next page onwards in the scroll
   * It does pretty much same as the getWorkItems function
   */
  getMoreWorkItems(): Promise<any> {
    if (this.nextLink) {
      return this.http
      .get(this.nextLink, { headers: this.headers })
      .toPromise()
      .then(response => {
        this.buildUserIdMap();
        let links = response.json().links;
        if (links.hasOwnProperty('next')) {
          this.nextLink = links.next;
        } else {
          this.nextLink = null;
        }
        let newWorkItems: WorkItem[] = response.json().data as WorkItem[];
        newWorkItems.forEach((item) => {
          // Resolve the assignee and creator
          this.resolveUsersForWorkItem(item);
          this.resolveIterationForWorkItem(item);
          this.resolveType(item);
          this.resolveAreaForWorkItem(item);
        });
        let newItems = cloneDeep(newWorkItems);
        // Update the existing workItem big list with new data
        this.updateWorkItemBigList(newItems);
        return newWorkItems;
      })
      .catch ((e) => {
        if (e.status === 401) {
          this.auth.logout();
        } else {
          this.handleError(e);
        }
      });
    } else {
      return Promise.reject('No more item found');
    }
  }

  getNextLink(): string {
    return this.nextLink;
  }

  setNextLink(link: string): void {
    this.nextLink = link;
  }

  /**
   * Usage: This method gives a single work item by ID.
   * If the item is locally available then it just resolves the comments
   * else it fetches that item from the cloud and then resolves the comments
   * then update the big list of work WorkItem
   *
   * @param: number - id
   */
  getWorkItemById(id: string): Promise<WorkItem> {
    if (id in this.workItemIdIndexMap) {
      let wItem = this.workItems[this.workItemIdIndexMap[id]];
      this.resolveComments(wItem);
      this.resolveLinks(wItem);
      return Promise.resolve(wItem);
    } else {
      this.buildUserIdMap();
      if (this._currentSpace) {
        // FIXME: make the URL great again (when we know the right API URL for this)!
        this.workItemUrl = this.baseApiUrl + 'workitems';
        // this.workItemUrl = currentSpace.links.self + '/workitems';
        return this.http
          .get(this.workItemUrl + '/' + id, { headers: this.headers })
          .toPromise()
          .then((response) => {
            let wItem: WorkItem = response.json().data as WorkItem;
            this.resolveUsersForWorkItem(wItem);
            this.resolveIterationForWorkItem(wItem);
            this.resolveType(wItem);
            this.resolveAreaForWorkItem(wItem);
            // If this work item matches with current filters
            // it goes to the big list and then we call this function
            // again to treat it as a locally saved item
            if (!(wItem.id in this.workItemIdIndexMap) && this.doesMatchCurrentFilter(wItem)) {
              this.workItems.splice(this.workItems.length, 0, wItem);
              this.buildWorkItemIdIndexMap();
              return this.getWorkItemById(wItem.id);
            }

            // If this work item doesn't match with current filters
            // it's not get added to the big list so not storing locally
            // it just gets resolved with related data and returned
            this.resolveComments(wItem);
            this.resolveLinks(wItem);
            return wItem;
          })
          .catch ((e) => {
            if (e.status === 401) {
              this.auth.logout();
            } else {
              this.handleError(e);
            }
          });
      } else {
        return Promise.resolve<WorkItem>( {} as WorkItem );
      }
    }
  }

  /**
   * Usage: to check if the workitem match with current filter or not.
   * @param WorkItem - workItem
   * @returns Boolean
   */
  doesMatchCurrentFilter(workItem: WorkItem): Boolean {
    if (this.prevFilters.length) {
      for (let i = 0; i < this.prevFilters.length; i++) {
        // In case of assignee filter
        if (this.prevFilters[i].id === 1 && this.prevFilters[i].active) {
          if (!workItem.relationships.assignees.data // If un-assigned
              || workItem.relationships.assignees.data.findIndex(item => item.id == this.prevFilters[i].value) === -1 // If assignee is not current
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * Usage: to update the big list of workItem with new data
   * Existing item will be updated only with attributes
   * New item will be added to the list
   */
  updateWorkItemBigList(wItems: WorkItem[]): void {
    wItems.forEach((wItem) => {
      if (wItem.id in this.workItemIdIndexMap) {
        this.workItems[this.workItemIdIndexMap[wItem.id]].attributes =
          cloneDeep(wItem.attributes);
      } else {
        this.workItems
          .splice(this.workItems.length, this.workItems.length, wItem);
      }
    });
    // Re-build the map once done updating the list
    this.buildWorkItemIdIndexMap();
  }

  /**
   * Usage: Build the workItem ID-Index map for the big list
   */
  buildWorkItemIdIndexMap() {
    this.workItemIdIndexMap = {};
    this.workItems.forEach((wItem, index) =>
      this.workItemIdIndexMap[wItem.id] = index);
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
    if (!workItem.relationships.hasOwnProperty('baseType') || !workItem.relationships.baseType) {
      workItem.relationalData.wiType = null;
      return;
    }
    if (!workItem.relationships.baseType.hasOwnProperty('data')) {
      workItem.relationalData.wiType = null;
      return;
    }
    if (!workItem.relationships.baseType.data) {
      workItem.relationalData.wiType = null;
      return;
    }
    this.getWorkItemTypesById(workItem.relationships.baseType.data.id)
      .then((type: WorkItemType) => {
        workItem.relationalData.wiType = type;
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
      .then((iteration) => workItem.relationalData.iteration = iteration);
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
    workItem.relationalData.area = this.getAreaById(workItem.relationships.area.data.id);
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
  getAreaById(areaId: string): AreaModel {
    let areas: AreaModel[] = this.areaService.areas;
    return areas.filter(item => item.id == areaId)[0];
  }

  /**
   * Usage: Fetch an iteration by it's ID from the iterations list
   */
  getIterationById(iterationId: string): Promise<IterationModel> {
    return this.iterationService.getIterations().then((iterations) => {
      return iterations.find(item => item.id == iterationId);
    });
  }

  /**
   * This is to fetch locally fetched work items
   * this will eventually be deprecated once work item
   * linking is re-worked
   */
  getLocallySavedWorkItems(): Promise<any> {
    return Promise.resolve(this.workItems);
  }

  /**
   * Usage: This method is to resolve the comments for a work item
   * This method is only called when a single item is fetched for the
   * details page.
   *
   * @param: WorkItem - wItem
   */
  resolveComments(wItem: WorkItem): void {
    if (wItem.relationships.comments.links.related)
      this.http
        .get(wItem.relationships.comments.links.related, { headers: this.headers })
        .toPromise()
        .then((response) => {
          wItem.relationalData.comments =
            response.json().data as Comment[];
          wItem.relationalData.comments.forEach((comment) => {
            comment.relationalData = {
              creator : this.getUserById(comment.relationships['created-by'].data.id)
            };
          });
        })
        .catch ((e) => {
          if (e.status === 401) {
            this.auth.logout();
          } else {
            this.handleError(e);
          }
        });
  }

  /**
   * Usage: This method is to resolve the linked items for a work item
   * This method is only called when a single item is fetched for the
   * details page.
   *
   * @param: WorkItem - wItem
   */
  resolveLinks(wItem: WorkItem): void {
    wItem.relationalData.linkDicts = null;
    wItem.relationalData.totalLinkCount = 0;
    this.http
      .get(wItem.links.self + '/relationships/links', { headers: this.headers })
      .toPromise()
      .then((response) => {
        let links = response.json().data as Link[];
        let includes = response.json().included;
        let linkDicts: LinkDict[] = [];
        // Prepare relational data for links
        wItem.relationalData.linkDicts = [];
        links.forEach((link) => {
          this.addLinkToWorkItem(link, includes, wItem);
        });
      })
      .catch ((e) => {
        if (e.status === 401) {
          this.auth.logout();
        } else {
          wItem.relationalData.linkDicts = [];
          this.handleError(e);
        }
      });
  }

  /**
   * Usage: This method is to fetch the work item types
   * This method will be deprecated and types will come from
   * router resolver
   * ToDo: Use router resolver to fetch types here
   */
  getWorkItemTypes(): Promise<any[]> {
    if (this._currentSpace) {
      // FIXME: make the URL great again (when we know the right API URL for this)!
      this.workItemTypeUrl = this.baseApiUrl + 'workitemtypes';
      //this.workItemTypeUrl = currentSpace.links.self + '/workitemtypes';
      return this.http
        .get(this.workItemTypeUrl)
        .toPromise()
        .then((response) => {
          this.workItemTypes = response.json().data as WorkItemType[];
          return this.workItemTypes;
        })
      .catch ((e) => {
        if (e.status === 401) {
          this.auth.logout();
        } else {
          this.handleError(e);
        }
      });
    } else {
      return Promise.resolve<WorkItemType[]>( [] as WorkItemType[] );
    }
  }

  /**
   * Usage: This method is to fetch the work item types by ID
   */

  getWorkItemTypesById(id: string): Promise<WorkItemType> {
    if (this._currentSpace) {
      let workItemType = this.workItemTypes ? this.workItemTypes.find((type) => type.id === id) : null;
      if (workItemType) {
        return Promise.resolve(workItemType);
      } else {
        let workItemTypeUrl = this.baseApiUrl + 'workitemtypes/' + id;
        return this.http.get(workItemTypeUrl)
          .toPromise()
          .then((response) => {
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
          });
        // FIXME: Use observavble instead promise
        // Can't use observable now, because the mock will not support that
        // .map((response) => {
        //   workItemType = response.json().data as WorkItemType;
        //   this.workItemTypes.push(workItemType);
        //   return workItemType;
        // })
        // .toPromise();
      }
    } else {
      return Promise.resolve<WorkItemType>( {} as WorkItemType );
    }
  }

  /**
   * Usage: This method is to fetch the work item states
   * This method will be deprecated and states will come from
   * router resolver
   * ToDo: Use router resolver to fetch states here
   */
  getStatusOptions(): Promise<any[]> {
    if (this.availableStates.length) {
      return new Promise((resolve, reject) => {
        resolve(this.availableStates);
      });
    } else {
      return this.getWorkItemTypes()
        .then((response) => {
          this.availableStates = response[0].attributes.fields['system.state'].type.values.map((item: string, index: number) => {
            return {
              option: item,
            };
          });
          return this.availableStates;
        })
        .catch ((e) => {
          if (e.status === 401) {
            this.auth.logout();
          } else {
            this.handleError(e);
          }
        });
    }
  }

  /**
   * Usage: This method is to move an item over the list
   * ToDo: Integrate backend when available, also move by one
   * place should be implemented
   */
  moveItem(wi: WorkItem, dir: String): Promise<any> {
    let index = this.workItems.findIndex(x => x.id == wi.id);
    wi.attributes.nextitem = '';
    wi.attributes.previousitem = '';
    switch (dir){
      case 'top':
        //move the item as the first item
        this.workItems.splice(0, 0, wi);
        //remove the duplicate element
        this.workItems.splice( index + 1, 1);
        wi.attributes.nextitem = parseInt(this.workItems[1].id);
        break;
      case 'bottom':
        //move the item as the last of the loaded list
        this.workItems.splice((this.workItems.length), 0, wi);
        //remove the duplicate element
        this.workItems.splice( index, 1);
        wi.attributes.previousitem = parseInt(this.workItems[this.workItems.length-2].id);
        break;
      case 'up':
        if (index > 0) { //no moving of element if it is the first element
          //move the work item up by 1. Below statement will create two elements
          this.workItems.splice( index - 1 , 0, wi);
          //remove the duplicate element
          this.workItems.splice( index + 1, 1);
          //Set the previous and next WI ids
          wi.attributes.nextitem = parseInt(this.workItems[index].id);
          //If the element has been moved and becomes the first element
          // it will not have a previous value
          if (index !== 1) {
            wi.attributes.previousitem = parseInt(this.workItems[index - 2].id);
          }
        }
        break;
      case 'down':
        if ( index < (this.workItems.length - 1) ) { //no moving of elements if it is the last element
          //move the work item down by 1. Below statement will create two elements
          this.workItems.splice( index + 2 , 0, wi);
          //remove the duplicate element
          this.workItems.splice( index, 1);
          //Set the previous and next WI ids
          wi.attributes.previousitem = parseInt(this.workItems[index].id);
          //If the element has been moved and becomes the last element
          // it will not have a next value
          if ((index + 2) !== this.workItems.length) {
            wi.attributes.nextitem = parseInt(this.workItems[index + 2].id);
          }
        }
        break;
    }
    //console.log(wi.attributes.previousitem, ':' , wi.attributes.nextitem);
    //build the map to reset the indices
    this.buildWorkItemIdIndexMap();
    return Promise.resolve();
    /*
    return this.http
      .patch(this.reorderUrl, JSON.stringify({data: wi}), { headers: this.headers })
      .toPromise()
      .then(response => {
        //Reusing the update code to update the element locally
        let updatedWorkItem = response.json().data as WorkItem;
        // Find the index in the big list
        let updateIndex = this.workItems.findIndex(item => item.id == updatedWorkItem.id);
        if (updateIndex > -1) {
          // Update work item attributes
          this.workItems[updateIndex].attributes = updatedWorkItem.attributes;
          this.workItems[updateIndex].relationships.baseType = updatedWorkItem.relationships.baseType;
          // Resolve users for the updated item
          this.resolveUsersForWorkItem(this.workItems[updateIndex]);
          this.resolveIterationForWorkItem(this.workItems[updateIndex]);
        } else {
          // This part is for mock service in unit test
          // this.workItems stays in case of unit test
          // Resolve users for the updated item
          this.resolveUsersForWorkItem(updatedWorkItem);
          this.resolveIterationForWorkItem(updatedWorkItem);
        }
        return updatedWorkItem;
      })
      .catch (this.handleError);*/
  }

  /**
   * Usage: This method deletes an item
   * removes the delted item from the big list
   * re build the ID-Index map
   *
   * @param: WorkItem - workItem (Item to be delted)
   */
  delete(workItem: WorkItem): Promise<void> {
    return this.http
      .delete(workItem.links.self, { headers: this.headers, body: '' })
      .toPromise()
      .then(() => {
        let deletedItemIndex = this.workItems.findIndex((item) => item.id == workItem.id);
        // removing deleted item from the local list
        this.workItems.splice(deletedItemIndex, 1);
        // Re build the workItem ID-Index map
        this.buildWorkItemIdIndexMap();
      })
      .catch ((e) => {
        if (e.status === 401) {
          this.auth.logout();
        } else {
          this.handleError(e);
        }
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
  create(workItem: WorkItem): Promise<WorkItem> {
    let payload = JSON.stringify({data: workItem});
    if (this._currentSpace) {
      // FIXME: make the URL great again (when we know the right API URL for this)!
      this.workItemUrl = this.baseApiUrl + 'workitems';
      // this.workItemUrl = currentSpace.links.self + '/workitems';
      return this.http
        .post(this.workItemUrl, payload, { headers: this.headers })
        .toPromise()
        .then(response => {
          let newWorkItem: WorkItem = response.json().data as WorkItem;
          // Resolve the user for the new item
          this.resolveUsersForWorkItem(newWorkItem);
          this.resolveIterationForWorkItem(newWorkItem);
          this.resolveType(newWorkItem);
          this.resolveAreaForWorkItem(newWorkItem);
          // Add newly added item to the top of the list
          this.workItems.splice(0, 0, newWorkItem);
          // Re-build the ID-index map
          this.buildWorkItemIdIndexMap();
          return newWorkItem;
        })
        .catch ((e) => {
          if (e.status === 401) {
            this.auth.logout();
          } else {
            this.handleError(e);
          }
        });
    } else {
      return Promise.resolve<WorkItem>( {} as WorkItem );
    }
  }

  /**
   * Usage: This method update an existing item
   * updates the item in the big list
   * resolve the users for the item
   *
   * @param: WorkItem - workItem (Item to be created)
   */
  update(workItem: WorkItem): Promise<WorkItem> {
    return this.http
      .patch(workItem.links.self, JSON.stringify({data: workItem}), { headers: this.headers })
      .toPromise()
      .then(response => {
        let updatedWorkItem = response.json().data as WorkItem;
        // Find the index in the big list
        let updateIndex = this.workItems.findIndex(item => item.id == updatedWorkItem.id);
        //Item is in the list
        if (updateIndex > -1) {
          if (this.doesMatchCurrentFilter(updatedWorkItem)) {
            // Update work item attributes
            this.workItems[updateIndex].attributes = updatedWorkItem.attributes;
            this.workItems[updateIndex].relationships.assignees = updatedWorkItem.relationships.assignees;
            this.workItems[updateIndex].relationships.creator = updatedWorkItem.relationships.creator;
            this.workItems[updateIndex].relationships.baseType = updatedWorkItem.relationships.baseType;
            this.workItems[updateIndex].relationships.iteration = updatedWorkItem.relationships.iteration;
            // Resolve users for the updated item
            this.resolveUsersForWorkItem(this.workItems[updateIndex]);
            this.resolveIterationForWorkItem(this.workItems[updateIndex]);
            this.resolveType(this.workItems[updateIndex]);
            this.resolveAreaForWorkItem(this.workItems[updateIndex]);
          } else {
            // Remove the item from the list
            this.workItems.splice(updateIndex, 1);
            this.buildWorkItemIdIndexMap();
          }
        } else {
          //Item is not in the list
          this.workItems.splice(0, 0, updatedWorkItem);
          this.buildWorkItemIdIndexMap();
          // This part is for mock service in unit test
          // this.workItems stays in case of unit test
          // Resolve users for the updated item
          this.resolveUsersForWorkItem(updatedWorkItem);
          this.resolveIterationForWorkItem(updatedWorkItem);
          this.resolveType(updatedWorkItem);
        }
        return updatedWorkItem;
      })
      .catch ((e) => {
        if (e.status === 401) {
          this.auth.logout();
        } else {
          this.handleError(e);
        }
      });
  }

  /**
   * Usage: This method create a comment for a workItem
   *
   * @param: string - id (Work Item ID)
   * @param: Comment
   */
  createComment(id: string, comment: Comment): Promise<Comment> {
    let c = new CommentPost();
    c.data = comment;
    return this.http
      .post(this.workItems[this.workItemIdIndexMap[id]]
              .relationships.comments.links.related, c, { headers: this.headers })
      .toPromise()
      .then(response => {
        let comment: Comment = response.json().data as Comment;
        comment.relationalData = {
          creator : this.getUserById(comment.relationships['created-by'].data.id)
        };
        this.workItems[this.workItemIdIndexMap[id]]
          .relationalData
          .comments.unshift(comment);
        return comment;
      })
      .catch (this.handleError);
  }

  updateComment(comment: Comment): Promise<Comment> {
    let endpoint = comment.links.self;
    return this.http
      .patch(endpoint, { 'data': comment }, { headers: this.headers })
      .toPromise()
      .then(response => {
        let comment: Comment = response.json().data as Comment;
        let theUser: User = this.userService.getSavedLoggedInUser();
        comment.relationalData = { 'creator' : theUser };
        return comment;
      })
      .catch (this.handleError);
  }

  /**
   * Usage: This function fetches all the work item link types
   * Store it in an instance variable
   *
   * @return Promise of LinkType[]
   */
  getLinkTypes(workItem: WorkItem): Promise<Object> {
    return new Promise((resolve) => {
      let linkTypes: Object = {};
      this.http
        .get(workItem.links.sourceLinkTypes, {headers: this.headers})
        .toPromise()
        .then(response => {
          linkTypes['forwardLinks'] = response.json().data as LinkType[];
          this.http
            .get(workItem.links.targetLinkTypes, {headers: this.headers})
            .toPromise()
            .then(response => {
              linkTypes['backwardLinks'] = response.json().data as LinkType[];
              resolve(linkTypes);
            }).catch ((e) => {
              if (e.status === 401) {
                this.auth.logout();
              } else {
                this.handleError(e);
              }
            });
        }).catch ((e) => {
          if (e.status === 401) {
            this.auth.logout();
          } else {
            this.handleError(e);
          }
        });
    });
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
          state: wItem.attributes['system.state']
        },
        target: {
          title: targetWItem.attributes['system.title'],
          id: targetWItem.id,
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
          state: wItem.attributes['system.state']
        },
        source: {
          title: sourceWItem.attributes['system.title'],
          id: sourceWItem.id,
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
  removeLinkFromWorkItem(deletedLink: Link, wiId: string) {
    let wItem = this.workItems[this.workItemIdIndexMap[wiId]];
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
    })
  }

  /**
   * Usage: Makes an API call to create a link
   * Recieves the new link response
   * Resolves and add the new link to the workItem
   *
   * @param link: Link - The new link object for request params
   * @param currentWiId: string - The work item ID where the link is created
   * @returns Promise<Link>
   */
  createLink(link: Object, currentWiId: string): Promise<Link> {
    if (this._currentSpace) {
      // FIXME: make the URL great again (when we know the right API URL for this)!
      this.linksUrl = this.baseApiUrl + 'workitemlinks';
      // this.linksUrl = currentSpace.links.self + '/workitemlinks';
      return this.http
        .post(this.linksUrl, JSON.stringify(link), {headers: this.headers})
        .toPromise()
        .then(response => {
          let newLink: Link = response.json().data as Link;
          let includes = response.json().included as Link;
          let wItem = this.workItems[this.workItemIdIndexMap[currentWiId]];
          this.addLinkToWorkItem(newLink, includes, wItem);
          return newLink;
        })
        .catch ((e) => {
          if (e.status === 401) {
            this.auth.logout();
          } else {
            this.handleError(e);
          }
        });
    } else {
      return Promise.resolve<Link>( {} as Link );
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
  deleteLink(link: any, currentWiId: string): Promise<void> {
    if (this._currentSpace) {
      // FIXME: make the URL great again (when we know the right API URL for this)!
      this.linksUrl = this.baseApiUrl + 'workitemlinks';
      // this.linksUrl = currentSpace.links.self + '/workitemlinks';
      const url = `${this.linksUrl}/${link.id}`;
      return this.http
        .delete(url, {headers: this.headers})
        .toPromise()
        .then(response => { this.removeLinkFromWorkItem(link, currentWiId) })
        .catch ((e) => {
          if (e.status === 401) {
            this.auth.logout();
          } else {
            this.handleError(e);
          }
        });
    }
  }

  searchLinkWorkItem(term: string, workItemType: string): Promise<WorkItem[]> {
    if (this._currentSpace) {
      // FIXME: make the URL great again (when we know the right API URL for this)!
      let searchUrl = this.baseApiUrl + 'search?q=' + term + ' type:' + workItemType;
      //let searchUrl = currentSpace.links.self + 'search?q=' + term + ' type:' + workItemType;
      return this.http
          .get(searchUrl)
          .toPromise()
          .then((response) => response.json().data as WorkItem[])
          .catch ((e) => {
            if (e.status === 401) {
              this.auth.logout();
            } else {
              this.handleError(e);
            }
          });
    } else {
      return Promise.resolve<WorkItem[]>( [] as WorkItem[] );
    }
  }

  /**
   * It return object of adjacent work item id
   * {
   *  prevItemId: previous work item id
   *  nextItemId: next work item id
   * }
   *
   * @param workItemId: string
   */
  getAdjacentWorkItemsIdById(workItemId: string): any {
    let wiIndex = this.workItemIdIndexMap[workItemId];
    let prevItemId = '';
    let nextItemId = '';
    if(wiIndex > 0){
      prevItemId = this.workItems[wiIndex - 1].id;
    }

    if(wiIndex < this.workItems.length - 1) {
      nextItemId = this.workItems[wiIndex + 1].id;
    }

    let adjacentWorkItem = {
      prevItemId: prevItemId,
      nextItemId: nextItemId
    };
    return adjacentWorkItem;
  }

  /**
   * Usage: Make a API call to save
   * the order of work item.
   *
   * @param workItemId: string
   */
  reOrderWorkItem(workItemId: string): Promise<void> {
    let newWItem = new WorkItem();
    let wiIndex = this.workItemIdIndexMap[workItemId];
    let wItem = this.workItems[wiIndex];

    // Get the adjacent work items
    let adjacentWI = this.getAdjacentWorkItemsIdById(workItemId);

    newWItem.id = workItemId.toString();
    newWItem.attributes = {} as WorkItemAttributes;
    newWItem.attributes.version = wItem.attributes.version;
    newWItem.type = wItem.type;
    newWItem.attributes.previousitem = parseInt(adjacentWI.prevItemId);
    newWItem.attributes.nextitem = parseInt(adjacentWI.nextItemId);

    if (this._currentSpace) {
      // FIXME: make the URL great again (when we know the right API URL for this)!
      this.workItemUrl = this.baseApiUrl + 'workitems';
      // this.workItemUrl = currentSpace.links.self + '/workitems';
      let url = `${this.workItemUrl}/reorder`;
      return this.http
        .patch(url, JSON.stringify({data: newWItem}), { headers: this.headers })
        .toPromise()
        .then(response => {
          let updatedWorkItem: WorkItem = response.json().data as WorkItem;
          wItem.attributes['version'] = updatedWorkItem.attributes['version'];
          wItem.attributes['order'] = updatedWorkItem.attributes['order'];
        })
        .catch ((e) => {
          if (e.status === 401) {
            this.auth.logout();
          } else {
            this.handleError(e);
          }
        });
    }
  }

  renderMarkDown(markDownText: string): Promise<any> {
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
        .post(this.renderUrl, JSON.stringify(params), { headers: this.headers })
        .toPromise()
        .then(response => response.json().data.attributes.renderedContent)
        .catch ((e) => {
          if (e.status === 401) {
            this.auth.logout();
          } else {
            this.handleError(e);
          }
        });
    } else {
      return Promise.resolve<any>( {} as any );
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
