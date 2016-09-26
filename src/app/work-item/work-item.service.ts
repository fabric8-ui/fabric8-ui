import { Injectable } from '@angular/core';
import { Headers, Http } from "@angular/http";
import 'rxjs/add/operator/toPromise';

import { Logger } from './../shared/logger.service';
import { DropdownOption } from './../shared-component/dropdown/dropdown-option';
import { WorkItem } from './work-item';

@Injectable()
export class WorkItemService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private workItemUrl = process.env.API_URL+'workitems';  // URL to web api

  constructor(private http: Http,
              private logger: Logger) { 
    logger.log("WorkItemService running in " + process.env.ENV + " mode.");
    logger.log("WorkItemService using url " + this.workItemUrl);
  }

  getWorkItems(): Promise<WorkItem[]> {
    return this.http
      .get(this.workItemUrl)
      .toPromise()
      .then((response) => {
        let workItems = process.env.ENV!='inmemory' ? response.json() as WorkItem[] : response.json().data as WorkItem[];
        return workItems.map((item) => {
          item.selectedState = this.getSelectedState(item);
          item.selectedState.extra_params = {
            workItem_id: item.id
          };
          return item;
        });
      })
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
      .then((response) => {
        let workItem = process.env.ENV!='inmemory'?response.json() as WorkItem : response.json().data as WorkItem;        
        workItem.selectedState = this.getSelectedState(workItem);
        workItem.selectedState.extra_params = {
          workItem_id: workItem.id
        };
        return workItem;
      })
      .catch(this.handleError);
  }

  update(workItem: WorkItem): Promise<WorkItem> {
    const url = `${this.workItemUrl}/${workItem.id}`;
    return this.http
      .put(url, JSON.stringify(workItem), {headers: this.headers})
      .toPromise()
      .then((response) => {
        let workItem = process.env.ENV!='inmemory'?response.json() as WorkItem : response.json().data as WorkItem;
        workItem.selectedState = this.getSelectedState(workItem);
        workItem.selectedState.extra_params = {
          workItem_id: workItem.id
        };
        return workItem;
      })
      .catch(this.handleError);
  }

  getStatusOptions(): DropdownOption[] {
    return [
      {
        id: 0,
        option: 'new',
        active_class: 'label-warning',
        option_class: 'statusDrawer_ListItemStatusNew'
      },
      {
        id: 1,
        option: 'in progress',
        active_class: 'label-primary',
        option_class: 'statusDrawer_ListItemStatusProgress'
      },
      {
        id: 2,
        option: 'resolved',
        active_class: 'label-success',
        option_class: 'statusDrawer_ListItemStatusResolved'
      },
      {
        id: 3,
        option: 'closed',
        active_class: 'label-info',
        option_class: 'statusDrawer_ListItemStatusClosed'
      }
    ] as DropdownOption[];
  } 

  getSelectedState(workItem: WorkItem): DropdownOption {
    let statusOptions: DropdownOption[] = this.getStatusOptions();
    let option: DropdownOption = statusOptions.find((item) => {
      return workItem.fields['system.state'] == item.option;
    });
    return option ? option : statusOptions[0];
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
