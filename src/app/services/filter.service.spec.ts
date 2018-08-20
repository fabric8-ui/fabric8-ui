import {
  async,
  getTestBed,
  inject,
  TestBed
} from '@angular/core/testing';
import {
    BaseRequestOptions,
    Response,
    ResponseOptions,
    XHRBackend
} from '@angular/http';
import {
    MockBackend,
    MockConnection
} from '@angular/http/testing';
import { ActivatedRoute } from '@angular/router';
import { Spaces } from 'ngx-fabric8-wit';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { WorkItem } from './../models/work-item';
import { FilterService } from './filter.service';
import { HttpService } from './http-service';

describe('Unit Test :: Filter Service', () => {
  let filterService: FilterService;
  let backend: MockBackend;
  let mockActivatedRoute = {
    snapshot: {
      queryParams: { }
    }
  } as ActivatedRoute;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [],
        providers: [
          BaseRequestOptions,
          MockBackend,
          FilterService,
          Spaces,
          { provide: ActivatedRoute,
            useValue: mockActivatedRoute
          },
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
      mockActivatedRoute.snapshot.queryParams = {q: ''};
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
  });

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
  });

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
  });

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
  });

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
  });

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
  });


  /**
   * Tests to check constructQueryURL function
   * Test cases
   *
   * Input - ('iteration%3Asprint%20%231%2Fsprint%20%231.1', {'parentexists': true})
   * Output - '(iteration%3Asprint%20%231%2Fsprint%20%231.1)%20$AND%20(parentexists%3Atrue)'
   */

  it('should return existing query in case of empty options', () => {
    expect(
      filterService.constructQueryURL('iteration%3Asprint%20%231%2Fsprint%20%231.1', {})
    ).toBe(
      'iteration:sprint #1/sprint #1.1'
    );
  });

  it('should return processed options in case of empty existing query', () => {
    expect(
      filterService.constructQueryURL('', {'parentexists': true})
    ).toBe(
      'parentexists:true'
    );
  });

  it('should return processed options in case of empty existing query', () => {
    expect(
      filterService.constructQueryURL('', {'parentexists': true, 'iteration': 'Sprint #1/Sprint #1.1'})
    ).toBe(
      '(parentexists:true $AND iteration:Sprint #1/Sprint #1.1)'
    );
  });

  it('should return processed options in case of empty existing query', () => {
    expect(
      filterService.constructQueryURL('iteration%3ASprint%20%231%2FSprint%20%231.1', {'parentexists': true})
    ).toBe(
      '(iteration:Sprint #1/Sprint #1.1 $AND parentexists:true)'
    );
  });

  it('should return processed options in case of empty existing query - 1', () => {
    expect(
      filterService.constructQueryURL('iteration%3ASprint%20%231%2FSprint%20%231.1', {'somekey': 'somevalue, anothervalue'})
    ).toBe(
      '(iteration:Sprint #1/Sprint #1.1 $AND somekey:somevalue $AND somekey: anothervalue)'
    );
  });

  /**
   * Query string to JSON conversion
   * Method to test - queryToJson
   */
  it('should return correct JSON object - 1', () => {
    expect(filterService.queryToJson('a:b')).toEqual({'$OR': [{'a': {'$EQ': 'b'}}]});
  });

  it('should return correct JSON object - 1.1', () => {
    expect(filterService.queryToJson('a!b')).toEqual({'$OR': [{'a': {'$NE': 'b'}}]});
  });

  it('should return correct JSON object - 1.2', () => {
    expect(filterService.queryToJson('a ! b')).toEqual({'$OR': [{'a': {'$NE': 'b'}}]});
  });

  it('should return correct JSON object - 1.3', () => {
    expect(filterService.queryToJson('a : b')).toEqual({'$OR': [{'a': {'$EQ': 'b'}}]});
  });

  it('should return correct JSON object - 2', () => {
    expect(filterService.queryToJson('a:b $AND c:d')).toEqual({'$AND': [{'a': {'$EQ': 'b'}}, {'c': {'$EQ': 'd'}}]});
  });

  it('should return correct JSON object - 3', () => {
    expect(filterService.queryToJson('a:b $AND c:d $OR d:e')).toEqual({'$OR': [{'$AND': [{'a': {'$EQ': 'b'}}, {'c': {'$EQ': 'd'}}]}, {'d': {'$EQ': 'e'}}]});
  });

  it('should return correct JSON object - 4', () => {
    expect(filterService.queryToJson('a:b $OR c:d $OR d:e')).toEqual({'$OR': [{'a': {'$EQ': 'b'}}, {'c': {'$EQ': 'd'}}, {'d': {'$EQ': 'e'}}]});
  });

  it('should return correct JSON object - 5', () => {
    expect(filterService.queryToJson('a:b $OR (c:d $AND d:e $AND (l:m $OR n:p)) $AND f:g'))
    .toEqual({'$OR': [{'a': {'$EQ': 'b'}}, {'$AND': [{'c': {'$EQ': 'd'}}, {'d': {'$EQ': 'e'}}, {'$OR': [{'l': {'$EQ': 'm'}}, {'n': {'$EQ': 'p'}}]}, {'f': {'$EQ': 'g'}}]}]});
  });

  it('should return correct JSON object - 5.1', () => {
    expect(filterService.queryToJson('(a!b $OR (c:d $AND d:e $AND (l:m $OR n:p)) $AND f:g)'))
    .toEqual({'$OR': [{'a': {'$NE': 'b'}}, {'$AND': [{'c': {'$EQ': 'd'}}, {'d': {'$EQ': 'e'}}, {'$OR': [{'l': {'$EQ': 'm'}}, {'n': {'$EQ': 'p'}}]}, {'f': {'$EQ': 'g'}}]}]});
  });


  it('should return correct query string - 7', () => {
    expect(filterService.jsonToQuery({'$OR': [{'a': {'$EQ': 'b'}}]})).toBe('(a:b)');
  });

  it('should return correct query string - 7.1', () => {
    expect(filterService.jsonToQuery({'$OR': [{'a': {'$NE': 'b'}}]})).toBe('(a!b)');
  });

  it('should return correct query string - 7.2', () => {
    expect(filterService.jsonToQuery({'$OR': [{'a': {'$SUBSTR': 'b'}}]})).toBe('(a:b)');
  });

  it('should return correct query string - 8', () => {
    expect(filterService.jsonToQuery({'$AND': [{'a': {'$EQ': 'b'}}, {'c': {'$EQ': 'd'}}]}))
    .toBe('(a:b $AND c:d)');
  });

  it('should return correct query string - 9', () => {
    expect(filterService.jsonToQuery({'$OR': [{'$AND': [{'a': {'$EQ': 'b'}}, {'c': {'$EQ': 'd'}}]}, {'d': {'$EQ': 'e'}}]}))
    .toBe('((a:b $AND c:d) $OR d:e)');
  });

  it('should return correct query string - 10', () => {
    expect(filterService.jsonToQuery({'$OR': [{'a': {'$EQ': 'b'}}, {'c': {'$EQ': 'd'}}, {'d': {'$EQ': 'e'}}]}))
    .toBe('(a:b $OR c:d $OR d:e)');
  });

  it('should return correct query string - 11', () => {
    expect(filterService.jsonToQuery({'$OR': [{'a': {'$EQ': 'b'}}, {'$AND': [{'c': {'$EQ': 'd'}}, {'d': {'$EQ': 'e'}}, {'$OR': [{'l': {'$EQ': 'm'}}, {'n': {'$EQ': 'p'}}]}, {'f': {'$EQ': 'g'}}]}]}))
    .toBe('(a:b $OR (c:d $AND d:e $AND (l:m $OR n:p) $AND f:g))');
  });

  it('should return correct query string - 12', () => {
    expect(
      filterService.queryToJson(
        filterService.jsonToQuery(
          {'$OR': [{'a': {'$EQ': 'b'}}, {'$AND': [{'c': {'$EQ': 'd'}}, {'d': {'$EQ': 'e'}}, {'$OR': [{'l': {'$EQ': 'm'}}, {'n': {'$EQ': 'p'}}]}, {'f': {'$EQ': 'g'}}]}]}
        )
      )
    )
    .toEqual(
      {'$OR': [{'a': {'$EQ': 'b'}}, {'$AND': [{'c': {'$EQ': 'd'}}, {'d': {'$EQ': 'e'}}, {'$OR': [{'l': {'$EQ': 'm'}}, {'n': {'$EQ': 'p'}}]}, {'f': {'$EQ': 'g'}}]}]}
  );
  });

  it('should return correct query string - 12.1', () => {
    expect(
      filterService.queryToJson(
        filterService.jsonToQuery(
          {'$OR': [{'a': {'$EQ': 'b'}}, {'$AND': [{'c': {'$NE': 'd'}}, {'d': {'$EQ': 'e'}}, {'$OR': [{'l': {'$EQ': 'm'}}, {'n': {'$EQ': 'p'}}]}, {'f': {'$EQ': 'g'}}]}]}
        )
      )
    )
    .toEqual(
      {'$OR': [{'a': {'$EQ': 'b'}}, {'$AND': [{'c': {'$NE': 'd'}}, {'d': {'$EQ': 'e'}}, {'$OR': [{'l': {'$EQ': 'm'}}, {'n': {'$EQ': 'p'}}]}, {'f': {'$EQ': 'g'}}]}]}
    );
  });

  it('should return correct query string - 12.2', () => {
    expect(
      filterService.queryToJson(
        filterService.jsonToQuery(
          {'$OR': [{'a': {'$EQ': 'b'}}, {'$AND': [{'c': {'$NE': 'd'}}, {'d': {'$EQ': 'e'}}, {'$OR': [{'l': {'$EQ': 'm'}}, {'n': {'$EQ': 'p'}}]}, {'f': {'$EQ': 'g'}}]}]}
        )
      )
    )
    .toEqual(
      {'$OR': [{'a': {'$EQ': 'b'}}, {'$AND': [{'c': {'$NE': 'd'}}, {'d': {'$EQ': 'e'}}, {'$OR': [{'l': {'$EQ': 'm'}}, {'n': {'$EQ': 'p'}}]}, {'f': {'$EQ': 'g'}}]}]}
    );
  });

  it('should return correct query string - 12.3', () => {
    expect(
      filterService.queryToJson(
        filterService.jsonToQuery(
          {'$OR': [{'a': {'$EQ': null}}, {'$AND': [{'c': {'$EQ': 'd'}}, {'d': {'$EQ': 'e'}}, {'$OR': [{'l': {'$EQ': 'm'}}, {'n': {'$EQ': 'p'}}]}, {'f': {'$EQ': 'g'}}]}]}
        )
      )
    )
    .toEqual(
      {'$OR': [{'a': {'$EQ': null}}, {'$AND': [{'c': {'$EQ': 'd'}}, {'d': {'$EQ': 'e'}}, {'$OR': [{'l': {'$EQ': 'm'}}, {'n': {'$EQ': 'p'}}]}, {'f': {'$EQ': 'g'}}]}]}
  );
  });

  it('should return correct query string - 12.4', () => {
    expect(
      filterService.queryToJson(
        filterService.jsonToQuery(
          {'$OR': [{'a': {'$EQ': ''}}, {'$AND': [{'c': {'$EQ': 'd'}}, {'d': {'$EQ': 'e'}}, {'$OR': [{'l': {'$EQ': 'm'}}, {'n': {'$EQ': 'p'}}]}, {'f': {'$EQ': 'g'}}]}]}
        )
      )
    )
    .toEqual(
      {'$OR': [{'a': {'$EQ': null}}, {'$AND': [{'c': {'$EQ': 'd'}}, {'d': {'$EQ': 'e'}}, {'$OR': [{'l': {'$EQ': 'm'}}, {'n': {'$EQ': 'p'}}]}, {'f': {'$EQ': 'g'}}]}]}
  );
  });

  it('should return correct JSON object (with IN operator) - 13', () => {
    expect(filterService.queryToJson('a : b,c,f,d')).toEqual({'$OR': [{'a': {'$IN': ['b', 'c', 'f', 'd']}}]});
  });

  it('should return correct JSON object (with IN operator) - 13.1', () => {
    expect(filterService.jsonToQuery({'$OR': [{'a': {'$IN': ['b', 'c', 'f', 'd']}}]}))
    .toEqual('(a:b,c,f,d)');
  });

  it('should return correct query string - 13.2', () => {
    expect(filterService.jsonToQuery({'$OR': [{'a': {'$EQ': 'b'}}, {'$AND': [{'c': {'$EQ': 'd'}}, {'d': {'$EQ': 'e'}}, {'$OR': [{'l': {'$EQ': 'm'}}, {'n': {'$EQ': 'p'}}]}, {'f': {'$IN': ['g', 'h', 'i']}}]}]}))
    .toBe('(a:b $OR (c:d $AND d:e $AND (l:m $OR n:p) $AND f:g,h,i))');
  });

  it('should return correct query string - 13.3', () => {
    expect(
      filterService.queryToJson(
        filterService.jsonToQuery(
          {'$OR': [{'a': {'$EQ': 'b'}}, {'$AND': [{'c': {'$NE': 'd'}}, {'d': {'$EQ': 'e'}}, {'$OR': [{'l': {'$EQ': 'm'}}, {'n': {'$IN': ['p', 'q', 'r']}}]}, {'f': {'$EQ': 'g'}}]}]}
        )
      )
    )
    .toEqual(
      {'$OR': [{'a': {'$EQ': 'b'}}, {'$AND': [{'c': {'$NE': 'd'}}, {'d': {'$EQ': 'e'}}, {'$OR': [{'l': {'$EQ': 'm'}}, {'n': {'$IN': ['p', 'q', 'r']}}]}, {'f': {'$EQ': 'g'}}]}]}
    );
  });


  it('Should build correct query - 14', () => {
    expect(
      filterService.queryBuilder(
        'some_key',
        filterService.equal_notation,
        'some_value'
      )
    )
    .toEqual(
      {'some_key': {'$EQ': 'some_value'}}
    );
  });

  it('Should build correct query - 14.1', () => {
    expect(
      filterService.queryBuilder(
        'some_key',
        filterService.equal_notation,
        ['some_value', 'some_value1', 'some_value2', 'some_value3']
      )
    )
    .toEqual(
      {'some_key': {'$EQ': ['some_value', 'some_value1', 'some_value2', 'some_value3']}}
    );
  });

  it('Should throw error on invalid notation - 15', () => {
    expect(
      function() {
        filterService.queryBuilder(
          'key',
          'invalid_notation',
          'value'
        );
      }
    )
    .toThrow(new Error('Not a valid compare notation'));
  });

  it('Should correctly join - 16', () => {
    expect(
      filterService.queryJoiner(
        {},
        '$AND',
        {'some_key': {'$EQ': ['some_value', 'some_value1', 'some_value2', 'some_value3']}}
      )
    )
    .toEqual({'$OR': [{'some_key': {'$EQ': ['some_value', 'some_value1', 'some_value2', 'some_value3']}}]});
  });

  it('Should correctly join - 16.1', () => {
    expect(
      filterService.queryJoiner(
        {},
        '$AND',
        {'$OR': [{'some_key': {'$EQ': ['some_value', 'some_value1', 'some_value2', 'some_value3']}}]}
      )
    )
    .toEqual({'$OR': [{'some_key': {'$EQ': ['some_value', 'some_value1', 'some_value2', 'some_value3']}}]});
  });

  it('Should correctly join - 17', () => {
    expect(
      filterService.queryJoiner(
        {'$OR': [{'some_key': {'$EQ': ['some_value', 'some_value1', 'some_value2', 'some_value3']}}]},
        '$AND',
        {}
      )
    )
    .toEqual(
      {'$OR': [{'some_key': {'$EQ': ['some_value', 'some_value1', 'some_value2', 'some_value3']}}]}
    );
  });

  it('Should correctly join - 18', () => {
    expect(
      function() {
        filterService.queryJoiner(
          {'some_key': 'some_value'},
          '$AND',
          {'$OR': [{'some_key': 'some_value3'}]}
        );
      }
    )
    .toThrow(new Error('Existing query object is invalid without a joiner in root'));
  });

  it('Should correctly join - 19', () => {
    expect(
      filterService.queryJoiner(
        {'$OR': [{'some_key1': 'some_value1'}]},
        '$OR',
        {'$OR': [{'some_key': 'some_value3'}]}
      )
    )
    .toEqual(
      {'$OR': [{'some_key1': 'some_value1'}, {'some_key': 'some_value3'}]}
    );
  });

  it('Should correctly join - 20', () => {
    expect(
      filterService.queryJoiner(
        {'$OR': [{'some_key1': 'some_value1'}]},
        '$AND',
        {'$OR': [{'some_key': 'some_value3'}]}
      )
    )
    .toEqual(
      {'$AND': [{'some_key1': 'some_value1'}, {'some_key': 'some_value3'}]}
    );
  });

  it('Should correctly join - 21', () => {
    expect(
      filterService.queryJoiner(
        {'$OR': [{'some_key1': 'some_value1'}]},
        '$AND',
        {'some_key': 'some_value3'}
      )
    )
    .toEqual(
      {'$AND': [{'some_key1': 'some_value1'}, {'some_key': 'some_value3'}]}
    );
  });

  it('Should correctly join - 21.1', () => {
    expect(
      filterService.queryJoiner(
        {'$OR': [{'some_key1': 'some_value1'}, {'some_key2': 'some_value2'}]},
        '$AND',
        {'some_key3': 'some_value3'}
      )
    )
    .toEqual(
      {'$AND': [{'$OR': [{'some_key1': 'some_value1'}, {'some_key2': 'some_value2'}]}, {'some_key3': 'some_value3'}]}
    );
  });

  it('Should correctly join - 21.2', () => {
    expect(
      filterService.queryJoiner(
        {'$OR': [{'some_key1': 'some_value1'}]},
        '$AND',
        {'$OR': [{'some_key3': 'some_value3'}]}
      )
    )
    .toEqual(
      {'$AND': [{'some_key1': 'some_value1'}, {'some_key3': 'some_value3'}]}
    );
  });

  it('Should correctly join - 21.3', () => {
    expect(
      filterService.queryJoiner(
        {'$OR': [{'some_key1': 'some_value1'}]},
        '$AND',
        {'$OR': [{'some_key3': 'some_value3'}, {'some_key4': 'some_value4'}]}
      )
    )
    .toEqual(
      {'$AND': [{'some_key1': 'some_value1'}, {'$OR' : [{'some_key3': 'some_value3'}, {'some_key4': 'some_value4'}]}]}
    );
  });

  it('Should correctly join - 21.4', () => {
    expect(
      filterService.queryJoiner(
        {'$OR': [{'some_key3': 'some_value3'}, {'some_key4': 'some_value4'}]},
        '$AND',
        {'$OR': [{'some_key1': 'some_value1'}]}
      )
    )
    .toEqual(
      {'$AND': [{'$OR' : [{'some_key3': 'some_value3'}, {'some_key4': 'some_value4'}]}, {'some_key1': 'some_value1'}]}
    );
  });

  it('Should correctly join - 21.4', () => {
    expect(
      filterService.queryJoiner(
        {'$OR': [{'some_key1': 'some_value1'}]},
        '$AND',
        {'$AND': [{'some_key3': 'some_value3'}, {'some_key4': 'some_value4'}]}
      )
    )
    .toEqual(
      {'$AND': [{'some_key1': 'some_value1'}, {'some_key3': 'some_value3'}, {'some_key4': 'some_value4'}]}
    );
  });

  it('Should correctly join - 22', () => {
    expect(
      filterService.queryJoiner(
        {'$OR': [{'some_key1': 'some_value1'}]},
        '$OR',
        {'some_key': 'some_value3'}
      )
    )
    .toEqual(
      {'$OR': [{'some_key1': 'some_value1'}, {'some_key': 'some_value3'}]}
    );
  });

  it('Should correctly build and join query - 23', () => {

    // Build type query

    const wi_key = 'workitemtype';
    const wi_compare = filterService.in_notation;
    const wi_value = ['type_id_1', 'type_id_2'];

    const type_query = filterService.queryBuilder(wi_key, wi_compare, wi_value);
    const should_type_query = {
      'workitemtype': {
        '$IN': ['type_id_1', 'type_id_2']
      }
    };

    expect(type_query).toEqual(should_type_query);

    // Build space query

    const s_key = 'space';
    const s_compare = filterService.equal_notation;
    const s_value = 'space_id_1';

    const space_query = filterService.queryBuilder(s_key, s_compare, s_value);

    const should_space_query = {
      'space': {
        '$EQ': 'space_id_1'
      }
    };
    expect(space_query).toEqual(should_space_query);

    // Join query
    const first_join = filterService.queryJoiner({}, '$AND', space_query);
    const expected_first_join = {
      '$OR': [space_query]
    };

    expect(first_join).toEqual(expected_first_join);

    // Join wiTypes with space
    const second_join = filterService.queryJoiner(first_join, '$AND', type_query);
    const expected_second_join = {
      '$AND': [space_query, type_query]
    };

    expect(second_join).toEqual(expected_second_join);

  });

  it('should convert to json', () => {
    expect(filterService.queryToJson('typegroup.name:Work Items $AND iteration.name:Sprint #101')).toEqual({'$AND': [{'typegroup.name': {'$EQ': 'Work Items'}}, {'iteration.name': {'$EQ': 'Sprint #101'}}]});
  });

  it('should get a condition form query', () => {
    expect(filterService.getConditionFromQuery('typegroup.name:Work Items', 'typegroup.name')).toEqual('Work Items');
  });

  it('should get a condtion from query - 2', () => {
    expect(filterService.getConditionFromQuery('typegroup.name:Work Items $AND iteration.name:Sprint #101', 'typegroup.name')).toEqual('Work Items');
  });

  it('should get a condtion from query - 3', () => {
    expect(filterService.getConditionFromQuery('typegroup.name:Work Items $OR iteration.name:Sprint #101', 'typegroup.name')).toEqual(undefined);
  });

});
