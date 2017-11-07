import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import {
  AppsService,
  Environment,
} from './services/apps.service';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-apps',
  templateUrl: 'apps.component.html'
})
export class AppsComponent implements OnDestroy, OnInit {
  spaceId: string;
  environments: Environment[];
  applications: string[];

  private envSubscription: ISubscription = null;
  private appSubscription: ISubscription = null;

  constructor(
    private router: Router,
    private appsService: AppsService
  ) {
    this.spaceId = 'placeholder-space';
  }

  ngOnDestroy(): void {
    if (this.envSubscription) {
      this.envSubscription.unsubscribe();
    }
    if (this.appSubscription) {
      this.appSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.updateResources();
  }

  private updateResources(): void {
    this.envSubscription = this.appsService.getEnvironments(this.spaceId).subscribe(val => this.environments = val);
    this.appSubscription = this.appsService.getApplications(this.spaceId).subscribe(val => this.applications = val);
  }

}
