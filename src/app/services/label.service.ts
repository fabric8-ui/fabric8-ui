import { Injectable, Component, Inject } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Logger } from 'ngx-base';
import { cloneDeep } from 'lodash';
import { HttpService } from './http-service';
import { Space, Spaces } from 'ngx-fabric8-wit';
import { LabelModel } from '../models/label.model';
import { WorkItem } from '../models/work-item';

@Injectable()
export class LabelService {

  constructor(
    private http: HttpService,
    private logger: Logger,
    private spaces: Spaces
  ) {}

  notifyError(message: string, httpError: any) {
    this.logger.log('ERROR [WorkItemService] ' + message + (httpError.message?' '+httpError.message:''));
  }

    /**
   * getLabels - We call this service method to fetch all labels in currect space
   * @return Observable of LabelModel[] - Array of labels.
   * Url - http://localhost:8080/api/spaces/829d2039-3929-4e8e-865b-fd463b8b34f1/labels/
   */

  getLabels(): Observable<LabelModel[]> {
    return this.spaces.current
    .switchMap(currentSpace => {
        if(currentSpace)
          return this.http.get(currentSpace.links.self + '/labels')
        else
          return []
    }).map (response => {
      return response.json().data as LabelModel[];
    });
  }

  getLabels2(labelUrl): Observable<LabelModel[]> {
    return this.http.get(labelUrl)
    .map (response => {
      return response.json().data as LabelModel[];
    });
  }

  createLabel(label: LabelModel): Observable<LabelModel> {
    return this.spaces.current.switchMap(
      currentSpace => {
        return this.http.post(currentSpace.links.self + '/labels', {data: label})
      }
    )
    .map (response => {
      return response.json().data as LabelModel;
    })
  }
}
