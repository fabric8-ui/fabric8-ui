import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
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
  environments: Environment[];
  applications: string[];

  private readonly unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private appsService: AppsService
  ) {
    this.spaceId = 'placeholder-space';
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.updateResources();
  }

  private updateResources(): void {
    this.appsService
      .getEnvironments(this.spaceId)
      .takeUntil(this.unsubscribe)
      .subscribe(val => this.environments = val);

    this.appsService
      .getApplications(this.spaceId)
      .takeUntil(this.unsubscribe)
      .subscribe(val => this.applications = val);
  }

}
