import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { cloneDeep } from 'lodash';

import 'rxjs/add/operator/toPromise';

import { AuthenticationService } from '../auth/authentication.service';
import { DropdownOption } from '../shared-component/dropdown/dropdown-option';
import { Logger } from '../shared/logger.service';

import { WorkItem } from '../models/work-item';
import { WorkItemType } from './work-item-type';


@Injectable()
export class WorkItemService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private workItemUrl = process.env.API_URL + 'workitems';  // URL to web api
  private workItemTypeUrl = process.env.API_URL + 'workitemtypes';
  private availableStates: DropdownOption[] = [];
  public workItemTypes: WorkItemType[] = [];
  private workItems: WorkItem[] = [];
  private nextLink: string = null;
  private initialWorkItemFetchDone = false;

  constructor(private http: Http,
    private logger: Logger,
    private auth: AuthenticationService) {
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    logger.log('WorkItemService running in ' + process.env.ENV + ' mode.');
    logger.log('WorkItemService using url ' + this.workItemUrl);
  }

  getWorkItems(pageSize: number = 20): Promise<WorkItem[]> {
    let url = this.workItemUrl + '?page[limit]=' + pageSize;
    if (process.env.ENV == 'inmemory') {
      url = this.workItemUrl;
    }
    return this.http
      .get(url, { headers: this.headers })
      .toPromise()
      .then(response => {
        if (process.env.ENV == 'inmemory') {
          // Exclusively for in memory testing
          this.workItems = response.json().data as WorkItem[];
          this.workItems = this.workItems.reverse();
        } else {
          let links = response.json().links;
          if (links.hasOwnProperty('next')) {
            this.nextLink = links.next;
            console.log(this.nextLink);
          }
          this.workItems = response.json().data as WorkItem[];
        }
        return this.workItems;
      })
      .catch(this.handleError); 
  }

  getMoreWorkItems(): Promise<any> {
    console.log(this.nextLink);
    if (this.nextLink) {
      return this.http
      .get(this.nextLink, { headers: this.headers })
      .toPromise()
      .then(response => {
        let links = response.json().links;
        if (links.hasOwnProperty('next')) {
          this.nextLink = links.next;
        } else {
          this.nextLink = null;
        }
        return response.json().data as WorkItem[];
      })
      .catch(this.handleError);
    } else {
      return Promise.reject('No more item found');
    }
  }

  getLocallySavedWorkItems(): Promise<any> {
    return Promise.resolve(this.workItems);
  }

  getWorkItemTypes(): Promise<any[]> {
    if (this.workItemTypes.length) {
      return new Promise((resolve, reject) => {
        resolve(this.workItemTypes);
      });
    } else {
      return this.http
        .get(this.workItemTypeUrl)
        .toPromise()
        .then((response) => {
          this.workItemTypes = process.env.ENV != 'inmemory' ? response.json() as WorkItemType[] : response.json().data as WorkItemType[];
          return this.workItemTypes;
        })
        .catch (this.handleError);
    }
  }

  getWorkItem(id: string): Promise<WorkItem> {
    let url = this.workItemUrl;
    return this.http
      .get(url + '/' + id, { headers: this.headers })
      .toPromise()
      .then((response) => response.json().data as WorkItem)
      .catch (this.handleError);
  }

  moveItem(wi: WorkItem, dir: String) {
    //We need to call an ordering API which will store 
    //the new location for the selected work item
    let index = this.workItems.findIndex(x => x.id == wi.id);
    let wiSplice = this.workItems.splice(index, 1);
    if (dir == 'top') {
      this.workItems.splice(0, 0, wi);
    } else {
      this.workItems.splice(this.workItems.length, 0, wi);
    }
    return this.workItems;
  }

  delete(workItem: WorkItem): Promise<void> {
    const url = `${this.workItemUrl}/${workItem.id}`;
    return this.http
      .delete(url, { headers: this.headers, body: '' })
      .toPromise()
      .then(() => {
        let deletedItemIndex = this.workItems.findIndex((item) => item.id == workItem.id);
        // removing deleted item from the local list
        this.workItems.splice(deletedItemIndex, 1);
      })
      .catch(this.handleError);
  }

  create(workItem: WorkItem): Promise<WorkItem> {
    let url = this.workItemUrl;
    let payload = JSON.stringify({data: workItem});
    if (process.env.ENV === 'inmemory') {
      // the inmemory db uses number id's by default. That clashes with the core api.
      // so we create a random id for new inmemory items and set them prior to storing,
      // so the inmemory db uses them as id. As the id is possibly displayed in the
      // ui, only 5 random characters are used to not break UI components. The entropy
      // is sufficient for tests and dev.  
      workItem.id = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (var i = 0; i < 5; i++)
        workItem.id += possible.charAt(Math.floor(Math.random() * possible.length));
      payload = JSON.stringify(workItem);
    }
    return this.http
      .post(url, payload, { headers: this.headers })
      .toPromise()
      .then(response => {
        // Adding newly added work item on top of the local list
        let updatedWorkItem: WorkItem = 
          process.env.ENV != 'inmemory' ? 
            response.json().data as WorkItem : 
            cloneDeep(workItem) as WorkItem;
        this.workItems.splice(0, 0, updatedWorkItem);
        return updatedWorkItem;
      })
      .catch(this.handleError);
  }

  update(workItem: WorkItem): Promise<WorkItem> {
    if (process.env.ENV == 'inmemory') {
      let url = `${this.workItemUrl}/${workItem.id}`;
      return this.http
        .post(url, JSON.stringify(workItem), { headers: this.headers })
        .toPromise()
        .then(response => {
          let updatedWorkItem = cloneDeep(workItem) as WorkItem;
          let updateIndex = this.workItems.findIndex(item => item.id == updatedWorkItem.id);
          this.workItems[updateIndex] = updatedWorkItem;
          return updatedWorkItem;
        })
        .catch(this.handleError);
    } else {
      let url = `${this.workItemUrl}/${workItem.id}`;
      return this.http
        .patch(url, JSON.stringify({data: workItem}), { headers: this.headers })
        .toPromise()
        .then(response => {
          let updatedWorkItem = response.json().data as WorkItem;
          let updateIndex = this.workItems.findIndex(item => item.id == updatedWorkItem.id);
          this.workItems[updateIndex] = updatedWorkItem;
          return updatedWorkItem;
        })
        .catch(this.handleError);
    }
  }

  getStatusOptions(): Promise<any[]> {
    if (this.availableStates.length) {
      return new Promise((resolve, reject) => {
        resolve(this.availableStates);
      });
    } else {
      return this.getWorkItemTypes()
        .then((response) => {
          this.availableStates = response[0].fields['system.state'].type.values.map((item: string, index: number) => {
            return {
              option: item,
            };
          });
          return this.availableStates;
        })
        .catch(this.handleError);
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
