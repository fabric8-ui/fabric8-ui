import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  BuildConfig,
  BuildConfigs,
  combineBuildConfigAndBuilds,
  filterPipelines,
  BuildConfigStore,
  BuildStore
} from 'fabric8-runtime-console';

import { Fabric8RuntimeConsoleService } from './fabric8-runtime-console.service';


@Injectable()
export class PipelinesService {

  constructor(
    private pipelinesStore: BuildConfigStore,
    private buildStore: BuildStore,
    private fabric8RuntimeConsoleService: Fabric8RuntimeConsoleService
  ) { }

  get current(): Observable<BuildConfig[]> {
    return this.fabric8RuntimeConsoleService
      .loading()
      .switchMap(() =>
        Observable.combineLatest(
          this.pipelinesStore
            .loadAll()
            .distinctUntilChanged(),
          this.buildStore
            .loadAll()
            .distinctUntilChanged(),
          combineBuildConfigAndBuilds))
      .map(filterPipelines);
  }

}
