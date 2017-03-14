import { PlannerListModule, PlannerBoardModule } from 'fabric8-planner';
import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';


@NgModule({
  imports:      [ CommonModule, HttpModule, PlannerListModule, PlannerBoardModule ]
})
export class PlanModule {
  constructor(http: Http) {}
}
