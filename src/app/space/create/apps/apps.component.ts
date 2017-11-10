import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { ISubscription } from 'rxjs/Subscription';

import {
  AppsService,
  Environment,
} from './services/apps.service';

import { Spaces } from 'ngx-fabric8-wit';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-apps',
  templateUrl: 'apps.component.html'
})
export class AppsComponent implements OnDestroy, OnInit {

  spaceId: Observable<string>;
  environments: Observable<Environment[]>;
  applications: Observable<string[]>;

  private spaceSubscription: ISubscription;

  constructor(
    private spaces: Spaces,
    private appsService: AppsService
  ) {
    this.spaceId = this.spaces.current.map(space => space.id);
   }

  ngOnDestroy(): void {
    this.spaceSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.updateResources();
  }

  private updateResources(): void {
    this.spaceSubscription = this.spaceId.subscribe(spaceId => {
      this.environments =
        this.appsService.getEnvironments(spaceId);

      this.applications =
        this.appsService.getApplications(spaceId);
    });
  }

}
