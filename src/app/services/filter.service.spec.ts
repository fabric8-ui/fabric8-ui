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

  it('should match the assignee filter', () => {
    const workItem = {
      relationships: {
        assignees: {
          data: [
            {
              id: 'assignee-id-1'
            }
          ]
        }
      }
    };
    filterService.activeFilters = [{
      id: 'assignee',
      value: 'assignee-id-1',
      paramKey: 'filter[assignee]'
    }];
    expect(filterService.doesMatchCurrentFilter(workItem as WorkItem)).toBeTruthy();
  })

  it('should not match the assignee filter', () => {
    const workItem = {
      relationships: {
        assignees: {
          data: [
            {
              id: 'assignee-id-1'
            }
          ]
        }
      }
    };
    filterService.activeFilters = [{
      id: 'assignee',
      value: 'assignee-id-2',
      paramKey: 'filter[assignee]'
    }];
    expect(filterService.doesMatchCurrentFilter(workItem as WorkItem)).toBeFalsy();
  })

  it('should not match the assignee filter if attribute data is not there', () => {
    const workItem = {
      relationships: {
        assignees: {
          data: []
        }
      }
    };
    filterService.activeFilters = [{
      id: 'assignee',
      value: 'assignee-id-2',
      paramKey: 'filter[assignee]'
    }];
    expect(filterService.doesMatchCurrentFilter(workItem as WorkItem)).toBeFalsy();
  })

  it('should not match the assignee filter if attribute assignees is not there', () => {
    const workItem = {
      relationships: {}
    };
    filterService.activeFilters = [{
      id: 'assignee',
      value: 'assignee-id-2',
      paramKey: 'filter[assignee]'
    }];
    expect(filterService.doesMatchCurrentFilter(workItem as WorkItem)).toBeFalsy();
  })

  it('should match the assignee and area filter', () => {
    const workItem = {
      relationships: {
        assignees: {
          data: [
            {
              id: 'assignee-id-1'
            }
          ]
        },
        area: {
          data: {
            id: 'area-id-1'
          }
        }
      }
    };
    filterService.activeFilters = [{
      id: 'assignee',
      value: 'assignee-id-1',
      paramKey: 'filter[assignee]'
    },
    {
      id: 'area',
      value: 'area-id-1',
      paramKey: 'filter[area]'
    }];
    expect(filterService.doesMatchCurrentFilter(workItem as WorkItem)).toBeTruthy();
  })

  it('should not match the assignee and area filter when atleast one is wrong', () => {
    const workItem = {
      relationships: {
        assignees: {
          data: [
            {
              id: 'assignee-id-1'
            }
          ]
        },
        area: {
          data: {
            id: 'area-id-2'
          }
        }
      }
    };
    filterService.activeFilters = [{
      id: 'assignee',
      value: 'assignee-id-1',
      paramKey: 'filter[assignee]'
    },
    {
      id: 'area',
      value: 'area-id-1',
      paramKey: 'filter[area]'
    }];
    expect(filterService.doesMatchCurrentFilter(workItem as WorkItem)).toBeFalsy();
  })


  /**
   * Tests to check constructQueryURL function
   * Test cases
   *
   * Input - ('iteration%3Asprint%20%231%2Fsprint%20%231.1', {'parentexists': true})
   * Output - '(iteration%3Asprint%20%231%2Fsprint%20%231.1)%20AND%20(parentexists%3Atrue)'
   */

  it('should return existing query in case of empty options', () => {
    expect(
      filterService.constructQueryURL('iteration%3Asprint%20%231%2Fsprint%20%231.1', {})
    ).toBe(
      'iteration:sprint #1/sprint #1.1'
    );
  })

  it('should return processed options in case of empty existing query', () => {
    expect(
      filterService.constructQueryURL('', {'parentexists': true})
    ).toBe(
      'parentexists:true'
    );
  })

  it('should return processed options in case of empty existing query', () => {
    expect(
      filterService.constructQueryURL('', {'parentexists': true, 'iteration': 'Sprint #1/Sprint #1.1'})
    ).toBe(
      '(parentexists:true AND iteration:Sprint #1/Sprint #1.1)'
    );
  })

  it('should return processed options in case of empty existing query', () => {
    expect(
      filterService.constructQueryURL('iteration%3ASprint%20%231%2FSprint%20%231.1', {'parentexists': true})
    ).toBe(
      '(iteration:Sprint #1/Sprint #1.1 AND parentexists:true)'
    );
  })

  /**
   * Query string to JSON conversion
   * Method to test - queryToJson
   */
  it('should return correct JSON object - 1', () => {
    expect(filterService.queryToJson('a:b')).toEqual({'OR': [{'a':'b'}]});
  });

  it('should return correct JSON object - 2', () => {
    expect(filterService.queryToJson('a:b AND c:d')).toEqual({'AND': [{'a':'b'}, {'c': 'd'}]});
  });

  it('should return correct JSON object - 3', () => {
    expect(filterService.queryToJson('a:b AND c:d OR d:e')).toEqual({'OR': [{'AND': [{'a': 'b'}, {'c':'d'}]}, {'d': 'e'}]});
  });

  it('should return correct JSON object - 4', () => {
    expect(filterService.queryToJson('a:b OR c:d OR d:e')).toEqual({'OR': [{'a': 'b'}, {'c':'d'}, {'d': 'e'}]});
  });

  it('should return correct JSON object - 5', () => {
    expect(filterService.queryToJson('a:b OR (c:d AND d:e AND (l:m OR n:p)) AND f:g'))
    .toEqual({'OR':[{'a':'b'},{'AND':[{'c':'d'},{'d':'e'},{'OR':[{'l':'m'},{'n':'p'}]},{'f':'g'}]}]});
  });

});
