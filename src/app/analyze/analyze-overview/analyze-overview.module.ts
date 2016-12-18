import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import { ModalModule } from 'ng2-modal';

import { AnalyzeOverviewComponent }     from './analyze-overview.component';
import { AnalyzeOverviewRoutingModule } from './analyze-overview-routing.module';
import { TeamMembershipDialogComponent }
      from '../../team-membership-dialog/team-membership-dialog.component';


@NgModule({
  imports:      [ CommonModule, AnalyzeOverviewRoutingModule, HttpModule, ModalModule ],
  declarations: [ AnalyzeOverviewComponent, TeamMembershipDialogComponent ],
})
export class AnalyzeOverviewModule {
  constructor(http: Http) {}
}