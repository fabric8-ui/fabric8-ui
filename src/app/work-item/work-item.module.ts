import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';

import { TooltipModule } from 'ng2-bootstrap';
import { DragulaModule } from 'ng2-dragula';
import { ModalModule } from 'ngx-modal';
import { DropdownModule } from 'ng2-bootstrap';
import {
  AlmIconModule,
  DialogModule,
  WidgetsModule
} from 'ngx-widgets';

import { IterationModule } from '../iteration/iteration.module';
import { SidepanelModule } from '../side-panel/side-panel.module';
import { AuthUserResolve, UsersResolve } from './common.resolver';

import { FabPlannerAssociateIterationModalComponent } from './work-item-iteration-association-modal/work-item-iteration-association-modal.component';
import { WorkItemQuickAddModule }                     from './work-item-quick-add/work-item-quick-add.module';
import { WorkItemComponent }                          from './work-item.component';
import { WorkItemRoutingModule }                      from './work-item-routing.module';
import { MockDataService } from '../shared/mock-data.service';
import { GlobalSettings } from '../shared/globals';
import { WorkItemService } from './work-item.service';

@NgModule({
  imports: [
    WidgetsModule,
    AlmIconModule,
    CommonModule,
    DialogModule,
    DragulaModule,
    DropdownModule,
    IterationModule,
    ModalModule,
    SidepanelModule,
    TooltipModule,
    WorkItemRoutingModule,
    WorkItemQuickAddModule
  ],
  declarations: [
    FabPlannerAssociateIterationModalComponent,
    WorkItemComponent
  ],
  providers: [
    AuthUserResolve,
    UsersResolve,
    MockDataService,
    GlobalSettings,
    WorkItemService
  ],
  bootstrap: [ WorkItemComponent ],
  exports: [
    WorkItemComponent
  ]
})
export class WorkItemModule { }
