import { CreateWorkItemOverlayComponent } from './create-work-item-overlay/create-work-item-overlay.component';
import { CreateWorkItemWidgetRoutingModule } from './create-work-item-widget-routing.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlannerModule, PlannerListModule } from 'fabric8-planner';
import { WidgetsModule } from 'ngx-widgets';
import { NgArrayPipesModule } from 'angular-pipes';

import { CreateWorkItemWidgetComponent } from './create-work-item-widget.component';

// TODO HACK
// TODO HACK Also remember to export the AlmUsername pipe in the module
// TODO HACK Also remember to export the widget in the module
import { WorkItemDetailModule } from 'fabric8-planner/src/app/work-item/work-item-detail/work-item-detail.module';
import { WorkItemDetailAddTypeSelectorModule } from 'fabric8-planner/src/app/work-item/work-item-detail-add-type-selector/work-item-detail-add-type-selector.module';



@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    WidgetsModule,
    PlannerListModule,
    NgArrayPipesModule,
    CreateWorkItemWidgetRoutingModule,
    WorkItemDetailModule,
    WorkItemDetailAddTypeSelectorModule
  ],
  declarations: [CreateWorkItemWidgetComponent, CreateWorkItemOverlayComponent],
  exports: [CreateWorkItemWidgetComponent],
})
export class CreateWorkItemWidgetModule { }
