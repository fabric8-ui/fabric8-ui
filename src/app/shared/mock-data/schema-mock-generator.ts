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
  public getWorkItemTypes(): any[] {
    if (this.workItemTypes)
      return this.workItemTypes;
    else {
      this.workItemTypes = [
      {
         'id' : '86af5178-9b41-469b-9096-57e5155c3f31',
         'attributes' : {
            'name' : 'Planner Item',
            'icon': 'fa-paint-brush',
            'fields' : {
               'system.created_at' : {
                  'type' : {
                     'kind' : 'instant'
                  },
                  'required' : false
               },
               'system.remote_item_id' : {
                  'required' : false,
                  'type' : {
                     'kind' : 'string'
                  }
               },
               'system.area': {
               'description': 'The area to which the work item belongs',
               'label': 'Area',
               'required': false,
               'type': {
               'kind': 'string'
                }
                },
               'system.title' : {
                  'required' : true,
                  'type' : {
                     'kind' : 'string'
                  }
               },
               'system.creator' : {
                  'label': 'Creator',
                  'type' : {
                     'kind' : 'user'
                  },
                  'required' : true
               },
               'system.assignees' : {
                 'label': 'Assignee',
                  'type' : {
                     'kind' : 'list',
                     'componentType' : 'user'
                  },
                  'required' : false
               },
               'system.state' : {
                  'required' : true,
                  'type' : {
                     'kind' : 'enum',
                     'values' : [
                        'new',
                        'open',
                        'in progress',
                        'resolved',
                        'closed'
                     ],
                     'baseType' : 'string'
                  }
               },
               'system.description' : {
                  'required' : false,
                  'type' : {
                     'kind' : 'markup'
                  }
               },               
              'system.iteration' : {
                'description' : 'The iteration to which the work item belongs',
                'label' : 'Iteration',
                'required' : false,
                'type' : {
                  'kind' : 'string'
                }
              }
            },
            'description' : 'Description for Planner Item',
            'version' : 0
         },
         'type' : 'workitemtypes'
      },
      {
         'type' : 'workitemtypes',
         'attributes' : {
            'version' : 0,
            'description' : 'Desciption for User Story',
            'name' : 'User Story',
            'icon': 'fa-bookmark',
            'fields' : {
               'system.description' : {
                  'type' : {
                     'kind' : 'markup'
                  },
                  'required' : false
               },
              'system.storypoints' : {
                'description' : 'Storypoints for the story',
                'label' : 'Story Points',
                'required' : false,
                'type' : {
                  'kind' : 'integer'
                }
              },
              'system.severity' : {
                'description' : 'Severity for the story',
                'label' : 'Severity',
                'required' : false,
                'type' : {
                    'values' : [
                      'low',
                      'mid',
                      'high',
                      'blocker'
                    ],
                    'baseType' : 'string',
                    'kind' : 'enum'
                }
              },
              'system.iteration' : {
                'description' : 'The iteration to which the work item belongs',
                'label' : 'Iteration',
                'required' : false,
                'type' : {
                  'kind' : 'string'
                }
              },
              'system.state' : {
                  'required' : true,
                  'type' : {
                     'values' : [
                        'new',
                        'open',
                        'in progress',
                        'resolved',
                        'closed'
                     ],
                     'baseType' : 'string',
                     'kind' : 'enum'
                  }
               },
               'system.assignees' : {
                 'label': 'Assignee',
                  'type' : {
                     'componentType' : 'user',
                     'kind' : 'list'
                  },
                  'required' : false
               },
               'system.creator' : {
                 'label': 'Creator',
                  'type' : {
                     'kind' : 'user'
                  },
                  'required' : true
               },
               'system.title' : {
                  'required' : true,
                  'type' : {
                     'kind' : 'string'
                  }
               },
               'system.area': {
               'description': 'The area to which the work item belongs',
               'label': 'Area',
               'required': false,
               'type': {
               'kind': 'string'
                }
                },
               'system.remote_item_id' : {
                  'required' : false,
                  'type' : {
                     'kind' : 'string'
                  }
               },
               'system.created_at' : {
                  'type' : {
                     'kind' : 'instant'
                  },
                  'required' : false
               }
            }
         },
         'id' : 'bbf35418-04b6-426c-a60b-7f80beb0b624'
      },
      {
         'attributes' : {
            'name' : 'Value Proposition',
            'icon': 'fa-gift',
            'fields' : {
               'system.area': {
               'description': 'The area to which the work item belongs',
               'label': 'Area',
               'required': false,
               'type': {
               'kind': 'string'
                }
                },
               'system.title' : {
                  'type' : {
                     'kind' : 'string'
                  },
                  'required' : true
               },
               'system.creator' : {
                 'label': 'Creator',
                  'required' : true,
                  'type' : {
                     'kind' : 'user'
                  }
               },
               'system.created_at' : {
                  'required' : false,
                  'type' : {
                     'kind' : 'instant'
                  }
               },
               'system.remote_item_id' : {
                  'type' : {
                     'kind' : 'string'
                  },
                  'required' : false
               },
               'system.assignees' : {
                 'label': 'Assignee',
                  'required' : false,
                  'type' : {
                     'kind' : 'list',
                     'componentType' : 'user'
                  }
               },
               'system.state' : {
                  'type' : {
                     'kind' : 'enum',
                     'baseType' : 'string',
                     'values' : [
                        'new',
                        'open',
                        'in progress',
                        'resolved',
                        'closed'
                     ]
                  },
                  'required' : true
               },
              'system.iteration' : {
                'description' : 'The iteration to which the work item belongs',
                'label' : 'Iteration',
                'required' : false,
                'type' : {
                  'kind' : 'string'
                }
              },
               'system.description' : {
                  'required' : false,
                  'type' : {
                     'kind' : 'markup'
                  }
               }
            },
            'description' : 'Description for value proposition',
            'version' : 0
         },
         'type' : 'workitemtypes',
         'id' : '3194ab60-855b-4155-9005-9dce4a05f1eb'
      },
      {
         'id' : 'ee7ca005-f81d-4eea-9b9b-1965df0988d0',
         'type' : 'workitemtypes',
         'attributes' : {
            'version' : 0,
            'description' : 'Description for Fundamental',
            'icon': 'fa-bank',
            'fields' : {
               'system.created_at' : {
                  'type' : {
                     'kind' : 'instant'
                  },
                  'required' : false
               },
               'system.remote_item_id' : {
                  'type' : {
                     'kind' : 'string'
                  },
                  'required' : false
               },
               'system.title' : {
                  'required' : true,
                  'type' : {
                     'kind' : 'string'
                  }
               },
               'system.area' : {
                  'required' : false,
                  'type' : {
                     'kind' : 'area'
                  }
               },
               'system.creator' : {
                 'label': 'Creator',
                  'type' : {
                     'kind' : 'user'
                  },
                  'required' : true
               },
               'system.assignees' : {
                 'label': 'Assignee',
                  'required' : false,
                  'type' : {
                     'kind' : 'list',
                     'componentType' : 'user'
                  }
               },
               'system.state' : {
                  'required' : true,
                  'type' : {
                     'values' : [
                        'new',
                        'open',
                        'in progress',
                        'resolved',
                        'closed'
                     ],
                     'baseType' : 'string',
                     'kind' : 'enum'
                  }
               },
               'system.description' : {
                  'required' : false,
                  'type' : {
                     'kind' : 'markup'
                  }
               },
               'system.iteration' : {
                  'required' : false,
                  'type' : {
                     'kind' : 'iteration'
                  }
               }
            },
            'name' : 'Fundamental'
         }
      },
      {
         'id' : 'b9a71831-c803-4f66-8774-4193fffd1311',
         'type' : 'workitemtypes',
         'attributes' : {
            'description' : 'Description for Experience',
            'name' : 'Experience',
            'icon': 'fa-map',
            'fields' : {
               'system.assignees' : {
                 'label': 'Assignee',
                  'required' : false,
                  'type' : {
                     'kind' : 'list',
                     'componentType' : 'user'
                  }
               },
               'system.title' : {
                  'type' : {
                     'kind' : 'string'
                  },
                  'required' : true
               },
               'system.area' : {
                  'type' : {
                     'kind' : 'area'
                  },
                  'required' : false
               },
               'system.creator' : {
                 'label': 'Creator',
                  'required' : true,
                  'type' : {
                     'kind' : 'user'
                  }
               },
               'system.created_at' : {
                  'type' : {
                     'kind' : 'instant'
                  },
                  'required' : false
               },
               'system.remote_item_id' : {
                  'type' : {
                     'kind' : 'string'
                  },
                  'required' : false
               },
               'system.state' : {
                  'type' : {
                     'kind' : 'enum',
                     'values' : [
                        'new',
                        'open',
                        'in progress',
                        'resolved',
                        'closed'
                     ],
                     'baseType' : 'string'
                  },
                  'required' : true
               },
               'system.iteration' : {
                  'required' : false,
                  'type' : {
                     'kind' : 'iteration'
                  }
               },
               'system.description' : {
                  'type' : {
                     'kind' : 'markup'
                  },
                  'required' : false
               }
            },
            'version' : 0
         }
      },
      {
         'id' : '71171e90-6d35-498f-a6a7-2083b5267c18',
         'type' : 'workitemtypes',
         'attributes' : {
            'version' : 0,
            'description' : 'Description for Scenario',
            'name' : 'Scenario',
            'icon': 'fa-question',
            'fields' : {
               'system.state' : {
                  'required' : true,
                  'type' : {
                     'baseType' : 'string',
                     'values' : [
                        'new',
                        'open',
                        'in progress',
                        'resolved',
                        'closed'
                     ],
                     'kind' : 'enum'
                  }
               },
               'system.iteration' : {
                  'type' : {
                     'kind' : 'iteration'
                  },
                  'required' : false
               },
               'system.description' : {
                  'required' : false,
                  'type' : {
                     'kind' : 'markup'
                  }
               },
               'system.assignees' : {
                 'label': 'Assignee',
                  'required' : false,
                  'type' : {
                     'kind' : 'list',
                     'componentType' : 'user'
                  }
               },
               'system.created_at' : {
                  'type' : {
                     'kind' : 'instant'
                  },
                  'required' : false
               },
               'system.remote_item_id' : {
                  'required' : false,
                  'type' : {
                     'kind' : 'string'
                  }
               },
               'system.title' : {
                  'required' : true,
                  'type' : {
                     'kind' : 'string'
                  }
               },
               'system.area' : {
                  'required' : false,
                  'type' : {
                     'kind' : 'area'
                  }
               },
               'system.creator' : {
                 'label': 'Creator',
                  'type' : {
                     'kind' : 'user'
                  },
                  'required' : true
               }
            }
         }
      },
      {
         'attributes' : {
            'fields' : {
               'system.title' : {
                  'required' : true,
                  'type' : {
                     'kind' : 'string'
                  }
               },
               'system.area' : {
                  'type' : {
                     'kind' : 'area'
                  },
                  'required' : false
               },
               'system.creator' : {
                 'label': 'Creator',
                  'required' : true,
                  'type' : {
                     'kind' : 'user'
                  }
               },
               'system.created_at' : {
                  'type' : {
                     'kind' : 'instant'
                  },
                  'required' : false
               },
               'system.remote_item_id' : {
                  'type' : {
                     'kind' : 'string'
                  },
                  'required' : false
               },
               'system.assignees' : {
                 'label': 'Assignee',
                  'required' : false,
                  'type' : {
                     'componentType' : 'user',
                     'kind' : 'list'
                  }
               },
               'system.state' : {
                  'type' : {
                     'kind' : 'enum',
                     'values' : [
                        'new',
                        'open',
                        'in progress',
                        'resolved',
                        'closed'
                     ],
                     'baseType' : 'string'
                  },
                  'required' : true
               },
               'system.iteration' : {
                  'type' : {
                     'kind' : 'iteration'
                  },
                  'required' : false
               },
               'system.description' : {
                  'required' : false,
                  'type' : {
                     'kind' : 'markup'
                  }
               }
            },
            'name' : 'Feature',
            'description' : 'Description for Feature',
            'version' : 0,
            'icon': 'fa-mouse-pointer',
         },
         'type' : 'workitemtypes',
         'id' : '0a24d3c2-e0a6-4686-8051-ec0ea1915a28'
      },
      {
         'id' : '26787039-b68f-4e28-8814-c2f93be1ef4e',
         'type' : 'workitemtypes',
         'attributes' : {
            'version' : 0,
            'description' : 'Description for Bug',
            'name' : 'Bug',
            'icon': 'fa-bug',
            'fields' : {
               'system.creator' : {
                 'label': 'Creator',
                  'required' : true,
                  'type' : {
                     'kind' : 'user'
                  }
               },
               'system.title' : {
                  'required' : true,
                  'type' : {
                     'kind' : 'string'
                  }
               },
               'system.area' : {
                  'required' : false,
                  'type' : {
                     'kind' : 'area'
                  }
               },
               'system.remote_item_id' : {
                  'required' : false,
                  'type' : {
                     'kind' : 'string'
                  }
               },
               'system.created_at' : {
                  'required' : false,
                  'type' : {
                     'kind' : 'instant'
                  }
               },
               'system.assignees' : {
                 'label': 'Assignee',
                  'type' : {
                     'componentType' : 'user',
                     'kind' : 'list'
                  },
                  'required' : false
               },
               'system.description' : {
                  'required' : false,
                  'type' : {
                     'kind' : 'markup'
                  }
               },
               'system.iteration' : {
                  'type' : {
                     'kind' : 'iteration'
                  },
                  'required' : false
               },
               'system.state' : {
                  'required' : true,
                  'type' : {
                     'values' : [
                        'new',
                        'open',
                        'in progress',
                        'resolved',
                        'closed'
                     ],
                     'baseType' : 'string',
                     'kind' : 'enum'
                  }
               }
            }
         }
      }
      ];
      return this.workItemTypes;
    }
  }

  public getWorkItemTypeById(id) {
    let allWorkItemTypes = this.getWorkItemTypes();
    let item = allWorkItemTypes.find((item) => item.id === id);
    return item ? item : allWorkItemTypes[0];
  }

  public renderText(text: string) {
    return {
        attributes: {
          renderedContent: 'MARKDOWN RENDERED: ' + text
        },
        id: 'd9da8f40-30cd-4fb3-afd0-ab3302fa694f',
        type: 'rendering'
    };
  }

}

