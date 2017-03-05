import { WIT_API_URL, Space } from 'ngx-fabric8-wit';
import { Injectable, Component, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { MockHttp } from '../shared/mock-http';

@Injectable()
export class DummySpace {

  constructor(private http: Http,
    @Inject(WIT_API_URL) private baseApiUrl: string)
  {}

  getAllSpaces(): Promise<Space[]> {
    return this.http.get(this.baseApiUrl + 'spaces')
      .toPromise()
      .then((response) => response.json().data as Space[]);
  }
}
