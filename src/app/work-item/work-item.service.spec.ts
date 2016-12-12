import { cloneDeep } from 'lodash';
import { Broadcaster } from '../shared/broadcaster.service';
import { UserService } from '../user/user.service';
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

import { AuthenticationService } from '../auth/authentication.service';
import { DropdownOption } from '../shared-component/dropdown/dropdown-option';
import { Logger } from '../shared/logger.service';

import { WorkItem } from '../models/work-item';
import { WorkItemService } from './work-item.service';


describe('Work Item Service - ', () => {

  let apiService: WorkItemService;
  let mockService: MockBackend;
  
  let fakeAuthService: any;

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
        WorkItemService,
        UserService,
        Broadcaster
      ]
    });
  });

  beforeEach(inject(
    [WorkItemService, MockBackend],
    (service: WorkItemService, mock: MockBackend) => {
      apiService = service;
      mockService = mock;
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
  checkResp.forEach((item) => item['relationalData'] = Object({ assignees: [], creator: null }));

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
