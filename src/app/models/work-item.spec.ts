import { WorkItemMapper, WorkItemUI, WorkItemService, WorkItemRelations } from './work-item';
import {
  cleanObject
} from './common.model';

describe('WorkItemMapper', () => {
    const workItemMapper: WorkItemMapper = new WorkItemMapper();

    const wiService = {
      "attributes": {
        "system.created_at": "2017-06-28T07:44:36.640764Z",
        "system.description": "Cannot resolve Area/Iteration info for new WI created in in-memory mode under Backlog > Quick Add",
        "system.description.rendered": "Cannot resolve Area/Iteration info for new WI created in in-memory mode under Backlog &gt; Quick Add",
        "system.number": 1343,
        "system.order": 1045750,
        "system.state": "closed",
        "system.title": "DELETEME",
        "system.updated_at": "2018-02-01T09:46:20.885811Z",
        "version": 14
      },
      "id": "020f756e-b51a-4b43-b113-45cec16b9ce9",
      "links": {
        "self": "https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f"
      },
      "relationships": {
        "area": {
          "data": {
            "id": "e5fc1d21-5c56-4aef-a58a-068865621881",
            "type": "areas"
          }
        },
        "assignees": {
          "data": [
            {
              "id": "330b19d2-28d3-4b29-9abf-a324c94b437d",
              "type": "identities"
            },
            {
              "id": "543d5193-d519-4126-9e9c-2d608f67639b",
              "type": "identities"
            }
          ]
        },
        "baseType": {
          "data": {
            "id": "71171e90-6d35-498f-a6a7-2083b5267c18",
            "type": "workitemtypes"
          }
        },
        "children": {
          "links": {
            "related": "https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f/children"
          },
          "meta": {
            "hasChildren": false
          }
        },
        "comments": {
          "links": {
            "related": "https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f/comments"
          }
        },
        "creator": {
          "data": {
            "id": "29f698d6-5c65-4129-9e97-5286cdb18a1c",
            "type": "identities"
          }
        },
        "iteration": {
          "data": {
            "id": "2561c0c9-6d36-46de-89f4-41cbe5b02cd3",
            "type": "iterations",
            "links": {
              "self": "https://api.openshift.io/api/iterations/2561c0c9-6d36-46de-89f4-41cbe5b02cd3"
            }
          }
        },
        "labels": {
          "data": []
        },
        "workItemLinks": {
          "links": {
            "related": "https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f/links"
          }
        }
      },
      "type": "workitems"
    };
    const dynamicWiUi = {
      dynamicfields: {
        acceptance_criteria: null,
        business_value: null,
        effort: null,
        resolution: "Done",
        target_date: null,
        time_criticality: null,
      }
    }
      const wiUI: WorkItemUI = {
        id: '020f756e-b51a-4b43-b113-45cec16b9ce9',
        title: 'DELETEME',
        number: 1343,
        order: 1045750,
        createdAt: '2017-06-28T07:44:36.640764Z',
        updatedAt: '2018-02-01T09:46:20.885811Z',
        state: 'closed',
        descriptionMarkup: 'Markdown',
        descriptionRendered: 'Cannot resolve Area/Iteration info for new WI created in in-memory mode under Backlog &gt; Quick Add',
        description: 'Cannot resolve Area/Iteration info for new WI created in in-memory mode under Backlog > Quick Add',
        version: 14,
        link: 'https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f',
        WILinkUrl: 'https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f/links',
        area: {
          id: 'e5fc1d21-5c56-4aef-a58a-068865621881',
          name: null, parentPath: null, parentPathResolved: null
        },
        creator: {
          id: '29f698d6-5c65-4129-9e97-5286cdb18a1c',
          name: null, avatar: null, username: null, currentUser: false
        },
        iteration: {
          id: '2561c0c9-6d36-46de-89f4-41cbe5b02cd3',
          name: null, parentPath: null, resolvedParentPath: null,
          userActive: null, isActive: null, startAt: null,
          endAt: null, description: null, state: null,
          link: 'https://api.openshift.io/api/iterations/2561c0c9-6d36-46de-89f4-41cbe5b02cd3',
          workItemTotalCount: null, workItemClosedCount: null, hasChildren: null,
          parentId: null, selected: false, showChildren: false
        },
        type: {
          id: '71171e90-6d35-498f-a6a7-2083b5267c18', name: null, icon: null,
          version: null, description: null, childTypes: [], type: "workitemtypes", fields: null,
          infotip: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          dynamicfields: []
        },
        commentLink: 'https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f/comments',
        assignees: [
          { id: '330b19d2-28d3-4b29-9abf-a324c94b437d', name: null, avatar: null, username: null,currentUser: false},
          { id: '543d5193-d519-4126-9e9c-2d608f67639b', name: null, avatar: null, username: null,currentUser: false}
        ],
        labels: [  ],
        children: [  ],
        hasChildren: false,
        parentID: null,
        childrenLink: 'https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f/children',
        treeStatus: 'disabled',
        childrenLoaded: false,
        bold: false
      } as WorkItemUI;

    it('should execute the canary test', () => {
        return expect(true).toBe(true)
      });

    it('should correctly convert to service model - 1', () => {
      expect(workItemMapper.toServiceModel(wiUI)).toEqual(wiService);
    });

    it('should correctly convert to UI model - 2', () => {
     const expWIService = {
        "attributes": {
          "system.created_at": "2017-06-28T07:44:36.640764Z",
          "system.description": "Cannot resolve Area/Iteration info for new WI created in in-memory mode under Backlog > Quick Add",
          "system.description.markup": "Markdown",
          "system.description.rendered": "Cannot resolve Area/Iteration info for new WI created in in-memory mode under Backlog &gt; Quick Add",
          "system.number": 1343,
          "system.order": 1045750,
          "system.state": "closed",
          "system.title": "DELETEME",
          "system.updated_at": "2018-02-01T09:46:20.885811Z",
          "version": 14
        },
        "id": "020f756e-b51a-4b43-b113-45cec16b9ce9",
        "links": {
          "self": "https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f"
        },
        "relationships": {
          "area": {
            "data": {
              "id": "e5fc1d21-5c56-4aef-a58a-068865621881",
              "type": "areas"
            }
          },
          "assignees": {
            "data": [
              {
                "id": "330b19d2-28d3-4b29-9abf-a324c94b437d",
                "type": "identities"
              },
              {
                "id": "543d5193-d519-4126-9e9c-2d608f67639b",
                "type": "identities"
              }
            ]
          },
          "baseType": {
            "data": {
              "id": "71171e90-6d35-498f-a6a7-2083b5267c18",
              "type": "workitemtypes"
            },
            "relationships": {
              "guidedChildTypes": {
                "data": []
              }
            }
          },
          "children": {
            "links": {
              "related": "https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f/children"
            },
            "meta": {
              "hasChildren": false
            }
          },
          "comments": {
            "links": {
              "related": "https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f/comments"
            }
          },
          "creator": {
            "data": {
              "id": "29f698d6-5c65-4129-9e97-5286cdb18a1c",
              "type": "identities"
            }
          },
          "iteration": {
            "data": {
              "id": "2561c0c9-6d36-46de-89f4-41cbe5b02cd3",
              "links": {
                "self": "https://api.openshift.io/api/iterations/2561c0c9-6d36-46de-89f4-41cbe5b02cd3"
              },
              "type": "iterations"
            }
          },
          "labels": {
            "data": []
          },
          "workItemLinks": {
            "links": {
              "related": "https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f/links"
            }
          }
        },
        "type": "workitems"
      };
      const output = workItemMapper.toUIModel(expWIService);
      expect(output).toEqual(wiUI);
    });

    it('should correctly convert dynamic fields to UI model - 3', () => {
      const expWIService = {
        "attributes": {
          "acceptance_criteria": null,
          "business_value":null,
          "effort":null,
          "resolution":"Done",
          "system.created_at": "2017-06-28T07:44:36.640764Z",
          "system.description": "Cannot resolve Area/Iteration info for new WI created in in-memory mode under Backlog > Quick Add",
          "system.description.markup": "Markdown",
          "system.description.rendered": "Cannot resolve Area/Iteration info for new WI created in in-memory mode under Backlog &gt; Quick Add",
          "system.number": 1343,
          "system.order": 1045750,
          "system.state": "closed",
          "system.title": "DELETEME",
          "system.updated_at": "2018-02-01T09:46:20.885811Z",
          "target_date":null,
          "time_criticality":null,
          "version": 14
        },
        "id": "020f756e-b51a-4b43-b113-45cec16b9ce9",
        "links": {
          "self": "https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f"
        },
        "relationships": {
          "area": {
            "data": {
              "id": "e5fc1d21-5c56-4aef-a58a-068865621881",
              "type": "areas"
            }
          },
          "assignees": {
            "data": [
              {
                "id": "330b19d2-28d3-4b29-9abf-a324c94b437d",
                "type": "identities"
              },
              {
                "id": "543d5193-d519-4126-9e9c-2d608f67639b",
                "type": "identities"
              }
            ]
          },
          "baseType": {
            "data": {
              "id": "71171e90-6d35-498f-a6a7-2083b5267c18",
              "type": "workitemtypes"
            },
            "relationships": {
              "guidedChildTypes": {
                "data": []
              }
            }
          },
          "children": {
            "links": {
              "related": "https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f/children"
            },
            "meta": {
              "hasChildren": false
            }
          },
          "comments": {
            "links": {
              "related": "https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f/comments"
            }
          },
          "creator": {
            "data": {
              "id": "29f698d6-5c65-4129-9e97-5286cdb18a1c",
              "type": "identities"
            }
          },
          "iteration": {
            "data": {
              "id": "2561c0c9-6d36-46de-89f4-41cbe5b02cd3",
              "links": {
                "self": "https://api.openshift.io/api/iterations/2561c0c9-6d36-46de-89f4-41cbe5b02cd3"
              },
              "type": "iterations"
            }
          },
          "labels": {
            "data": []
          },
          "workItemLinks": {
            "links": {
              "related": "https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f/links"
            }
          }
        },
        "type": "workitems"
      };
      let dynamicfields = [
        "acceptance_criteria",
        "business_value",
        "effort",
        "resolution",
        "target_date",
        "time_criticality"
      ]
      const output = workItemMapper.toDynamicUIModel(expWIService, dynamicfields);
      expect(output).toEqual(dynamicWiUi);
    });

    it('should correctly convert dynamic ui to service - 4', () => {
      const serviceMap = {
        "attributes": {
          "resolution":"Done"
        }
      }
      const uiMap: WorkItemUI = {
        id: '020f756e-b51a-4b43-b113-45cec16b9ce9',
        version: 14,
        dynamicfields: {
          resolution: "Done",
        },
        type: {
          dynamicfields: [
            "resolution"
          ]
        }
      } as WorkItemUI;
      expect(workItemMapper.toDyanmicServiceModel(uiMap)).toEqual(serviceMap);

    });

    it('should correctly convert ui to service (only static fields) - 5', () => {
      const serviceModel: WorkItemService = {
        "attributes": {
          "system.title": "New title",
          "version": 14
        },
        id: '020f756e-b51a-4b43-b113-45cec16b9ce9',
        type: 'workitems',
      } as WorkItemService;

      const uiMap: WorkItemUI = {
        id: '020f756e-b51a-4b43-b113-45cec16b9ce9',
        version: 14,
        title: "New title",
        type: {
          dynamicfields: [
            "resolution"
          ]
        }
      } as WorkItemUI;
      const dynamicServiceModel = workItemMapper.toDyanmicServiceModel(uiMap);
      const staticServiceModel = workItemMapper.toServiceModel(uiMap);
      const finalServiceModel = {
        ...staticServiceModel,
        ...{ attributes: {
          ...staticServiceModel.attributes,
          ...dynamicServiceModel.attributes
        }}
      };
      expect(finalServiceModel).toEqual(serviceModel);
    });

    it('should correctly convert ui to service (with base type)', () => {
      const serviceModel: WorkItemService = {
        "attributes": {
          "system.title": "New title",
          "version": 14,
          "resolution": "done"
        },
        id: '020f756e-b51a-4b43-b113-45cec16b9ce9',
        type: 'workitems',
      } as WorkItemService;
      const uiMap: WorkItemUI = {
        id: '020f756e-b51a-4b43-b113-45cec16b9ce9',
        version: 14,
        title: "New title",
        dynamicfields:{
          resolution: "done"
        },
        type: {
          id: "1234567jhgfds",
          description: "tbd",
          name: "Epic",
          dynamicfields: [
            "resolution"
          ]
        }
      } as WorkItemUI;
      const dynamicServiceModel = workItemMapper.toDyanmicServiceModel(uiMap);
      const staticServiceModel = workItemMapper.toServiceModel(uiMap);
      const finalServiceModel = cleanObject({
        ...staticServiceModel,
        ...{ attributes: {
          ...staticServiceModel.attributes,
          ...dynamicServiceModel.attributes
        }}
      }, ['baseType']);
      expect(finalServiceModel).toEqual(serviceModel)
    });
});
