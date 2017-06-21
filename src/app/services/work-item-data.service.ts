import { cloneDeep } from 'lodash';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkItem } from './../models/work-item';

@Injectable()
export class WorkItemDataService {

  private workItems: object = {};

  public setItem(workItem: WorkItem): void {
    this.workItems[workItem.id] = cloneDeep(workItem);
  }

  public setItems(workItems: WorkItem[]): void {
    workItems.forEach(item => this.setItem(item));
  }

  public getItem(workItemId: string | number): Observable<WorkItem | null> {
    if (this.workItems[workItemId]) {
      return Observable.of(this.workItems[workItemId]).delay(0);
    } else {
      return Observable.of(null).delay(0);
    }
  }

}
