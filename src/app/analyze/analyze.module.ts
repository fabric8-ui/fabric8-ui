import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { AnalyzeComponent }     from './analyze.component';
import { AnalyzeRoutingModule } from './analyze-routing.module';

import { AnalyzeOverviewModule } from './analyze-overview/analyze-overview.module'

@NgModule({
  imports:      [ AnalyzeOverviewModule, CommonModule, AnalyzeRoutingModule, HttpModule ],
  declarations: [ AnalyzeComponent ],
})
export class AnalyzeModule {
  constructor(http: Http) {}
}
