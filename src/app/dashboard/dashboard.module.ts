import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { DashboardComponent }     from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  imports:      [ CommonModule, DashboardRoutingModule, HttpModule ],
  declarations: [ DashboardComponent ],
})
export class DashboardModule {
  constructor(http: Http) {}
}