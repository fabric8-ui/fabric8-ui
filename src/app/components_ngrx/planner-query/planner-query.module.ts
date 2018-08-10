import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PlannerQueryRoutingModule } from './planner-query-routing.module';
import { PlannerQueryComponent } from './planner-query.component';

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
  ]
})
export class PlannerQueryModule { }
