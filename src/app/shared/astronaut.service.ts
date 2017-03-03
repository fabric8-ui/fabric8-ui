import { Space, Team, ProcessTemplate, SpaceAttributes } from 'ngx-fabric8-wit';
import { Observer } from 'rxjs/Observer';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';

import { cloneDeep } from 'lodash';
import {
  Broadcaster,
  Logger,
  User
} from 'ngx-login-client';

import { MockDataService } from './mock-data.service';
import { SpaceMockGenerator } from './mock-data/space-mock-generator';
import { MockHttp } from './mock-http';
import { GlobalSettings } from './globals';

@Injectable()
export class AstronautService {

  constructor(
    private http: Http,
    private mockDataService: MockDataService,
    private logger: Logger,
    private globalSettings: GlobalSettings,
    private broadcaster: Broadcaster
  ) { }

}
