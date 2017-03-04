import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { TreeModule } from 'angular2-tree-component';
import { TooltipModule } from 'ng2-bootstrap/components/tooltip';
import { DndModule } from 'ng2-dnd';
import { ModalModule } from 'ngx-modal';
import { DropdownModule } from 'ngx-dropdown';
import {
  AlmIconModule,
  DialogModule,
  InfiniteScrollModule,
  TreeListModule,
  WidgetsModule
} from 'ngx-widgets';

import { UserService } from 'ngx-login-client';

import { IterationModule } from '../../iteration/iteration.module';
import { SidepanelModule } from '../../side-panel/side-panel.module';
import { AuthUserResolve, UsersResolve } from '../common.resolver';

import { WorkItemListComponent } from './work-item-list.component';
import { PlannerListRoutingModule } from './planner-list-routing.module';
import { WorkItemListEntryComponent } from './work-item-list-entry/work-item-list-entry.component';
import { WorkItemDetailModule } from '../work-item-detail/work-item-detail.module';

@NgModule({
  imports: [
    AlmIconModule,
    CommonModule,
    DialogModule,
    DndModule.forRoot(),
    DropdownModule,
    HttpModule,
    InfiniteScrollModule,
    IterationModule,
    ModalModule,
    PlannerListRoutingModule,
    SidepanelModule,
    TooltipModule,
    TreeModule,
    TreeListModule,
    WidgetsModule,
    WorkItemDetailModule
  ],
  declarations: [
    WorkItemListComponent,
    WorkItemListEntryComponent
  ],
  providers: [
    AuthUserResolve,
    UserService,
    UsersResolve
  ],
  exports: [ WorkItemListComponent ]
})
export class PlannerListModule {
  constructor(http: Http) {}
}
