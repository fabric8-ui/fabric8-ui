import { Space } from './../models/space';
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
      description: 'Balloon popping fun for everyone!' }
  ];

  constructor(private http: Http) { }

}
