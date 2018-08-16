import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PlannerQueryRoutingModule } from './planner-query-routing.module';
import { PlannerQueryComponent } from './planner-query.component';

import { FeatureFlagResolver, FeatureTogglesService } from 'ngx-feature-flag';
import { togglesApiUrlProvider } from '../../shared/toggles-api.provider';

@NgModule({
  imports: [
    CommonModule,
    PlannerQueryRoutingModule
  ],
  declarations: [
    PlannerQueryComponent
  ],
  exports: [
    PlannerQueryComponent
  ],
  providers: [
    FeatureFlagResolver, FeatureTogglesService, togglesApiUrlProvider
  ]
})
export class PlannerQueryModule { }
