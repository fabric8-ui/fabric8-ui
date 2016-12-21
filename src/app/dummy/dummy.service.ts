import { ContextMenuItem } from './../models/context-menu-item';
import { Space } from './../models/space';
import { Resources } from './../models/resources';
import { ProcessTemplates } from './../models/process-templates';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

// A service responsible for providing dummy data for the UI prototypes.

@Injectable()
export class DummyService {

  spaces: Space[] = [
    {
      name: 'Bobo',
      path: 'BalloonPopGame',
      description: 'Microservices architected search engine'
    }, {
      name: 'Hysterix',
      path: 'BalloonPopGame',
      description: 'Hystrix is a latency and fault tolerance library designed to isolate points of access to remote systems, services and 3rd party libraries, stop cascading failure and enable resilience in complex distributed systems where failure is inevitable.'
    }, {
      name: 'fabric8io',
      path: 'BalloonPopGame',
      description: 'Fabric8 is an open source integrated development platform for Kubernetes'
    }, {
      name: 'BalloonPopGame',
      path: 'BalloonPopGame',
      description: 'Balloon popping fun for everyone!'
    }
  ];

  resources: Resources = {
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

    contextMenuItems: ContextMenuItem[] = [
      {
        name: 'pmuir',
        type: {
          name: 'User',
          icon: 'fa fa-user'
        },
        path: '/pmuir',
        default: true
      }, {
        name: 'BalloonPopGame',
        type: {
          name: 'Space',
          icon: 'fa fa-space-shuttle'
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

    processTemplates: ProcessTemplates [] = [
      { name: 'Agile' },
      { name: 'Scrum' },
      { name: 'Issue Tracking' },
      { name: 'Scenario Driven Planning' }
    ];

  constructor(private http: Http) { }

}
