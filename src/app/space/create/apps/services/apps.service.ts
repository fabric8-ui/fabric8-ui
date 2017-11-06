import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { Logger } from 'ngx-base';
import { Observable } from 'rxjs';

import { WIT_API_URL } from 'ngx-fabric8-wit';

export declare class Environment {
  environmentId: string;
  name: string;
}

export declare class MemoryStat {
  used: number;
  total: number;
}

export declare class CpuStat {
  used: number;
  total: number;
}

@Injectable()
export class AppsService {

  private static readonly POLL_RATE_MS: number = 5000;

  private readonly headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  private readonly spacesUrl: string;
  private nextLink: string = null;

  constructor(
    private readonly http: Http,
    private readonly logger: Logger,
    private readonly auth: AuthenticationService,
    private readonly userService: UserService,
    @Inject(WIT_API_URL) readonly apiUrl: string) {
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    this.spacesUrl = apiUrl + 'spaces';
  }

  getApplications(spaceId: string): Observable<string[]> {
    return Observable.of(['vertx-hello', 'vertx-paint', 'vertx-wiki']);
  }

  getEnvironments(spaceId: string): Observable<string[]> {
    return Observable.of(['stage', 'run']);
  }

  getPodCount(spaceId: string, environmentId: string): Observable<number> {
    return Observable
      .interval(AppsService.POLL_RATE_MS)
      .map(() => Math.floor(Math.random() * 5) + 1);
  }

  getCpuStat(spaceId: string, environmentId: string): Observable<CpuStat> {
    return Observable
      .interval(AppsService.POLL_RATE_MS)
      .map(() => { return { used: Math.floor(Math.random() * 9) + 1, total: 10 }; });
  }

  getMemoryStat(spaceId: string, environmentId: string): Observable<MemoryStat> {
    return Observable
      .interval(AppsService.POLL_RATE_MS)
      .map(() => { return { used: Math.floor(Math.random() * 156) + 100, total: 256 }; });
  }
}
