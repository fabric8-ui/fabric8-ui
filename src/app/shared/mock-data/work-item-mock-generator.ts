
/*
 * This class contains mock generator code for work items and
 * dependend entities like links and comments.
 */
export class WorkItemMockGenerator {

  /*
   * Returns a map structure containing initial work item comments. The structure
   * represents a map with the key being the work item id and the value the
   * comment structure.
   */
  public createWorkItemChilds(): any {
    let workItems = this.createWorkItems();
    return {
      'id0': [ workItems[5], workItems[6], workItems[7] ],
      'id1': [ workItems[8], workItems[9], workItems[10] ]
    };
  }

  /*
   * Returns a map structure containing initial work item comments. The structure
   * represents a map with the key being the work item id and the value the
   * comment structure.
   */
  public createWorkItemComments(): any {
    return {
      'id0':
        {
          'data': [
            {
              'attributes': {
                'body': 'Some Comment 0',
                'created-at': '2000-01-01T09:00:00.000000Z'
              },
              'id': 'comment-0',
              'links': {
                'self': 'http://demo.api.almighty.io/api/comments/comment-0'
              },
              'relationships': {
                'created-by': {
                  'data': {
                    'id': 'user0',
                    'type': 'identities'
                  }
                }
              },
              'type': 'comments'
            }
          ]
        }
    };
  }

  /*
   * Creates an initial work item links structure.
   */
  public createWorkItemLinks(): any {
    return [
        {
          id: 'wil-0',
          type: 'workitemlinks',
          attributes: {
              version: 0
          },
          'links': {
            'self': 'http://mock.service/api/workitemlinks/wil-0'
          },
          relationships: {
            link_type: {
              data: {
                id: 'wilt-0',
                type: 'workitemlinktypes'
              }
            },
            source: {
              data: {
                  id: 'id0',
                  type: 'workitems'
              }
            },
            target: {
              data: {
                  id: 'id1',
                  type: 'workitems'
              }
            }
          }
        }
    ];
  }
  public dateTime(numberDate: any): any {
    // numberDate is mock work item id's
    var d = new Date();
    if (numberDate == 0) {
      //return current date/time
       return d;
    }else if (numberDate == 1){
      d.setMinutes(d.getMinutes() - 17);
      // this gives date which is 17 minutes ago from current date
    }else if (numberDate == 2){
      d.setHours(d.getHours() - 8);
      // this gives date which is 8 hours ago from current date
    }else if (numberDate == 3){
      d.setDate(d.getDate() - numberDate);
      // this gives date which is 1 day ago from current date
    }else if (numberDate == 4){
      d.setDate(d.getDate() - 15);
      // this gives date which is 15 days ago from current date
    }else if (numberDate == 5){
      d.setDate(d.getDate() - 25);
      // this gives date which is 25 days ago from current date
    }else if (numberDate == 6){
      d.setDate(d.getDate() - 30);
      // this gives date which is a month ago from current date
    }else if (numberDate == 7){
      d.setFullYear(d.getFullYear() - 12);
      // this gives date which is a year ago from current date
    }else if (numberDate == 8){
      d.setFullYear(d.getFullYear() + 12);
      // this gives date which is a 12 years after from current date
    }
    return d;
  }
  /*
   * Creates an array of 25 mock work items with IDs 'id0' to 'id25'.
   * Other data structures in the mock generator rely on the id naming,
   * creating a consistent mock data. Keep in mind when changing this code.
   */
  public createWorkItems(): any {
    let workitems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((n) => {
      return {
        'attributes': {
          'system.created_at': this.dateTime(n),
          'system.description': 'Description Text ' + n,
          'system.description.rendered': 'Description Text ' + n,
          'system.remote_item_id': 'remote_id_' + n,
          'system.state': (n % 2) ? ((n % 3) ? 'new' : 'in progress') : ((n % 3) ? 'new' : 'in progress'),
          'system.title': 'Title Text ' + n,
          'version': 6
        },
        'id': 'id' + n,
        'links': {
          'self': 'http://mock.service/api/workitems/id' + n,
          'sourceLinkTypes': 'http://mock.service/api/source-link-types',
          'targetLinkTypes': 'http://mock.service/api/target-link-types'
        },
        'relationships': {
          'assignees': { },
          'iteration': { },
          'area': { },
          'baseType': {
            'data': {
              'id': (n % 2) ? '86af5178-9b41-469b-9096-57e5155c3f31' : 'bbf35418-04b6-426c-a60b-7f80beb0b624',
              'type': 'workitemtypes'
            }
          },
          'comments': {
            'links': {
              'related': 'http://mock.service/api/workitems/id' + n + '/comments',
              'self': 'http://mock.service/api/workitems/id' + n + '/relationships/comments'
            }
          },
          'children': {
            'links': {
              'related': 'http://mock.service/api/workitems/id' + n + '/childs'
            },
            'meta': {
              'hasChildren': (n == 0 || n == 1) ? true : false, // the first two work items will have childs
            }
          },
          'creator': {
            'data': {
              'id': 'user0',
              'imageURL': 'https://avatars.githubusercontent.com/u/2410471?v=3',
              'links': {
                'self': 'http://mock.service/api/user'
              },
              'type': 'identities'
            }
          },
          'codebase': {
            'links' : {
              'meta' : {
                'edit' : 'http://mock.service/codebase',
                }
              }
            }
        },
        'type': 'workitems'
      };
    });
    return workitems;
  }
}
