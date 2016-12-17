import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { AnalyzeComponent }     from './analyze.component';
import { AnalyzeRoutingModule } from './analyze-routing.module';

@NgModule({
  imports:      [ CommonModule, AnalyzeRoutingModule, HttpModule ],
  declarations: [ AnalyzeComponent ],
})
export class AnalyzeModule {
  constructor(http: Http) {}
}