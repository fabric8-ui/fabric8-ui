import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap';
import { EmptyStateModule } from 'patternfly-ng/empty-state';
import { NgxDatatableModule } from 'rh-ngx-datatable';
import { SpaceQuery } from '../../models/space';
import { WorkItemQuery } from '../../models/work-item';
import { FilterColumnModule } from '../../pipes/column-filter.module';
import { CookieService } from '../../services/cookie.service';
import { FilterService } from '../../services/filter.service';
import { InlineInputModule } from '../../widgets/inlineinput/inlineinput.module';
import { WorkItemCellModule } from '../work-item-cell/work-item-cell.module';
import { WorkItemPreviewPanelModule } from '../work-item-preview-panel/work-item-preview-panel.module';
import { PlannerQueryRoutingModule } from './planner-query-routing.module';
import { PlannerQueryComponent } from './planner-query.component';

import { FeatureFlagResolver, FeatureTogglesService } from 'ngx-feature-flag';
import { WorkItemTypeQuery } from '../../models/work-item-type';
import { togglesApiUrlProvider } from '../../shared/toggles-api.provider';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FilterColumnModule,
    EmptyStateModule,
    InlineInputModule,
    PlannerQueryRoutingModule,
    NgxDatatableModule,
    TooltipModule,
    WorkItemCellModule,
    WorkItemPreviewPanelModule
  ],
  declarations: [PlannerQueryComponent],
  exports: [PlannerQueryComponent],
  providers: [
    SpaceQuery,
    CookieService,
    WorkItemQuery,
    FilterService,
    TooltipConfig,
    FeatureFlagResolver,
    FeatureTogglesService,
    togglesApiUrlProvider,
    WorkItemTypeQuery
  ]
})
export class PlannerQueryModule { }
