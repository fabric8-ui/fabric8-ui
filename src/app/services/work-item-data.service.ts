import { cloneDeep } from 'lodash';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkItem } from './../models/work-item';

@Injectable()
export class WorkItemDataService {

  private workItems: object = {};
  constructor() {
    if (sessionStorage.getItem('planner_workItems') === null) {
      sessionStorage.setItem('planner_workItems', JSON.stringify({}));
    }
  }

  public setItem(workItem: WorkItem): void {
    let items = JSON.parse(sessionStorage.getItem('planner_workItems'));
    items[workItem.id] = cloneDeep(workItem);
    sessionStorage.setItem('planner_workItems', JSON.stringify(items));
  }

  public setItems(workItems: WorkItem[]): void {
    workItems.forEach(item => this.setItem(item));
  }

  public getItem(workItemId: string | number): Observable<WorkItem | null> {
    let items = JSON.parse(sessionStorage.getItem('planner_workItems'));
    if (items[workItemId]) {
      return Observable.of(items[workItemId]).delay(0);
    } else {
      return Observable.of(null).delay(0);
    }
  }

  public getItembyNumber(workItemNumber: string | number): Observable<WorkItem | null> {
    let items = JSON.parse(sessionStorage.getItem('planner_workItems'));
    const item_id = Object.keys(items).find(key => items[key]['attributes']['system.number'] === workItemNumber);
    if (item_id) {
      return Observable.of(items[item_id]).delay(0);
    } else {
      return Observable.of(null).delay(0);
    }
  }

}
