
/*
 * This class contains mock generator code for spaces.
 */
export class SpaceMockGenerator {

  /*
   * Creates an array of 25 mock spaces with IDs 'space-id0' to 'space-id25'.
   * Other data structures in the mock generator rely on the id naming,
   * creating a consistent mock data. Keep in mind when changing this code.
   */
  public createSpaces(): any {
    let spaces = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((n) => {
      return {
        'attributes': {
          'created-at': this.dateTime(n),
          'description': 'Description ' + n,
          'name': 'Space ' + n,
          'updated-at': this.dateTime(n),
          'version': 0
        },
        'id': 'space-id' + n,
        'links': {
          'self': 'http://mock.service/api/spaces/space-id' + n,
          'filters': 'http://mock.service/api/spaces/space-id' + n + '/filters',
        },
        'relationships': {
          'iterations': {
            'links': {
              'related': 'http://mock.service/api/spaces/space-id' + n + '/iterations'
            }
          },
          'areas': {
            'links': {
              'related': 'http://mock.service/api/spaces/space-id' + n + '/areas'
            }
          },
          'codebases': {
            'links': {
              'related': 'http://mock.service/api/spaces/space-id' + n + '/codebases'
            }
          },
          'collaborators': {
            'links': {
              'related': 'http://mock.service/api/spaces/space-id' + n + '/collaborators'
            }
          },
          'workitems': {
            'links': {
              'related': 'http://mock.service/api/spaces/space-id' + n + '/workitems'
            }
          }
        },
        'type': 'spaces'
      };
    });
    return spaces;
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
}
