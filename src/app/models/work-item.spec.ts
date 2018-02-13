import { WorkItemMapper, WorkItemUI, WorkItemService, WorkItemRelations } from './work-item';

describe('WorkItemMapper', () => {
    let workItemMapper: WorkItemMapper;
    let workItemUI: WorkItemUI;
    let workItemService: WorkItemService;

    workItemUI = {
        id: '',
        title: '',
        version: 0,
        number: '0',
        createdAt: '',
        updatedAt: '',
        state: 'new',
        descriptionMarkup: '',
        descriptionRendered: '',

        type: {
            id: '',
            name: '',
            icon: '',
            version: 0,
            type: '',
            description: ''
        },
        iteration : {
            id: '',
            name: '',
            parentPath: '',
            resolvedParentPath: '',
            userActive: false,
            isActive: false,
            startAt: '',
            endAt: '',
            description: '',
            state: 'new',
            link: '',
            workItemTotalCount: 0,
            workItemClosedCount: 0,
            parentId: 'parent_01',
            hasChildren: false,
            selected: false,
            showChildren: false
        },
        creator: {
            id: '',
            name: '',
            avatar: '',
            username: '',
        },
        comments: [],
        assignees: [],
        labels: [],
        area: {
            id: 'qr3R',
            name: 'Area 1',
            parentPath: '/40bbdd3d-8b5d/40bbdd3d-8b5e',
            parentPathResolved: '/devtools/planner/planner-ui'
        },
        childrenLink: '',
        hasChildren: false,
        parentID: '',
        workItemLink: '',

        treeStatus: 'collapsed',
        childrenLoaded: false,
        bold: false
    } as WorkItemUI;

    workItemService = {
        id: '',
        hasChildren: false,
        links: {
            self: ''
        },
        attributes: {
            'system.created_at': "",
            'system.description.markup': "",
            'system.description.rendered': "",
            'system.number': '0',
            'system.state': "new",
            'system.title': "",
            'system.updated_at': "",
            version: 0
        },
        relationships: {
            baseType: {
                data: {
                    id: '',
                    type: '',
                    attributes: {
                        name: '',
                        version: 0,
                        description: '',
                        icon: '',
                    }
                }
            },
            iteration: {
                data: {
                        attributes: {
                          user_active: false,
                          name: '',
                          description: '',
                          state: 'new',
                          parent_path: '',
                          resolved_parent_path: '',
                          startAt: '',
                          endAt: '',
                          active_status: false
                        },
                        id: '',
                        links: {
                            self: '',
                        },
                        relationships: {
                            parent: {
                              data: {
                                id: 'parent_01',
                                type: 'iterations'
                              }
                            },
                            workitems: {
                                meta: {
                                    total: 0,
                                    closed: 0
                                }
                            }
                        },
                        hasChildren: false,
                        type: 'iterations'
                    }
            },
            area: {
                data: {
                    id: 'qr3R',
                    attributes: {
                      name: 'Area 1',
                      parent_path: '/40bbdd3d-8b5d/40bbdd3d-8b5e',
                      parent_path_resolved: '/devtools/planner/planner-ui',
                    },
                    type: 'areas'
                }
            },
            labels: {
                data: []
            },
            creator: {
                data: {
                    id: '',
                    attributes: {
                        imageURL: '',
                        fullName: '',
                        username: ''
                    },
                    type: 'identities'
                }
            },
            assignees: {
                data: []
            },
            comments: {
                data: []
            },
            parent: {
                data: {
                    id: ''
                }
            },
            children: {
                links: {
                    related: ''
                }
            },

        } as WorkItemRelations

    }  as WorkItemService

    beforeEach(() => {
        workItemMapper = new WorkItemMapper();
    });

    it('should execute the canary test', () => {
        return expect(true).toBe(true)
      });

    it('should correctly convert to service model - 1', () => {
        expect(workItemMapper.toServiceModel(workItemUI)).toEqual(workItemService);
    });

    it('should correctly convert to UI model - 2', () => {
        expect(workItemMapper.toUIModel(workItemService)).toEqual(workItemUI);
    });
});
