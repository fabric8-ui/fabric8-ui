import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlannerModule, PlannerListModule } from 'fabric8-planner';
import { WidgetsModule } from 'ngx-widgets';
import { NgArrayPipesModule } from 'angular-pipes';

import { CreateWorkItemWidgetComponent } from './create-work-item-widget.component';

// TODO HACK
// TODO HACK Also remember to export the AlmUsername pipe
import { WorkItemDetailModule } from 'fabric8-planner/src/app/work-item/work-item-detail/work-item-detail.module';



@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    WidgetsModule,
    PlannerListModule,
    NgArrayPipesModule,
    WorkItemDetailModule
  ],
  declarations: [CreateWorkItemWidgetComponent],
  exports: [CreateWorkItemWidgetComponent],
})
export class CreateWorkItemWidgetModule { }
