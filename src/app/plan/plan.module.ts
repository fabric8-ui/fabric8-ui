import { PlannerListModule } from 'fabric8-planner';
import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';


@NgModule({
  imports:      [ CommonModule, HttpModule, PlannerListModule ]
})
export class PlanModule {
  constructor(http: Http) {}
}
