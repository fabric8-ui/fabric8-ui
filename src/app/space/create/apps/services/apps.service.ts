import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { Logger } from 'ngx-base';
import { Observable } from 'rxjs';

import { WIT_API_URL } from 'ngx-fabric8-wit';

@Injectable()
export class AppsService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private spacesUrl: string;
  private nextLink: string = null;

  constructor(
    private http: Http,
    private logger: Logger,
    private auth: AuthenticationService,
    private userService: UserService,
    @Inject(WIT_API_URL) apiUrl: string) {
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    this.spacesUrl = apiUrl + 'spaces';
  }

  getEnvironments(spaceId: string): Observable<string[]> {
    return Observable.of(['stage', 'run']);
  }

  getTotalCpuCount(spaceId: string, environmentId: string): Observable<number> {
    return Observable.of(8);
  }

  getTotalMemory(spaceId: string, environmentId: string): Observable<number> {
    return Observable.of(400);
  }

  getUsedCpuCount(spaceId: string, environmentId: string): Observable<number> {
    return Observable.of(4);
  }

  getUsedMemory(spaceId: string, environmentId: string): Observable<number> {
    return Observable.of(200);
  }
}
