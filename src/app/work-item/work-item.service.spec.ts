import { HttpService } from './../shared/http-service';
import { SpacesService } from './../shared/standalone/spaces.service';
import { Spaces } from 'ngx-fabric8-wit';
import {
  async,
  inject,
  TestBed
} from '@angular/core/testing';
import {
  BaseRequestOptions,
  Http,
  Response,
  ResponseOptions
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { cloneDeep } from 'lodash';
import { DropdownOption } from 'ngx-widgets';
import { Broadcaster, Logger } from 'ngx-base';
import {
  AuthenticationService,
  UserService,
  AUTH_API_URL
} from 'ngx-login-client';
import { Notifications } from 'ngx-base';

import { MockDataService } from '../shared/mock-data.service';
import { AreaService } from '../area/area.service';
import { FilterService } from '../shared/filter.service';
import { IterationService } from '../iteration/iteration.service';
import { WorkItem } from '../models/work-item';
import { WorkItemService } from './work-item.service';
import { GlobalSettings } from '../shared/globals';
import { witApiUrlProvider } from '../shared/wit-api.provider';

describe('Work Item Service - ', () => {

  let apiService: WorkItemService;
  let mockService: MockBackend;
  let filterService:FilterService;
  let iterationService: IterationService;
  let areaService: AreaService;

  let fakeAuthService: any;
  let fakeSpace: any;

  let spaces = [{
        'name': 'Project 1',
        'path': '',
        'description': '',
        'teams': [
            {
              'name': 'Team Project 1',
              'members': [
                  {
                    'attributes': {
                        'fullName': 'Example User 0',
                        'imageURL': 'https://avatars.githubusercontent.com/u/2410471?v=3'
                    },
                    'id': 'user0',
                    'type': 'identities'
                  }
              ]
            }
        ],
        'defaultTeam': {
            'name': 'Team Project 1',
            'members': [
              {
                  'attributes': {
                    'fullName': 'Example User 0',
                    'imageURL': 'https://avatars.githubusercontent.com/u/2410471?v=3'
                  },
                  'id': 'user0',
                  'type': 'identities'
              }
            ]
        },
        'process': {

        },
        'privateSpace': false,
        'id': '1f669678-ca2c-4cbb-b46d-5b70a98dde3c',
        'attributes': {

        },
        'type': 'spaces',
        'links': {
          'self': 'http://localhost:8080/api/'
        },
        'relationships': {
          'areas': {
            'links': {
              'related': 'http://localhost:8080/api/spaces/1f669678-ca2c-4cbb-b46d-5b70a98dde3c/areas'
            }
          },
          'iterations': {
            'links': {
              'related': 'http://localhost:8080/api/spaces/1f669678-ca2c-4cbb-b46d-5b70a98dde3c/iterations'
            }
          }
        }
      }];

  let wiTypes = [
      {
         'id' : '86af5178-9b41-469b-9096-57e5155c3f31',
         'attributes' : {
            'name' : 'Planner Item',
            'icon': 'fa-question',
            'fields' : {
               'system.created_at' : {
                  'type' : {
                     'kind' : 'instant'
                  },
                  'required' : false
               },
               'system.remote_item_id' : {
                  'required' : false,
                  'type' : {
                     'kind' : 'string'
                  }
               },
               'system.area' : {
                  'type' : {
                     'kind' : 'area'
                  },
                  'required' : false
               },
               'system.title' : {
                  'required' : true,
                  'type' : {
                     'kind' : 'string'
                  }
               },
               'system.creator' : {
                  'type' : {
                     'kind' : 'user'
                  },
                  'required' : true
               },
               'system.assignees' : {
                  'type' : {
                     'kind' : 'list',
                     'componentType' : 'user'
                  },
                  'required' : false
               },
               'system.state' : {
                  'required' : true,
                  'type' : {
                     'kind' : 'enum',
                     'values' : [
                        'new',
                        'open',
                        'in progress',
                        'resolved',
                        'closed'
                     ],
                     'baseType' : 'string'
                  }
               },
               'system.description' : {
                  'required' : false,
                  'type' : {
                     'kind' : 'markup'
                  }
               },
               'system.iteration' : {
                  'type' : {
                     'kind' : 'iteration'
                  },
                  'required' : false
               }
            },
            'description' : 'Description for Planner Item',
            'version' : 0
         },
         'type' : 'workitemtypes'
      }
  ];

  beforeEach(() => {
    fakeAuthService = {
      getToken: function () {
        return '';
      },
      isLoggedIn: function() {
        return true;
      }
    };

    TestBed.configureTestingModule({
      providers: [
        Logger,
        BaseRequestOptions,
        MockBackend,
        Notifications,
        {
          provide: Http,
          useFactory: (backend: MockBackend,
                       options: BaseRequestOptions) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: HttpService,
          useFactory: (backend: MockBackend,
                       options: BaseRequestOptions) => new HttpService(backend, options, null),
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: AuthenticationService,
          useValue: fakeAuthService
        },
        // MockDataService should be removed at some point
        MockDataService,
        AreaService,
        WorkItemService,
        UserService,
        FilterService,
        IterationService,
        Broadcaster,
        GlobalSettings,
        {
          provide: AUTH_API_URL,
          useValue: 'https://api.url.com'
        },
        witApiUrlProvider,
        {
          provide: Spaces,
          useExisting: SpacesService
        },
        SpacesService
      ]
    });
  });

  beforeEach(inject(
    [WorkItemService, MockBackend, FilterService, IterationService, AreaService],
    (service: WorkItemService, mock: MockBackend, fService, iService: IterationService, aService: AreaService) => {
      apiService = service;
      mockService = mock;
      filterService = fService;
      iterationService = iService;
      areaService = aService;
      (apiService as any)._currentSpace = spaces[0];
      (apiService as any).workItemTypes = wiTypes;
    }
  ));
  let resp: WorkItem[] = [{
      'attributes': {
        'system.created_at': null,
        'system.description': null,
        'system.remote_item_id': null,
        'system.state': 'new',
        'system.title': 'test1',
        'version': 0
      },
      'id': '1',
      'relationships': {
        'area': { },
        'iteration': { },
        'assignees': {
          'data': [
            {
              'attributes': {
                'username': 'username2',
                'fullName': 'WIDCT Example User 2',
                'imageURL': 'https://avatars.githubusercontent.com/u/002?v=3'
            },
            'type': 'identities',
            'id': 'widct-user2'
          }
          ]
        },
        'baseType': {
          'data': {
            'id': 'system.userstory',
            'type': 'workitemtypes'
          }
        },
        'creator': {
          'data': {
            'attributes': {
              'username': 'username0',
              'fullName': 'WIDCT Example User 0',
              'imageURL': 'https://avatars.githubusercontent.com/u/000?v=3'
            },
            'type': 'identities',
            'id': 'widct-user0'
          }
        },
        'comments': {
          'data': [],
          'links': {
            'self': '',
            'related': ''
          }
        }
      },
      'type': 'workitems',
      'links': {
        'self': ''
      },
      'relationalData': { }
    }] as WorkItem[];
  let response = {data: resp, links: {}};
  let checkResp = cloneDeep(resp);

  it('Get work items', async(() => {
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(response),
          status: 200
        })
      ));
    });

    apiService.getWorkItems()
      .subscribe(data => {
        expect(data.workItems).toEqual(checkResp);
      });
  }));

  it('Add new work Item', async(() => {
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify({data: resp[0]}),
          status: 201
        })
      ));
    });

    apiService.create(resp[0])
      .subscribe(data => {
        expect(data).toEqual(checkResp[0]);
      });
  }));

  it('Delete work item', async(() => {
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          status: 200
        })
      ));
    });

    apiService.delete(resp[0])
      .subscribe(data => {
        expect(data).toBeUndefined();
      });
  }));

  it('Update work item', async(() => {
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify({data: resp[0]}),
          status: 200
        })
      ));
    });

    apiService.update(resp[0])
      .subscribe(data => {
        expect(data).toEqual(checkResp[0]);
      });
  }));

});
