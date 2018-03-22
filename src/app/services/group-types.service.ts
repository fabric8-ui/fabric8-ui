import { GlobalSettings } from '../shared/globals';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


import { cloneDeep } from 'lodash';
import { Logger } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { HttpService } from './http-service';

import { Space, Spaces } from 'ngx-fabric8-wit';
import { GroupTypesModel } from '../models/group-types.model';
import { WorkItem } from '../models/work-item'
import { WorkItemType } from '../models/work-item-type';
import { MockHttp } from '../mock/mock-http';

@Injectable()
export class GroupTypesService {
  private groupTypeResponse;
  public groupTypes: GroupTypesModel[] = [];
  private headers = new Headers({'Content-Type': 'application/json'});
  private _currentSpace;
  private selectedGroupType = [];
  public groupTypeSelected: Subject<string[]> = new Subject();
  public workItemSelected: Subject<string[]> = new Subject();
  public groupName: string = '';

  constructor(
    private logger: Logger,
    private http: HttpService,
    private auth: AuthenticationService,
    private globalSettings: GlobalSettings,
    private spaces: Spaces
  ) {
    this.spaces.current.subscribe(val => this._currentSpace = val);
  }

  getGroupTypes(): Observable<GroupTypesModel[]> {
    return this.spaces.current.take(1).switchMap(space => {
      let workitemtypesUrl = space.relationships.workitemtypegroups.links.related;
      return this.http
        .get(workitemtypesUrl)
        .map (response => {
          if (/^[5, 4][0-9]/.test(response.status.toString())) {
            throw new Error('API error occured');
          }
          this.groupTypes = response.json().data;
          this.setCurrentGroupType(this.groupTypes[0].relationships.typeList.data, this.groupTypes[0].attributes.name);
          return this.groupTypes;
        })
        .catch ((error: Error | any) => {
          if (error.status === 401) {
            //this.notifyError('You have been logged out.', error);
            this.auth.logout();
          } else {
            console.log('Fetch iteration API returned some error - ', error.message);
            //this.notifyError('Fetching iterations has from server has failed.', error);
          }
          return Observable.throw(new Error(error.message));
        });
    });
  }

  getGroupTypes2(url): Observable<GroupTypesModel[]> {
    return this.http
      .get(url)
      .map (response => {
        if (/^[5, 4][0-9]/.test(response.status.toString())) {
          throw new Error('API error occured');
        }
        this.groupTypes = response.json().data;
        this.setCurrentGroupType(this.groupTypes[0].relationships.typeList.data, this.groupTypes[0].attributes.name);
        return this.groupTypes;
      })
      .catch ((error: Error | any) => {
        if (error.status === 401) {
          //this.notifyError('You have been logged out.', error);
          this.auth.logout();
        } else {
          console.log('Fetch iteration API returned some error - ', error.message);
          //this.notifyError('Fetching iterations has from server has failed.', error);
        }
        return Observable.throw(new Error(error.message));
      });
  }

  getFlatGroupList(): Observable<GroupTypesModel[]>{
    //this.mockData();
    if (this._currentSpace) {
      //Normalize the response - we don't want two portfolio - that is
      //no two entries for the same level
      return Observable.of(this.groupTypes);
    } else {
      return Observable.of<GroupTypesModel[]>( [] as GroupTypesModel[] );;
    }
  }

  getWitGroupList(): GroupTypesModel[] {
    return this.groupTypes ? this.groupTypes : [];
  }

  getCurrentGroupName(): string {
    return this.groupName ? this.groupName : '';
  }

  setCurrentGroupType(groupType, groupName: string = '') {
    this.selectedGroupType = groupType;
    this.groupName = groupName;
    //emit observable. Listener on planner backlog view
    this.groupTypeSelected.next(groupType);
  }

  getCurrentGroupType(): any[] {
    return this.selectedGroupType;
  }

  getAllowedChildWits(workItem: WorkItem, wits) {
    let WITid = workItem.relationships.baseType.data.id;
    let selectedWIT = wits.find(wit => wit.id === WITid);
    if (selectedWIT && selectedWIT.relationships.guidedChildTypes)
      this.workItemSelected.next(selectedWIT.relationships.guidedChildTypes.data.map(i=>i.id));
    else
      this.workItemSelected.next([]);
  }
}
