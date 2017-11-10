import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { ISubscription } from 'rxjs/Subscription';

import {
  AppsService,
  Environment,
} from './services/apps.service';

import { Contexts } from 'ngx-fabric8-wit';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-apps',
  templateUrl: 'apps.component.html'
})
export class AppsComponent implements OnDestroy, OnInit {

  spaceId: Observable<string>;
  environments: Observable<Environment[]>;
  applications: Observable<string[]>;

  private contextSubscription: ISubscription;

  constructor(
    private context: Contexts,
    private appsService: AppsService
  ) {
    this.spaceId = this.context.current.map(ctx => ctx.space.id);
   }

  ngOnDestroy(): void {
    this.contextSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.updateResources();
  }

  private updateResources(): void {
    this.contextSubscription = this.spaceId.subscribe(spaceId => {
      this.environments =
        this.appsService.getEnvironments(spaceId);

      this.applications =
        this.appsService.getApplications(spaceId);
    });
  }

}
