import { NgModule } from '@angular/core';
import { PlannerListModule } from './app/components_ngrx/planner-list/planner-list.module';
import { WorkItemDetailExternalModule } from './app/components_ngrx/work-item-detail/work-item-detail-external.module';

@NgModule({
  imports: [
    PlannerListModule,
    WorkItemDetailExternalModule
  ]
})
export class PlannerModule {}
