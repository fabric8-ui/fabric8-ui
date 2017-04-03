
/*
 * This class contains mock generator code for iterations.
 */
export class IterationMockGenerator {

  /*
   * Creates an array of 5 mock iterations with IDs 'iteration-id0' to 'iteration-id25'.
   * Other data structures in the mock generator rely on the id naming,
   * creating a consistent mock data. Keep in mind when changing this code.
   */
  public createIterations(): any {
    let iterations = [0, 1, 2, 3, 4, 5].map((n) => {
      return {
        'attributes': {
          'description': 'Description for iteration ' + n,
          'name': 'Iteration ' + n,
          'state': 'new',
          'parent_path': '',
          'resolved_parent_path': ''
        },
        'id': 'iteration-id' + n,
        'links': {
          'self': 'http://mock.service/api/iterations/iteration-id' + n
        },
        'relationships': {
          'parent': {
            'data': {
              'id': '',
              'type': ''
            },
            'links': {
              'self': ''
            }
          },
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
              'related': 'http://mock.service/api/workitems?filter[iteration]=iteration-id' + n
            },
            'meta': {
              'total' : 0,
              'closed' : 0
            }
          }
        },
        'type': 'iterations'
      };
    });
    return iterations;
  }
}

