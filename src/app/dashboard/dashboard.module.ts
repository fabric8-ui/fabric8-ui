import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { DashboardComponent }     from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';

@NgModule({
  imports:      [ CommonModule, DashboardRoutingModule, HttpModule ],
  declarations: [ DashboardComponent, ProjectDialogComponent ],
})
export class DashboardModule {
  constructor(http: Http) {}
}