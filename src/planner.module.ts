import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PlannerBoardModule } from './app/components_ngrx/planner-board/planner-board.module';
import { PlannerListModule } from './app/components_ngrx/planner-list/planner-list.module';
import { WorkItemDetailExternalModule } from './app/components_ngrx/work-item-detail/work-item-detail-external.module';

@NgModule({
  imports: [
    RouterModule.forChild([{
      path: '**',
      redirectTo: '/_error'
    }])
  ],
  exports: [RouterModule]
})
export class PlannerRoutingModule {}

@NgModule({
  imports: [
    PlannerBoardModule,
    WorkItemDetailExternalModule,
    PlannerListModule,
    PlannerRoutingModule
  ]
})
export class PlannerModule {}
