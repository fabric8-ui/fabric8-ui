import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { AnalyzeComponent }     from './analyze.component';
import { AnalyzeRoutingModule } from './analyze-routing.module';

import { AnalyzeOverviewModule } from './analyze-overview/analyze-overview.module';

import {RenderStackDetailsComponent} from './stackreports/render-stack-details/render-stack-details.component';

@NgModule({
  imports:      [ AnalyzeOverviewModule, CommonModule, AnalyzeRoutingModule, HttpModule ],
  declarations: [ AnalyzeComponent, RenderStackDetailsComponent ],
})
export class AnalyzeModule {
  constructor(http: Http) {}
}
