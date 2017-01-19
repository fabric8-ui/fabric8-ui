import { cloneDeep } from 'lodash';
import { IterationModel } from './../models/iteration.model';
import { AuthenticationService } from './../auth/authentication.service';
import {
  BaseRequestOptions,
  Http,
  Response,
  ResponseOptions
} from '@angular/http';
import {
  async,
  inject,
  TestBed
} from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { IterationService } from './iteration.service';

describe ('Iteration service - ', () => {
  let apiService: IterationService;
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
        IterationService
      ]
    });
  });

  beforeEach(inject(
    [IterationService, MockBackend],
    (service: IterationService, mock: MockBackend) => {
      apiService = service;
      mockService = mock;
    }
  ));

  let resp: IterationModel[] = [{
      attributes: {
        endAt: '2016-11-29T23:18:14Z',
        name: 'Sprint #24',
        startAt: '2016-11-29T23:18:14Z'
      },
      id: 'd8535583-dfbd-4b62-be8d-44a7d4fa7048',
      links: {
        self: 'http://localhost:8080/api/iterations/d8535583-dfbd-4b62-be8d-44a7d4fa7048'
      },
      relationships: {
        space: {
          data: {
            id: 'd7d98b45-415a-4cfc-add2-ec7b7aee7dd5',
            type: 'spaces'
          },
          links: {
            self: 'http://localhost:8080/api/spaces/d7d98b45-415a-4cfc-add2-ec7b7aee7dd5'
          }
        }
      },
      type: 'iterations'
  }];
  let response = {data: resp, links: {}};
  let checkResp = cloneDeep(resp);

  it('Get iterations', async(() => {
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(response),
          status: 200
        })
      ));
    });
    let url1 = 'http://localhost:8080/api/spaces/d7d98b45-415a-4cfc-add2-ec7b7aee7dd5/iterations';
    apiService.getIterations(url1)
      .then (data => {
        expect(data).toEqual(checkResp);
       });

    // For an invalid URL
    apiService.getIterations()
      .catch ((data) => {
        expect(data).toEqual([]);
      });

    // Check if data from response is assigned to the private variable
    apiService.getIterations(url1)
      .then (data => {
        expect(apiService.getIterationList()).toEqual(checkResp);
       });

    apiService.getIterations()
      .catch ((data) => {
        expect(apiService.getIterationList()).toEqual([]);
      });
  }));

  // Test if the API returns error
  it('Get iteration with error', async(() => {
    let url1 = 'http://localhost:8080/api/spaces/d7d98b45-415a-4cfc-add2-ec7b7aee7dd5/iterations';

    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: {},
          status: 404
        })
      ));
    });

    // Error response
    apiService.getIterations(url1)
      .catch (data => {
        expect(data).toEqual([]);
      })
      .then (() => {
        expect(apiService.getIterationList().length).toEqual(0);
      });
  }));

  // Test if everything is okay
  it('Create iteration', async(() => {
    let requestParams = resp[0];
    let responseData = cloneDeep(requestParams);
    let response = {data: responseData};
    let url1 = 'http://localhost:8080/api/spaces/d7d98b45-415a-4cfc-add2-ec7b7aee7dd5/iterations';

    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(response),
          status: 200
        })
      ));
    });

    apiService.createIteration(url1, requestParams)
      .then (data => {
        expect(data).toEqual(responseData);
      })
      .then (() => {
        expect(apiService.getIterationList().length).toEqual(1);
      });
  }));

  // Test if the API url is invalid
  it('Create iteration with invalid URL', async(() => {
    let requestParams = resp[0];
    let responseData = cloneDeep(requestParams);
    let response = {data: responseData};

    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(response),
          status: 200
        })
      ));
    });

    apiService.createIteration('', requestParams)
      .catch (data => {
        expect(data).toEqual({});
      })
      .then (() => {
        expect(apiService.getIterationList().length).toEqual(0);
      });
  }));


  // Test if the API returns error
  it('Create iteration with error', async(() => {
    let requestParams = resp[0];
    let url1 = 'http://localhost:8080/api/spaces/d7d98b45-415a-4cfc-add2-ec7b7aee7dd5/iterations';

    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: {},
          status: 404
        })
      ));
    });

    // Error response
    apiService.createIteration(url1, requestParams)
      .catch (data => {
        expect(data).toEqual({});
      })
      .then (() => {
        expect(apiService.getIterationList().length).toEqual(0);
      });
  }));

  it('Should check valid URL for iterations', () => {
    let url1 = 'http://localhost:8080/api/spaces/d7d98b45-415a-4cfc-add2-ec7b7aee7dd5/iterations';
    expect(apiService.checkValidIterationUrl(url1)).toEqual(true);
    let url2 = 'http://localhost:8080/api/spaces/d7d98b45-415a-4cfc-add2-ec7b7aee7dd5/invalid';
    expect(apiService.checkValidIterationUrl(url2)).toEqual(false);
    let url3 = 'http://localhost:8080/api/spaces/415a-4cfc-add2-ec7b7aee7dd5/invalid';
    expect(apiService.checkValidIterationUrl(url3)).toEqual(false);
  });

});
