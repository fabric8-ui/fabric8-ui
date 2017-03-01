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
import {
  AuthenticationService,
  Broadcaster,
  Logger,
  UserService,
  AUTH_API_URL
} from 'ngx-login-client';

import { MockDataService } from '../shared/mock-data.service';
import { SpaceService } from '../shared/mock-spaces.service';
import { IterationService } from '../iteration/iteration.service';
import { WorkItem } from '../models/work-item';
import { WorkItemService } from './work-item.service';
import {GlobalSettings} from '../shared/globals';


describe('Work Item Service - ', () => {

  let apiService: WorkItemService;
  let mockService: MockBackend;
  let iterationService: IterationService;

  let fakeAuthService: any;
  let fakeSpcaeService: any;
  let fakeSpaceService: any;

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

  beforeEach(() => {
    fakeAuthService = {
      getToken: function () {
        return '';
      },
      isLoggedIn: function() {
        return true;
      }
    };

    fakeSpcaeService = {
      getCurrentSpaceBus: function() {
        let currentSpaceSubjectSource = new BehaviorSubject<any>(spaces[0]);
        return currentSpaceSubjectSource.asObservable();
      },

      getCurrentSpace: function() {
        return Promise.resolve(spaces[0]);
      }
    };

    fakeSpaceService = {
      getCurrentSpace: function() {
        return Promise.resolve({
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
          },
          name: 'Project 1'
        });
      }
    };

    TestBed.configureTestingModule({
      providers: [
        Logger,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: MockBackend,
                       options: BaseRequestOptions) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: AuthenticationService,
          useValue: fakeAuthService
        },
        {
          provide: AuthenticationService,
          useValue: fakeAuthService
        },
        // MockDataService should be removed at some point
        MockDataService,
        {
          provide: SpaceService,
          useValue: fakeSpcaeService
        },
        WorkItemService,
        UserService,
        IterationService,
        Broadcaster,
        GlobalSettings,
        {
          provide: AUTH_API_URL,
          useValue: 'http://api.url.com'
        }
      ]
    });
  });

  beforeEach(inject(
    [WorkItemService, MockBackend, IterationService],
    (service: WorkItemService, mock: MockBackend, iService: IterationService) => {
      apiService = service;
      mockService = mock;
      iterationService = iService;
    }
  ));
  let resp: WorkItem[] = [
    {
      'attributes': {
        'system.created_at': null,
        'system.description': null,
        'system.remote_item_id': null,
        'system.state': 'new',
        'system.title': 'test1',
        'version': 0
      },
      'links': {
        'self': ''
      },
      'id': '1',
      'relationships': {
        'assignees': {
          'data': []
        },
        'baseType': {
          'data': {
            'id': 'system.userstory',
            'type': 'workitemtypes'
          }
        },
        'creator': {}
      },
      'type': 'workitems'
    }
  ] as WorkItem[];
  let response = {data: resp, links: {}};
  let checkResp = cloneDeep(resp);
  checkResp.forEach((item) => item['relationalData'] = Object(
    { assignees: [], creator: null, iteration: null }));

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
      .then(data => {
        expect(data).toEqual(checkResp);
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
      .then(data => {
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
      .then(data => {
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
      .then(data => {
        expect(data).toEqual(checkResp[0]);
      });
  }));

});
