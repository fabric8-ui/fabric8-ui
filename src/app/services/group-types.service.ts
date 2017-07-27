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
import { WorkItemType } from '../models/work-item-type';
import { WorkItemService } from '../services/work-item.service';
import { MockHttp } from '../mock/mock-http';

@Injectable()
export class GroupTypesService {
  private groupTypeResponse;
  public groupTypes: GroupTypesModel[] = [];
  private headers = new Headers({'Content-Type': 'application/json'});
  private _currentSpace;
  private selectedGroupType: GroupTypesModel;
  public groupTypeselected: Subject<GroupTypesModel> = new Subject();

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
    //this will change after integrating with API
    //For now use the mock data which resembles the api response
    this.mockData();
    if (this._currentSpace) {
        //Normalize the response - we don't want two portfolio - that is
        //no two entries for the same level
        let filterResponse = cloneDeep(this.groupTypes)
        let returnResponse = filterResponse.filter((item, index) => {
          console.log(item)
          if( filterResponse[index+1]) {
            return item.level != filterResponse[index+1].level
          } else {
            return item;
          }
        });
        console.log('returnResponse = ', returnResponse);
        return Observable.of(returnResponse);
    } else {
      return Observable.of<GroupTypesModel[]>( [] as GroupTypesModel[] );;
    }
  }

  setCurrentGroupType(groupType) {
    this.selectedGroupType = groupType;
    //emit observable. Listener on planner backlog view
    this.groupTypeselected.next(groupType);
  }

  getGuidedWits(): Array<WorkItemType> {
    //Concat work items for the same top leve
    //Example - we have two portfolio
    let wits = this.selectedGroupType.wit_collection;
    this.groupTypes.filter(item => {
      if(item.group === this.selectedGroupType.group &&
        item.sublevel != this.selectedGroupType.sublevel) {
          item.wit_collection.forEach(wit => {
            wits.push(wit);
          });
      }
    });
    //Parse through included and pull out the matching work item types
    let witsList = this.groupTypeResponse.included;
    let response = witsList.filter(wit => {
      return wits.find(item => wit.id === item)
    });
    return response;
  }

  getAllowedChildWits(): Array<WorkItemType> {
    //Get to the highest level
    //set sub level as child
    //If no sub level, get the next level as child
    return;
  }

  mockData(): Array<GroupTypesModel> {
    //Map the json blob to what the UI needs
    this.groupTypeResponse = {
      "id":"f3423d58-ad28-427b-abf1-930afbb670c0",
      "type":"typehierarchies",
      "attributes":
      {
        "hierarchy":[
          {
              "level":0,
              "sublevel":0,
              "group":"portfolio",
              "name":"Portfolio",
              "wit_collection":[
                "71171e90-6d35-498f-a6a7-2083b5267c18",
                "ee7ca005-f81d-4eea-9b9b-1965df0988d0",
                "6d603ab4-7c5e-4c5f-bba8-a3ba9d370985"
              ]
          },
          {
              "level":0,
              "sublevel":1,
              "group":"portfolio",
              "name":"Portfolio",
              "wit_collection":[
                "b9a71831-c803-4f66-8774-4193fffd1311",
                "3194ab60-855b-4155-9005-9dce4a05f1eb"
              ]
          },
          {
              "level":1,
              "sublevel":0,
              "group":"requirements",
              "name":"Requirements",
              "wit_collection":[
                "0a24d3c2-e0a6-4686-8051-ec0ea1915a28",
                "26787039-b68f-4e28-8814-c2f93be1ef4e"
              ]
          }
        ]
      },
      "included":[
        {
          "attributes":{
              "created-at":"2017-07-03T10:51:26.732978Z",
              "description":"",
              "fields":{

              },
              "icon":"fa fa-bolt",
              "name":"Scenario",
              "updated-at":"2017-07-19T15:05:03.153759Z",
              "version":0
          },
          "id":"71171e90-6d35-498f-a6a7-2083b5267c18",
          "relationships":{
              "space":{
                "data":{
                    "id":"2e0698d8-753e-4cef-bb7c-f027634824a2",
                    "type":"spaces"
                },
                "links":{
                    "related":"http://localhost:8080/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2",
                    "self":"http://localhost:8080/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2"
                }
              }
          },
          "type":"workitemtypes"
        },
        {
          "attributes":{
              "created-at":"2017-07-03T10:51:26.739583Z",
              "description":"",
              "fields":{

              },
              "icon":"fa fa-university",
              "name":"Fundamental",
              "updated-at":"2017-07-19T15:05:03.157856Z",
              "version":0
          },
          "id":"ee7ca005-f81d-4eea-9b9b-1965df0988d0",
          "relationships":{
              "space":{
                "data":{
                    "id":"2e0698d8-753e-4cef-bb7c-f027634824a2",
                    "type":"spaces"
                },
                "links":{
                    "related":"http://localhost:8080/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2",
                    "self":"http://localhost:8080/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2"
                }
              }
          },
          "type":"workitemtypes"
        },
        {
          "attributes":{
              "created-at":"2017-07-03T10:51:26.74142Z",
              "description":"",
              "fields":{

              },
              "icon":"fa fa-scissors",
              "name":"Papercuts",
              "updated-at":"2017-07-19T15:05:03.159495Z",
              "version":0
          },
          "id":"6d603ab4-7c5e-4c5f-bba8-a3ba9d370985",
          "relationships":{
              "space":{
                "data":{
                    "id":"2e0698d8-753e-4cef-bb7c-f027634824a2",
                    "type":"spaces"
                },
                "links":{
                    "related":"http://localhost:8080/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2",
                    "self":"http://localhost:8080/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2"
                }
              }
          },
          "type":"workitemtypes"
        },
        {
          "attributes":{
              "created-at":"2017-07-03T10:51:26.738062Z",
              "description":"",
              "fields":{

              },
              "icon":"fa fa-map",
              "name":"Experience",
              "updated-at":"2017-07-19T15:05:03.156334Z",
              "version":0
          },
          "id":"b9a71831-c803-4f66-8774-4193fffd1311",
          "relationships":{
              "space":{
                "data":{
                    "id":"2e0698d8-753e-4cef-bb7c-f027634824a2",
                    "type":"spaces"
                },
                "links":{
                    "related":"http://localhost:8080/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2",
                    "self":"http://localhost:8080/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2"
                }
              }
          },
          "type":"workitemtypes"
        },
        {
          "attributes":{
              "created-at":"2017-07-03T10:51:26.735887Z",
              "description":"",
              "fields":{

              },
              "icon":"fa fa-diamond",
              "name":"Value Proposition",
              "updated-at":"2017-07-19T15:05:03.15506Z",
              "version":0
          },
          "id":"3194ab60-855b-4155-9005-9dce4a05f1eb",
          "relationships":{
              "space":{
                "data":{
                    "id":"2e0698d8-753e-4cef-bb7c-f027634824a2",
                    "type":"spaces"
                },
                "links":{
                    "related":"http://localhost:8080/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2",
                    "self":"http://localhost:8080/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2"
                }
              }
          },
          "type":"workitemtypes"
        },
        {
          "attributes":{
              "created-at":"2017-07-03T10:51:26.730317Z",
              "description":"",
              "fields":{

              },
              "icon":"fa fa-puzzle-piece",
              "name":"Feature",
              "updated-at":"2017-07-19T15:05:03.15249Z",
              "version":0
          },
          "id":"0a24d3c2-e0a6-4686-8051-ec0ea1915a28",
          "relationships":{
              "space":{
                "data":{
                    "id":"2e0698d8-753e-4cef-bb7c-f027634824a2",
                    "type":"spaces"
                },
                "links":{
                    "related":"http://localhost:8080/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2",
                    "self":"http://localhost:8080/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2"
                }
              }
          },
          "type":"workitemtypes"
        },
        {
          "attributes":{
              "created-at":"2017-07-03T10:51:26.725574Z",
              "description":"",
              "fields":{

              },
              "icon":"fa fa-bug",
              "name":"Bug",
              "updated-at":"2017-07-19T15:05:03.149717Z",
              "version":0
          },
          "id":"26787039-b68f-4e28-8814-c2f93be1ef4e",
          "relationships":{
              "space":{
                "data":{
                    "id":"2e0698d8-753e-4cef-bb7c-f027634824a2",
                    "type":"spaces"
                },
                "links":{
                    "related":"http://localhost:8080/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2",
                    "self":"http://localhost:8080/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2"
                }
              }
          },
          "type":"workitemtypes"
        }
      ]
    }
    this.groupTypes = this.groupTypeResponse.attributes.hierarchy;
    return this.groupTypes;
  }
}
