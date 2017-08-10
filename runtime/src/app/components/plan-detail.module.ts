import { CommonModule }     from '@angular/common';
import { Http } from '@angular/http';
import { NgModule }         from '@angular/core';

import { WorkItemNewDetailModule } from 'fabric8-planner';

@NgModule({
  imports:      [ CommonModule, WorkItemNewDetailModule ]
})
export class PlanDetailModule {
  constructor(http: Http) {}
}
