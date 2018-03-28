import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { FeatureTogglesService } from '../../feature-flag/service/feature-toggles.service';

import { Subscription } from 'rxjs';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-analyze',
  templateUrl: 'analyze.component.html'
})
export class AnalyzeComponent implements OnInit {

  newSpaceDashboardEnabled: boolean = false;
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private featureTogglesService: FeatureTogglesService) {
    this.subscriptions.push(featureTogglesService.getFeature('newSpaceDashboard').subscribe((feature) => {
      this.newSpaceDashboardEnabled = feature.attributes['enabled'] && feature.attributes['user-enabled'];
    }));
  }

  ngOnInit() {
  }

}
