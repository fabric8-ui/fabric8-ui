
/*
 * This class contains mock generator code for areas.
 */
export class AreaMockGenerator {

  /*
   * Creates an array of 5 mock areas with IDs 'area-id0' to 'area-id25'.
   * Other data structures in the mock generator rely on the id naming,
   * creating a consistent mock data. Keep in mind when changing this code.
   */
  public createAreas(): any {
    let areas = [{
      'attributes': {
          'description': 'Description for Root Area.',
          'name': 'Root Area',
          'parent_path': '/',
          'parent_path_resolved': '/'
        },
        'id': 'rootarea',
        'links': {
          'self': 'http://mock.service/api/areas/rootarea'
        },
        'relationships': {
          'space': {
            'data': {
              'id': 'space-id0',
              'type': 'spaces'
            },
            'links': {
              'self': 'http://mock.service/api/spaces/space-id0'
            }
          },
          'workitems': {
            'links': {
              'related': 'http://mock.service/api/workitems?filter[area]=rootarea'
            }
          }
        },
        'type': 'areas'
    }];
    areas = areas.concat([0, 1, 2, 3, 4, 5].map((n) => {
      return {
        'attributes': {
          'description': 'Description for area ' + n,
          'name': 'Area ' + n,
          'parent_path': '/rootarea',
          'parent_path_resolved': '/Root Area'
        },
        'id': 'area-id' + n,
        'links': {
          'self': 'http://mock.service/api/areas/area-id' + n
        },
        'relationships': {
          'space': {
            'data': {
              'id': 'space-id0',
              'type': 'spaces'
            },
            'links': {
              'self': 'http://mock.service/api/spaces/space-id0'
            }
          },
          'workitems': {
            'links': {
              'related': 'http://mock.service/api/workitems?filter[area]=area-id' + n
            }
          }
        },
        'type': 'areas'
      };
    }));
    // add root area
    return areas;
  }
}
