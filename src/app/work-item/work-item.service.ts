import { Injectable } from '@angular/core';
import { Headers, Http } from "@angular/http";

import 'rxjs/add/operator/toPromise';

import { WorkItem } from './work-item';

@Injectable()
export class WorkItemService {
  // private workItemUrl = 'app/workItems';  // URL to web api
  private workItemUrl = 'http://localhost:8080/api/workitem';  // URL to web api

  constructor(private http: Http) { }

  getWorkItems(): Promise<WorkItem[]> {
    return this.http
      .get(this.workItemUrl)
      .toPromise()
      // .then(response => response.json().data as WorkItem[])
      .then(response => response.json() as WorkItem[])
      .catch(this.handleError);
  }

  getWorkItem(id: number) {
    return this.getWorkItems()
        .then(workItems => workItems.find(workItem => workItem.id === id));
  }

  save(workItem: WorkItem): Promise<WorkItem>  {
    if (workItem.id) {
      return this.put(workItem);
    }
    return this.post(workItem);
  }

  delete(workItem: WorkItem) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let url = `${this.workItemUrl}/${workItem.id}`;

    return this.http
        .delete(url, {headers: headers})
        .toPromise()
        .catch(this.handleError);
  }

  // Add new WorkItem
  private post(workItem: WorkItem): Promise<WorkItem> {
    let headers = new Headers({'Content-Type': 'application/json'});

    return this.http
      .post(this.workItemUrl, JSON.stringify(workItem), {headers: headers})
      .toPromise()
      .then(res => res.json().data)
      .catch(this.handleError);
  }

  // Update existing WorkItem
  private put(workItem: WorkItem) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let url = `${this.workItemUrl}/${workItem.id}`;
    // let url = `${this.workItemUrl}`;

    return this.http
      .put(url, JSON.stringify(workItem), {headers: headers})
      .toPromise()
      .then(() => workItem)
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
