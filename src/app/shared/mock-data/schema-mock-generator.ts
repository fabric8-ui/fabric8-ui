/*
 * This class contains mock generator code for a test schema/model
 * and needed entities like WorkItemType, WorkItemLinkType or
 * LinkCategories.
 */
export class SchemaMockGenerator {

  // the schema is static data, so we cache it here.
  private workItemTypes: any;
  private workItemLinkTypes: any;
  private linkCategories: any;

  /*
   * Creates the link categories structure.
   */
  public getLinkCategories(): any {
    if (this.linkCategories)
      return this.linkCategories;
    else {
      this.linkCategories = {
        'data': this.getWorkItemLinkTypes().included,
        'meta': {
          'totalCount': this.getWorkItemLinkTypes().included.length
        }
      };
      return this.linkCategories;
    }
  }

  /*
   * Creates the work item link types structure.
   */
  public getWorkItemLinkTypes(): any {
    if (this.workItemLinkTypes)
      return this.workItemLinkTypes;
    else {
      this.workItemLinkTypes = {
        'data': [
          {
            'id': 'wilt-0',
            'attributes': {
              'description': 'A mock work item link type',
              'forward_name': 'tests',
              'name': 'mock-tested-by',
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
                  'id': 'planneritem',
                  'type': 'workitemtypes'
                }
              },
              'target_type': {
                'data': {
                  'id': 'planneritem',
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
      return this.workItemLinkTypes;
    }
  }

  /*
   * Creates the work item types structure.
   */
  public getWorkItemTypes() {
    if (this.workItemTypes)
      return this.workItemTypes;
    else {
      this.workItemTypes = [
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
          'name': 'userstory',
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
          'name': 'valueproposition',
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
          'name': 'fundamental',
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
          'name': 'experience',
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
          'name': 'planneritem',
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
          'name': 'feature',
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
          'name': 'bug',
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
          'name': 'scenario',
          'version': 0
        }
      ];
      return this.workItemTypes;
    }
  }

}

