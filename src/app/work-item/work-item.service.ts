import { Injectable } from '@angular/core';
import { Headers, Http } from "@angular/http";

import 'rxjs/add/operator/toPromise';

import { WorkItem } from './work-item';

@Injectable()
export class WorkItemService {
  private headers = new Headers({'Content-Type': 'application/json'});
  // private workItemUrl = 'app/workItems';  // URL to web api
  private workItemUrl = 'http://localhost:8080/api/workitems';  // URL to web api
  // private workItemUrl = 'http://demo.almighty.io/api/workitems';  // URL to web api

  constructor(private http: Http) { }

  getWorkItems(): Promise<WorkItem[]> {
    return this.http
      .get(this.workItemUrl)
      .toPromise()
      // .then(response => response.json().data as WorkItem[])
      .then(response => response.json() as WorkItem[])
      .catch(this.handleError);
  }

  getWorkItem(id: string): Promise<WorkItem> {
    return this.getWorkItems()
      .then(workItems => workItems.find(workItem => workItem.id === id));
  }

  delete(workItem: WorkItem): Promise<void> {
    const url = `${this.workItemUrl}/${workItem.id}`;
    return this.http
      .delete(url, {headers: this.headers, body: ""})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  create(workItem: WorkItem): Promise<WorkItem> {
    return this.http
      .post(this.workItemUrl, JSON.stringify(workItem), {headers: this.headers})
      .toPromise()
      // .then(res => res.json().data)
      .then(res => res.json())
      .catch(this.handleError);
  }

  update(workItem: WorkItem): Promise<WorkItem> {
    const url = `${this.workItemUrl}/${workItem.id}`;
    return this.http
      .put(url, JSON.stringify(workItem), {headers: this.headers})
      .toPromise()
      .then(() => workItem)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
