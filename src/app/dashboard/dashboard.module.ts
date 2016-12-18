import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { DashboardComponent }     from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SpaceDialogComponent } from '../space-dialog/space-dialog.component';

@NgModule({
  imports:      [ CommonModule, DashboardRoutingModule, HttpModule ],
  declarations: [ DashboardComponent, SpaceDialogComponent ],
})
export class DashboardModule {
  constructor(http: Http) {}
}