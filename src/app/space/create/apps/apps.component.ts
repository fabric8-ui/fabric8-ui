import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { ISubscription } from 'rxjs/Subscription';

import {
  AppsService,
  Environment,
} from './services/apps.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-apps',
  templateUrl: 'apps.component.html'
})
export class AppsComponent implements OnDestroy, OnInit {
  spaceId: string;
  environments: Observable<Environment[]>;
  applications: Observable<string[]>;

  constructor(
    private appsService: AppsService
  ) {
    this.spaceId = 'placeholder-space';
  }

  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.updateResources();
  }

  private updateResources(): void {
    this.environments =
      this.appsService.getEnvironments(this.spaceId);

    this.applications =
      this.appsService.getApplications(this.spaceId);
  }

}
