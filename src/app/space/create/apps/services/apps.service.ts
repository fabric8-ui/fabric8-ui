import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export declare interface Environment {
  readonly environmentId: string;
  readonly name: string;
}

export declare interface Stat {
  readonly used: number;
  readonly total: number;
}

export declare interface MemoryStat extends Stat {}

export declare interface CpuStat extends Stat {}

@Injectable()
export class AppsService {

  private static readonly POLL_RATE_MS: number = 5000;

  getApplications(spaceId: string): Observable<string[]> {
    return Observable.of(['vertx-hello', 'vertx-paint', 'vertx-wiki']);
  }

  getEnvironments(spaceId: string): Observable<string[]> {
    return Observable.of(['stage', 'run']);
  }

  getPodCount(spaceId: string, environmentId: string): Observable<number> {
    return Observable
      .interval(AppsService.POLL_RATE_MS)
      .distinctUntilChanged()
      .map(() => Math.floor(Math.random() * 5) + 1);
  }

  getCpuStat(spaceId: string, environmentId: string): Observable<CpuStat> {
    return Observable
      .interval(AppsService.POLL_RATE_MS)
      .distinctUntilChanged()
      .map(() => ({ used: Math.floor(Math.random() * 9) + 1, total: 10 } as CpuStat));
  }

  getMemoryStat(spaceId: string, environmentId: string): Observable<MemoryStat> {
    return Observable
      .interval(AppsService.POLL_RATE_MS)
      .distinctUntilChanged()
      .map(() => ({ used: Math.floor(Math.random() * 156) + 100, total: 256 } as MemoryStat));
  }
}
