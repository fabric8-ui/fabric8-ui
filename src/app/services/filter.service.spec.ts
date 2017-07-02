import { WorkItem } from './../models/work-item';
import { AuthenticationService } from 'ngx-login-client';
import {
  inject,
  async,
  getTestBed,
  TestBed
} from '@angular/core/testing';
import {
    BaseRequestOptions,
    Response,
    ResponseOptions,
    XHRBackend
} from '@angular/http';
import { HttpService } from './http-service';
import {
    MockBackend,
    MockConnection
} from '@angular/http/testing';
import { Spaces } from 'ngx-fabric8-wit';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { FilterService } from './filter.service';

describe('Unit Test :: Filter Service', () => {
  let filterService: FilterService;
  let backend: MockBackend;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [],
        providers: [
          BaseRequestOptions,
          MockBackend,
          FilterService,
          Spaces,
          {
            provide: WIT_API_URL,
            useValue: 'https://api.url.com'
          },
          {
            deps: [
              MockBackend,
              BaseRequestOptions
            ],
            provide: HttpService,
            useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions, auth: AuthenticationService) => {
                return new HttpService(backend, defaultOptions, auth);
            }
          }
        ]
      });
      const testbed = getTestBed();
      backend = testbed.get(MockBackend);
      filterService = testbed.get(FilterService);
    })
  );
  it('should execute the canary test', () => expect(true).toBe(true));
  it('should match the current filter', () => expect(filterService.doesMatchCurrentFilter({} as WorkItem)).toBe(true))
});
