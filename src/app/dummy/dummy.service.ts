import { ContextMenuItem } from './../models/context-menu-item';
import { Space } from './../models/space';
import { Resources } from './../models/resources';
import { ProcessTemplate } from './../models/process-template';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';

import 'rxjs/add/operator/toPromise';

// A service responsible for providing dummy data for the UI prototypes.

@Injectable()
export class DummyService {

  readonly SPACES: Space[] = [
    {
      name: 'Bobo',
      path: '/pmuir/BalloonPopGame',
      description: 'Microservices architected search engine'
    }, {
      name: 'Hysterix',
      path: '/pmuir/BalloonPopGame',
      description: 'Hystrix is a latency and fault tolerance library designed to isolate points of access to remote systems, services and 3rd party libraries, stop cascading failure and enable resilience in complex distributed systems where failure is inevitable.'
    }, {
      name: 'fabric8io',
      path: '/pmuir/BalloonPopGame',
      description: 'Fabric8 is an open source integrated development platform for Kubernetes'
    }, {
      name: 'BalloonPopGame',
      path: '/pmuir/BalloonPopGame',
      description: 'Balloon popping fun for everyone!'
    }
  ];

  readonly RESOURCES: Resources = {
    startDate: new Date(2016, 8, 1, 0, 0, 0, 0),
    endDate: new Date(2016, 8, 30, 23, 59, 59, 0),
    list: [
    {
      type: {
        name: 'Pipeline',
        unit: 'minutes'
      },
      value: 124,
      max: 200
    }, {
      type: {
        name: 'Environments',
        unit: 'RAM-minutes'
      },
      value: 7185,
      max: 18000
    }
    ]};

    readonly CONTEXT_MENU_ITEMS: ContextMenuItem[] = [
      {
        name: 'pmuir',
        type: {
          name: 'User',
          icon: 'fa fa-user',
          menus: [
            {
              name: 'Home',
              path: '/home'
            }, {
              name: 'Profile',
              path: '',
              menus: [
                {
                  name: 'Profile',
                  path: ''
                }, {
                  name: 'Collaboration Spaces',
                  path: 'spaces'
                }, {
                  name: 'Resources',
                  path: 'resources'
                }
              ]
            },
            {
              path: 'settings',
              icon: 'pficon pficon-settings',
              menus: [
                {
                  name: 'Profile',
                  path: ''
                }, {
                  name: 'Account',
                  path: 'account'
                }, {
                  name: 'Emails',
                  path: 'emails'
                }, {
                  name: 'Notifications',
                  path: 'notifications'
                }
              ]
            },
          ]
        },
        path: '/pmuir',
        default: true
      }, {
        name: 'BalloonPopGame',
        type: {
          name: 'Space',
          icon: 'fa fa-space-shuttle',
          menus: [
            {
              name: 'Analyze',
              path: '',
              menus: [
                {
                  name: 'Overview',
                  path: ''
                }, {
                  name: 'README',
                  path: 'readme'
                }
              ]
            }, {
              name: 'Plan',
              path: 'plan',
              menus: [
                {
                  name: 'Backlog',
                  path: ''
                }, {
                  name: 'Board',
                  path: 'board'
                }
              ]
            }, {
              name: 'Create',
              path: 'create',
              menus: [
                {
                  name: 'Codesbases',
                  path: ''
                }, {
                  name: 'Workspaces',
                  path: 'workspaces'
                }
              ]
            }, {
              name: 'Run',
              path: 'run',
              menus: [
                {
                  name: 'Pipelines',
                  path: ''
                }
              ]
            }, {
              name: '',
              path: 'settings',
              icon: 'pficon pficon-settings',
              menus: [
                {
                  name: 'Overview',
                  path: '',
                  icon: '',
                  menus: []
                }, {
                  name: 'Work',
                  path: 'work'
                }, {
                  name: 'Security',
                  path: 'security'
                }, {
                  name: 'Alerts',
                  path: 'alerts'
                }
              ]
            },
          ]
        },
        path: '/pmuir/BalloonPopGame',
        default: false
      }, {
        name: 'BalloonPopGame / UX Team',
        type: {
          name: 'Team',
          icon: 'fa fa-users'
        },
        path: '?',
        default: false
      }, {
        name: 'Red Hat Organization',
        type: {
          name: 'Organization',
          icon: 'fa fa-cubes'
        },
        path: '?',
        default: false
      }
    ];

    readonly PROCESS_TEMPLATES: ProcessTemplate [] = [
      { name: 'Agile' },
      { name: 'Scrum' },
      { name: 'Issue Tracking' },
      { name: 'Scenario Driven Planning' }
    ];
  
  private _spaces: Space[];

  constructor(private http: Http,
    private localStorageService: LocalStorageService) {
    if (this.localStorageService.get('spaces')) {
      this._spaces = this.localStorageService.get<Space[]>('spaces');
    } else {
      this._spaces = JSON.parse(JSON.stringify(this.SPACES));
    }
  }

  get spaces(): Space[] {
    return this._spaces;
  }

  get resources(): Resources {
    return this.RESOURCES;
  }

  get contextMenuItems(): ContextMenuItem[] {
    return this.CONTEXT_MENU_ITEMS;
  }

  get processTemplates(): ProcessTemplate[] {
    return this.PROCESS_TEMPLATES;
  }

  save(): void {
    this.localStorageService.set('spaces', this._spaces);
  }

}
