import { Event, EventMapper, EventService, EventUI } from './event.model';

describe('Unit Test :: Events Model', () => {
  it('should execute the canary test', () => {
    return expect(true).toBe(true);
  });
  it('should correctly convert to ui model - 1', () => {
    const map = new EventMapper();
    const input: EventService = {
      'attributes': {
        'name': 'system.assignees',
        'timestamp': '2018-05-27T08:54:44.63509Z'
      },
      'id': '5e7adc1d-2c8a-440d-9466-aedf4b2d60c2',
      'relationships': {
        'modifier': {
          'data': {
            'id': '20694424-0841-4d6c-bfb5-bbbb0391b8db',
            'links': {
              'related': 'https://api.prod-preview.openshift.io/api/users/20694424-0841-4d6c-bfb5-bbbb0391b8db'
            },
            'type': 'identities'
          }
        },
        'newValue': {
          'data': [
            {
              'id': '20694424-0841-4d6c-bfb5-bbbb0391b8db',
              'type': 'users'
            }
          ]
        },
        'oldValue': {
          'data': [
            {
              'id': '20694424-0841-4d6c-bfb5-bbbb0391b8db',
              'type': 'users'
            }
          ]
        }
      },
      'type': 'events'
    };
    const output: EventUI = map.toUIModel(input);
    const expectedOutPut: EventUI = {
      name: 'system.assignees',
      newValue: null,
      oldValue: null,
      timestamp: '2018-05-27T08:54:44.63509Z',
      modifierId: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
      newValueRelationships: [
        {
          id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
          type: 'users'
        }
      ],
      oldValueRelationships: [
        {
          id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
          type: 'users'
        }
      ],
      type: null
    };
    expect(expectedOutPut).toEqual(output);
  });

  it('should convert to ui model - 2', () => {
    const map = new EventMapper();
    const input: EventService = {
      'attributes': {
        'name': 'system.title',
        'newValue': 'a',
        'oldValue': 'b',
        'timestamp': '2018-05-27T08:54:44.63509Z'
      },
      'id': '5e7adc1d-2c8a-440d-9466-aedf4b2d60c2',
      'relationships': {
        'modifier': {
          'data': {
            'id': '20694424-0841-4d6c-bfb5-bbbb0391b8db',
            'links': {
              'related': 'https://api.prod-preview.openshift.io/api/users/20694424-0841-4d6c-bfb5-bbbb0391b8db'
            },
            'type': 'identities'
          }
        }
      },
      'type': 'events'
    };
    const output = map.toUIModel(input);
    const expectedOutPut: EventUI = {
      name: 'system.title',
      newValue: 'a',
      oldValue: 'b',
      timestamp: '2018-05-27T08:54:44.63509Z',
      modifierId: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
      newValueRelationships: [],
      oldValueRelationships: [],
      type: null
    };
    expect(expectedOutPut).toEqual(output);
  });

  it('should correctly convert to ui model - 2', () => {
    const map = new EventMapper();
    const input: EventService = {
      'attributes': {
        'name': 'system.assignees',
        'timestamp': '2018-05-27T08:54:44.63509Z'
      },
      'id': '5e7adc1d-2c8a-440d-9466-aedf4b2d60c2',
      'relationships': {
        'modifier': {
          'data': {
            'id': '20694424-0841-4d6c-bfb5-bbbb0391b8db',
            'links': {
              'related': 'https://api.prod-preview.openshift.io/api/users/20694424-0841-4d6c-bfb5-bbbb0391b8db'
            },
            'type': 'identities'
          }
        }
      },
      'type': 'events'
    };
    const output: EventUI = map.toUIModel(input);
    const expectedOutPut: EventUI = {
      name: 'system.assignees',
      newValue: null,
      oldValue: null,
      timestamp: '2018-05-27T08:54:44.63509Z',
      modifierId: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
      newValueRelationships: [],
      oldValueRelationships: [],
      type: null
    };
    expect(expectedOutPut).toEqual(output);
  });

  it('should correctly convert to ui model -3', () => {
    const map = new EventMapper();
    const input: EventService = {
      'attributes': {
        'name': 'system.assignees',
        'newValue': null,
        'oldValue': null,
        'timestamp': '2018-05-27T08:54:44.63509Z'
      },
      'id': '5e7adc1d-2c8a-440d-9466-aedf4b2d60c2',
      'relationships': {
        'modifier': {
          'data': {
            'id': '20694424-0841-4d6c-bfb5-bbbb0391b8db',
            'links': {
              'related': 'https://api.prod-preview.openshift.io/api/users/20694424-0841-4d6c-bfb5-bbbb0391b8db'
            },
            'type': 'identities'
          }
        },
        'newValue': {
          'data': [
            {
              'id': '20694424-0841-4d6c-bfb5-bbbb0391b8db',
              'type': 'users'
            }
          ]
        }
      },
      'type': 'events'
    };
    const output: EventUI = map.toUIModel(input);
    const expectedOutPut: EventUI = {
      name: 'system.assignees',
      newValue: null,
      oldValue: null,
      timestamp: '2018-05-27T08:54:44.63509Z',
      modifierId: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
      newValueRelationships: [
        {
          id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
          type: 'users'
        }
      ],
      oldValueRelationships: [],
      type: null
    };
    expect(expectedOutPut).toEqual(output);
  });

  it('should correctly convert to ui model -4', () => {
    const map = new EventMapper();
    const input: EventService = {
      'attributes': {
        'name': 'system.assignees',
        'newValue': null,
        'oldValue': null,
        'timestamp': '2018-05-27T08:54:44.63509Z'
      },
      'id': '5e7adc1d-2c8a-440d-9466-aedf4b2d60c2',
      'relationships': {
        'modifier': {
          'data': {
            'id': '20694424-0841-4d6c-bfb5-bbbb0391b8db',
            'links': {
              'related': 'https://api.prod-preview.openshift.io/api/users/20694424-0841-4d6c-bfb5-bbbb0391b8db'
            },
            'type': 'identities'
          }
        },
        'newValue': null,
        'oldValue': null
      },
      'type': 'events'
    };
    const output: EventUI = map.toUIModel(input);
    const expectedOutPut: EventUI = {
      name: 'system.assignees',
      newValue: null,
      oldValue: null,
      timestamp: '2018-05-27T08:54:44.63509Z',
      modifierId: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
      newValueRelationships: [],
      oldValueRelationships: [],
      type: null
    };
    expect(expectedOutPut).toEqual(output);
  });

  it('should correctly convert to ui model - 5', () => {
    const map = new EventMapper();
    const input = {
      'attributes': {
        'name': 'system.assignees',
        'timestamp': '2018-05-27T08:54:44.63509Z'
      },
      'id': '5e7adc1d-2c8a-440d-9466-aedf4b2d60c2',
      'relationships': {
        'modifier': {
          'data': {
            'id': '20694424-0841-4d6c-bfb5-bbbb0391b8db',
            'links': {
              'related': 'https://api.prod-preview.openshift.io/api/users/20694424-0841-4d6c-bfb5-bbbb0391b8db'
            },
            'type': 'identities'
          }
        },
        'newValue': {
          'data': [
            {
              'id': '20694424-0841-4d6c-bfb5-bbbb0391b8db',
              'type': 'users'
            }
          ]
        },
        'oldValue': {
          'data': [
            {
              'id': '20694424-0841-4d6c-bfb5-bbbb0391b8db',
              'type': 'users'
            }
          ]
        },
        'workItemType': {
          'data': {
            'id': '00000000-0000-0000-0000-000000000003',
            'type': 'workitemtypes'
          },
          'links': {
            'self': 'http:///api/workitemtypes/00000000-0000-0000-0000-000000000003'
          }
        }
      },
      'type': 'events'
    };
    const output: EventUI = map.toUIModel(input);
    const expectedOutPut: EventUI = {
      name: 'system.assignees',
      newValue: null,
      oldValue: null,
      timestamp: '2018-05-27T08:54:44.63509Z',
      modifierId: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
      newValueRelationships: [
        {
          id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
          type: 'users'
        }
      ],
      oldValueRelationships: [
        {
          id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
          type: 'users'
        }
      ],
      type: null
    };
    expect(expectedOutPut).toEqual(output);
  });

  it('should correctly convert to ui model - 6', () => {
    const map = new EventMapper();
    const input: EventService = {
      'attributes': {
        'name': 'system.title',
        'newValue': 'abc',
        'timestamp': '2018-05-27T08:54:44.63509Z'
      },
      'id': '5e7adc1d-2c8a-440d-9466-aedf4b2d60c2',
      'relationships': {
        'modifier': {
          'data': {
            'id': '20694424-0841-4d6c-bfb5-bbbb0391b8db',
            'links': {
              'related': 'https://api.prod-preview.openshift.io/api/users/20694424-0841-4d6c-bfb5-bbbb0391b8db'
            },
            'type': 'identities'
          }
        }
      },
      'type': 'events'
    };
    const output: EventUI = map.toUIModel(input);
    const expectedOutPut: EventUI = {
      name: 'system.title',
      newValue: 'abc',
      oldValue: null,
      timestamp: '2018-05-27T08:54:44.63509Z',
      modifierId: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
      newValueRelationships: [],
      oldValueRelationships: [],
      type: null
    };
    expect(expectedOutPut).toEqual(output);
  });

  it('should correctly convert to ui model - 7', () => {
    const map = new EventMapper();
    const input: EventService = {
      'attributes': {
        'name': 'system.title',
        'newValue': ['a', 'b', 'c'],
        'oldValue': ['c', 'b'],
        'timestamp': '2018-05-27T08:54:44.63509Z'
      },
      'id': '5e7adc1d-2c8a-440d-9466-aedf4b2d60c2',
      'relationships': {
        'modifier': {
          'data': {
            'id': '20694424-0841-4d6c-bfb5-bbbb0391b8db',
            'links': {
              'related': 'https://api.prod-preview.openshift.io/api/users/20694424-0841-4d6c-bfb5-bbbb0391b8db'
            },
            'type': 'identities'
          }
        }
      },
      'type': 'events'
    };
    const output: EventUI = map.toUIModel(input);
    const expectedOutPut: EventUI = {
      name: 'system.title',
      newValue: 'a, b, c',
      oldValue: 'c, b',
      timestamp: '2018-05-27T08:54:44.63509Z',
      modifierId: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
      newValueRelationships: [],
      oldValueRelationships: [],
      type: null
    };
    expect(expectedOutPut).toEqual(output);
  });

  it('should correctly convert to ui model - 8', () => {
    const map = new EventMapper();
    const input: EventService = {
      'attributes': {
        'name': 'system.title',
        'newValue': [1, 2],
        'oldValue': [3, 4],
        'timestamp': '2018-05-27T08:54:44.63509Z'
      },
      'id': '5e7adc1d-2c8a-440d-9466-aedf4b2d60c2',
      'relationships': {
        'modifier': {
          'data': {
            'id': '20694424-0841-4d6c-bfb5-bbbb0391b8db',
            'links': {
              'related': 'https://api.prod-preview.openshift.io/api/users/20694424-0841-4d6c-bfb5-bbbb0391b8db'
            },
            'type': 'identities'
          }
        }
      },
      'type': 'events'
    };
    const output: EventUI = map.toUIModel(input);
    const expectedOutPut: EventUI = {
      name: 'system.title',
      newValue: '1, 2',
      oldValue: '3, 4',
      timestamp: '2018-05-27T08:54:44.63509Z',
      modifierId: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
      newValueRelationships: [],
      oldValueRelationships: [],
      type: null
    };
    expect(expectedOutPut).toEqual(output);
  });
});
