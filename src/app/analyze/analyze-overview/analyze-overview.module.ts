import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { AnalyzeOverviewComponent }     from './analyze-overview.component';
import { AnalyzeOverviewRoutingModule } from './analyze-overview-routing.module';

@NgModule({
  imports:      [ CommonModule, AnalyzeOverviewRoutingModule, HttpModule ],
  declarations: [ AnalyzeOverviewComponent ],
})
export class AnalyzeOverviewModule {
  constructor(http: Http) {}
}