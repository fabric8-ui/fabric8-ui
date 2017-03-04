import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { WorkItemListComponent }     from './work-item-list.component';
import { PlannerListRoutingModule } from './planner-list-routing.module';

import { WorkItemDetailModule } from '../work-item-detail/work-item-detail.module';


@NgModule({
  imports:      [ CommonModule, PlannerListRoutingModule, HttpModule, WorkItemDetailModule ],
  declarations: [ WorkItemListComponent ],
})
export class PlannerListModule {
  constructor(http: Http) {}
}
