import { ModalModule } from 'ng2-modal';
import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';

import { DashboardComponent }   from './dashboard.component';
import { DashboardRoutingModule }   from './dashboard-routing.module';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';

@NgModule({
  imports:      [ CommonModule, DashboardRoutingModule, ModalModule ],
  declarations: [ DashboardComponent, ProjectDialogComponent ],
  exports: [ DashboardComponent, ProjectDialogComponent ]
})
export class DashboardModule { }