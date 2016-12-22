import { Logger } from './../shared/logger.service';

import { Injectable } from '@angular/core';
import { WorkItem } from '../work-item/work-item';

/*
  NOTE: IMPORTANT:
    if returning data to the http service, ALWAYS return vanity copies of
    objects, NOT THE LIVING REFERENCES TO STRUCTURES STORED HERE. As the 'real'
    networked service always returns detached object copies, this resembles the
    original behaviour. Also, the returnes references ARE RE-USED, so data could
    change without this class noticing it! THIS HAPPENS. IT HAPPENED. IT SUCKS!
*/

@Injectable()
export class MockDataService {

  private workItems: any[];
  private workItemLinks: any[];
  private workItemComments: any;

  constructor() {
    this.workItems = this.createInitialWorkItems();
    this.workItemLinks = this.createInitialWorkItemLinks();
    this.workItemComments = this.createInitialWorkItemComments();
  }

  private createId(): string {
    var id = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++)
      id += possible.charAt(Math.floor(Math.random() * possible.length));
    console.log('Created new id ' + id);
    return id;
  }

  private makeCopy(input: any): any {
    return JSON.parse(JSON.stringify(input));
  }

  // data accessors

  public getWorkItemLinks(): any {
    return this.makeCopy(this.workItemLinks);
  }

  public getWorkItems(): any {
    return this.makeCopy(this.workItems);
  }

  public createWorkItemLink(workItemLink: any): any {
    var localWorkItemLink = this.makeCopy(workItemLink);
    localWorkItemLink.id = this.createId();
    this.workItemLinks.push(localWorkItemLink);
    return this.makeCopy(localWorkItemLink);
  }

  public createWorkItemOrEntity(extraPath: string, entity: any): any {
    if (extraPath && extraPath.indexOf('/') != -1) {
      // request for subentities on a wi 
      var parts = extraPath.split('/');
      var wiId = parts[0];
      var subselect = parts[1];
      if (subselect === 'comments') {
        console.log('Request create new comment for workitem ' + wiId);
        var newId = this.createId();
        var newComment = {
              'attributes': {
                'body': entity.data.attributes.body,
                'created-at': '2000-01-01T09:00:00.000000Z'
              },
              'id': newId,
              'links': {
                'self': 'http://demo.api.almighty.io/api/comments/' + newId
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
        };
        if (this.workItemComments[wiId])
          this.workItemComments[wiId].data.push(newComment);
        else
          this.workItemComments[wiId] = { data: [ newComment ] };
        return { data: newComment };
      }
      return {};
    }
    var localWorkItem = this.makeCopy(entity.data);
    localWorkItem.id = this.createId();
    localWorkItem.links = { 
          'self': 'http://mock.service/api/workitems/id' + localWorkItem.id
        };
    localWorkItem.relationships = { 
          'assignees': { }, 
          'baseType': { 
            'data': { 
              'id': 'system.userstory', 
              'type': 'workitemtypes' 
            } 
          }, 
          'comments': { 
            'links': { 
              'related': 'http://mock.service/api/workitems/id' + localWorkItem.id + '/comments',
              'self': 'http://mock.service/api/workitems/id' + localWorkItem.id + '/relationships/comments' 
            } 
          }, 
          'creator': { 
            'data': { 
              'id': 'some-creator-id', 
              'links': {
                'self': 'http://mock.service/api/users/some-creator-id'
              },
              'type': 'identities' 
            } 
          } 
        };
    this.workItems.push(localWorkItem);
    return { data: this.makeCopy(localWorkItem) };
  }

  public getWorkItemOrEntity(extraPath: string): any {
    if (extraPath && extraPath.indexOf('/') != -1) {
      // request for subentities on a wi 
      var parts = extraPath.split('/');
      var wiId = parts[0];
      var subselect = parts[1];
      if (subselect === 'comments') {
        console.log('Requested comments for workitem ' + wiId);
        if (this.workItemComments[wiId])
        return this.makeCopy(this.workItemComments[wiId]);
        return { data: [] };
      }
      // should never happen
      return {};
    }
    console.log('Requested workitem ' + extraPath);
    for (var i = 0; i < this.workItems.length; i++)
      if (this.workItems[i].id === extraPath)
        return { data: this.makeCopy(this.workItems[i]) };
  };

  public updateWorkItem(workItem: any): any {
    var localWorkItem = this.makeCopy(workItem);
    for (var i = 0; i < this.workItems.length; i++)
      if (this.workItems[i].id === localWorkItem.id) {
        this.workItems.splice(i, 1, localWorkItem);
        return this.makeCopy(localWorkItem);
      }
    return null;
  }

  public updateWorkItemLink(workItemLink: any): any {
    var localWorkItemLink = this.makeCopy(workItemLink);
    for (var i = 0; i < this.workItemLinks.length; i++)
      if (this.workItemLinks[i].id === localWorkItemLink.id) {
        this.workItemLinks.splice(i, 1, localWorkItemLink);
        return this.makeCopy(localWorkItemLink);
      }
    return null;
  }

  public deleteWorkItem(id: string): boolean {
    for (var i = 0; i < this.workItems.length; i++)
      if (this.workItems[i].id === id) {
        this.workItems.splice(i, 1);
        return true;
      }
      return false;
  }

  public deleteWorkItemLink(id: string): boolean {
    for (var i = 0; i < this.workItemLinks.length; i++)
      if (this.workItemLinks[i].id === id) {
        this.workItemLinks.splice(i, 1);
        return true;
      }
      return false;
  }

  public searchWorkItem(term: string): boolean {
    for (var i = 0; i < this.workItems.length; i++)
      if (this.workItems[i].fields['system.title'].indexOf(term) != -1) {
        return this.makeCopy(this.workItems[i]);
      }
      return false;
  }

  public getLoginStatus() {
    return {
      'status': 200,
      'responseText': 'Good Job'
    };
  }

  public getWorkItemTypes() {
    return [
      {
        'fields': {
          'system.assignee': {
            'required': false,
            'type': {
              'kind': 'user'
            }
          },
          'system.creator': {
            'required': true,
            'type': {
              'kind': 'user'
            }
          },
          'system.description': {
            'required': false,
            'type': {
              'kind': 'string'
            }
          },
          'system.remote_item_id': {
            'required': false,
            'type': {
              'kind': 'string'
            }
          },
          'system.state': {
            'required': true,
            'type': {
              'baseType': 'string',
              'kind': 'enum',
              'values': [
                'new',
                'open',
                'in progress',
                'resolved',
                'closed'
              ]
            }
          },
          'system.title': {
            'required': true,
            'type': {
              'kind': 'string'
            }
          }
        },
        'name': 'system.userstory',
        'version': 0
      },
      {
        'fields': {
          'system.assignee': {
            'required': false,
            'type': {
              'kind': 'user'
            }
          },
          'system.creator': {
            'required': true,
            'type': {
              'kind': 'user'
            }
          },
          'system.description': {
            'required': false,
            'type': {
              'kind': 'string'
            }
          },
          'system.remote_item_id': {
            'required': false,
            'type': {
              'kind': 'string'
            }
          },
          'system.state': {
            'required': true,
            'type': {
              'baseType': 'string',
              'kind': 'enum',
              'values': [
                'new',
                'open',
                'in progress',
                'resolved',
                'closed'
              ]
            }
          },
          'system.title': {
            'required': true,
            'type': {
              'kind': 'string'
            }
          }
        },
        'name': 'system.valueproposition',
        'version': 0
      },
      {
        'fields': {
          'system.assignee': {
            'required': false,
            'type': {
              'kind': 'user'
            }
          },
          'system.creator': {
            'required': true,
            'type': {
              'kind': 'user'
            }
          },
          'system.description': {
            'required': false,
            'type': {
              'kind': 'string'
            }
          },
          'system.remote_item_id': {
            'required': false,
            'type': {
              'kind': 'string'
            }
          },
          'system.state': {
            'required': true,
            'type': {
              'baseType': 'string',
              'kind': 'enum',
              'values': [
                'new',
                'open',
                'in progress',
                'resolved',
                'closed'
              ]
            }
          },
          'system.title': {
            'required': true,
            'type': {
              'kind': 'string'
            }
          }
        },
        'name': 'system.fundamental',
        'version': 0
      },
      {
        'fields': {
          'system.assignee': {
            'required': false,
            'type': {
              'kind': 'user'
            }
          },
          'system.creator': {
            'required': true,
            'type': {
              'kind': 'user'
            }
          },
          'system.description': {
            'required': false,
            'type': {
              'kind': 'string'
            }
          },
          'system.remote_item_id': {
            'required': false,
            'type': {
              'kind': 'string'
            }
          },
          'system.state': {
            'required': true,
            'type': {
              'baseType': 'string',
              'kind': 'enum',
              'values': [
                'new',
                'open',
                'in progress',
                'resolved',
                'closed'
              ]
            }
          },
          'system.title': {
            'required': true,
            'type': {
              'kind': 'string'
            }
          }
        },
        'name': 'system.experience',
        'version': 0
      },
      {
        'fields': {
          'system.assignee': {
            'required': false,
            'type': {
              'kind': 'user'
            }
          },
          'system.creator': {
            'required': true,
            'type': {
              'kind': 'user'
            }
          },
          'system.description': {
            'required': false,
            'type': {
              'kind': 'string'
            }
          },
          'system.remote_item_id': {
            'required': false,
            'type': {
              'kind': 'string'
            }
          },
          'system.state': {
            'required': true,
            'type': {
              'baseType': 'string',
              'kind': 'enum',
              'values': [
                'new',
                'open',
                'in progress',
                'resolved',
                'closed'
              ]
            }
          },
          'system.title': {
            'required': true,
            'type': {
              'kind': 'string'
            }
          }
        },
        'name': 'system.feature',
        'version': 0
      },
      {
        'fields': {
          'system.assignee': {
            'required': false,
            'type': {
              'kind': 'user'
            }
          },
          'system.creator': {
            'required': true,
            'type': {
              'kind': 'user'
            }
          },
          'system.description': {
            'required': false,
            'type': {
              'kind': 'string'
            }
          },
          'system.remote_item_id': {
            'required': false,
            'type': {
              'kind': 'string'
            }
          },
          'system.state': {
            'required': true,
            'type': {
              'baseType': 'string',
              'kind': 'enum',
              'values': [
                'new',
                'open',
                'in progress',
                'resolved',
                'closed'
              ]
            }
          },
          'system.title': {
            'required': true,
            'type': {
              'kind': 'string'
            }
          }
        },
        'name': 'system.bug',
        'version': 0
      }
    ];
  }

  public getUser(): any {
    return {
      attributes: {
        fullName: 'Example User 0',
        imageURL: 'https://avatars.githubusercontent.com/u/2410471?v=3'
      },
      id: 'user0',
      type: 'identities'
    };
  }

  public getAllUsers(): any {
    return [
      {
        attributes: {
          fullName: 'Example User 0',
          imageURL: 'https://avatars.githubusercontent.com/u/2410471?v=3'
        },
        id: 'user0',
        type: 'identities'
      }, {
        attributes: {
          fullName: 'Example User 1',
          imageURL: 'https://avatars.githubusercontent.com/u/2410472?v=3'
        },
        id: 'user1',
        type: 'identities'
      }, {
        attributes: {
          fullName: 'Example User 2',
          imageURL: 'https://avatars.githubusercontent.com/u/2410473?v=3'
        },
        id: 'user2',
        type: 'identities'
      }, {
        attributes: {
          fullName: 'Example User 3',
          imageURL: 'https://avatars.githubusercontent.com/u/2410474?v=3'
        },
        id: 'user3',
        type: 'identities'
      }
    ];
 }

  public getLinkCategories(): any {
    return {
      'data': this.getWorkItemLinkTypes().included,
      'meta': {
        'totalCount': this.getWorkItemLinkTypes().included.length
      }
    };
  }

  public getWorkItemLinkTypes(): any {
    return {
      'data': [
        {
          'id': 'wilt-0',
          'attributes': {
            'description': 'A demo work item link type',
            'forward_name': 'tests',
            'name': 'demo-tested-by',
            'reverse_name': 'tested by',
            'topology': 'network',
            'version': 0
          },
          'links': {
            'self': 'http://mock.service/api/workitemlinkcategories/wil-0'
          },
          'relationships': {
            'link_category': {
              'data': {
                'id': 'wilt-cat-0',
                'type': 'workitemlinkcategories'
              }
            },
            'source_type': {
              'data': {
                'id': 'system.planneritem',
                'type': 'workitemtypes'
              }
            },
            'target_type': {
              'data': {
                'id': 'system.planneritem',
                'type': 'workitemtypes'
              }
            }
          },
          'type': 'workitemlinktypes'
          }
      ],
      'included': [
        {
          'id': 'wilt-cat-0',
          'type': 'workitemlinkcategories',
          'attributes': {
            'description': 'The system category is reserved for link types that are to be manipulated by the system only.',
            'name': 'system',
            'version': 38
          }
        },
        {
          'id': 'wilt-cat-1',
          'type': 'workitemlinkcategories',
          'attributes': {
            'description': 'The user category is reserved for link types that can to be manipulated by the user.',
            'name': 'user',
            'version': 38
          }
        }
      ],
      'meta': {
        'totalCount': 1
      }
    };
  }

  // initial data creators - might be loaded from fixtures in the future

  private createInitialWorkItems(): any {
    let workitems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((n) => {
      return {
        'attributes': { 
          'system.created_at': '0001-01-01T00:00:00Z', 
          'system.description': 'Description Text ' + n, 
          'system.remote_item_id': 'remote_id_' + n, 
          'system.state': 'new', 
          'system.title': 'Title Text ' + n, 
          'version': 6 
        }, 
        'id': 'id' + n, 
        'links': { 
          'self': 'http://mock.service/api/workitems/id' + n 
        }, 
        'relationships': { 
          'assignees': { }, 
          'baseType': { 
            'data': { 
              'id': 'system.userstory', 
              'type': 'workitemtypes' 
            } 
          }, 
          'comments': { 
            'links': { 
              'related': 'http://mock.service/api/workitems/id' + n + '/comments',
              'self': 'http://mock.service/api/workitems/id' + n + '/relationships/comments' 
            } 
          }, 
          'creator': { 
            'data': { 
              'id': 'some-creator-id', 
              'links': {
                'self': 'http://mock.service/api/users/some-creator-id'
              },
              'type': 'identities' 
            } 
          } 
        }, 
        'iteration': {},
        'type': 'workitems' 
      };
    });
    return workitems;
  }

  private createInitialWorkItemComments(): any {
    // map, key is work item id, value is comment structure
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

  private createInitialWorkItemLinks(): any {
    return { 
      data: [ 
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
      ],
      'meta': {
        'totalCount': 1
      }
    };
  }

}