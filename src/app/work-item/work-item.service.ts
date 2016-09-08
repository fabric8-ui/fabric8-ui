import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { AuthenticationService } from './../auth/authentication.service';
import { DropdownOption } from './../shared-component/dropdown/dropdown-option';
import { Logger } from './../shared/logger.service';
import { WorkItem } from './work-item';

@Injectable()
export class WorkItemService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private workItemUrl = process.env.API_URL + 'workitems';  // URL to web api
  private availableStates: DropdownOption[] = [];

  constructor(private http: Http,
              private logger: Logger,
              private auth: AuthenticationService) {    
    this.headers.append('Authorization', 'Bearer ' + this.auth.getToken());
    logger.log('WorkItemService running in ' + process.env.ENV + ' mode.');
    logger.log('WorkItemService using url ' + this.workItemUrl);
  }

  getWorkItems(): Promise<WorkItem[]> {
    return this.http
      .get(this.workItemUrl, {headers: this.headers})
      .toPromise()
      .then(response => process.env.ENV != 'inmemory' ? response.json() as WorkItem[] : response.json().data as WorkItem[])
      .catch(this.handleError);
  }

  getWorkItem(id: string): Promise<WorkItem> {
    return this.getWorkItems()
      .then(workItems => workItems.find(workItem => workItem.id === id));
  }

  delete(workItem: WorkItem): Promise<void> {
    const url = `${this.workItemUrl}/${workItem.id}`;
    return this.http
      .delete(url, {headers: this.headers, body: ''})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  create(workItem: WorkItem): Promise<WorkItem> {
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
    }
    return this.http
      .post(this.workItemUrl, JSON.stringify(workItem), {headers: this.headers})
      .toPromise()
      .then(response => process.env.ENV != 'inmemory' ? response.json() as WorkItem : response.json().data as WorkItem)
      .catch(this.handleError);
  }

  update(workItem: WorkItem): Promise<WorkItem> {
    const url = `${this.workItemUrl}/${workItem.id}`;
    return this.http
      .put(url, JSON.stringify(workItem), {headers: this.headers})
      .toPromise()
      .then(response => process.env.ENV != 'inmemory' ? response.json() as WorkItem : workItem)
      .catch(this.handleError);
  }

  getStatusOptions(): Promise<DropdownOption[]> {
    if (this.availableStates.length) {
      return new Promise((resolve, reject) => {
        resolve(this.availableStates);
      });
    } else {
      const active_class_map = {
        'new': 'btn-warning',
        'in progress': 'btn-primary',
        'resolved': 'btn-success',
        'closed': 'btn-info',
      };
      const url = `${process.env.API_URL}workitemtypes`;
      return this.http
        .get(url)
        .toPromise()
        .then((response) => {
          let states = process.env.ENV != 'inmemory' ? response.json() : response.json().data;
          this.availableStates = states[0].fields['system.state'].type.values.map((item: string, index: number) => {
            return {
              id: index,
              option: item,
              active_class: active_class_map[item],
              option_class: ''
            } as DropdownOption;
          });
          return this.availableStates;
        })
        .catch(this.handleError);
    }
  }

  getSelectedState(workItem: WorkItem, statusOptions: DropdownOption[]): DropdownOption {
    let option: DropdownOption = statusOptions.find(item => workItem.fields['system.state'] == item.option);
    let selectedState: DropdownOption = {
      id: option.id,
      option: option.option,
      active_class: option.active_class,
      option_class: option.option_class,
      extra_params: {
        workItem_id: workItem.id
      }
    } as DropdownOption;
    return selectedState;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
