import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { WorkItemBoardComponent } from './work-item-board.component';
import { PlannerBoardRoutingModule } from './planner-board-routing.module';

import { WorkItemDetailModule } from '../work-item-detail/work-item-detail.module';


@NgModule({
  imports: [
    CommonModule,
    PlannerBoardRoutingModule,
    HttpModule,
    WorkItemDetailModule
  ],
  declarations: [ WorkItemBoardComponent ],
  exports: [ WorkItemBoardComponent ],
})
export class PlannerBoardModule {
  constructor(http: Http) {}
}
