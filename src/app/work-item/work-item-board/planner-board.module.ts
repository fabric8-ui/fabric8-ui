import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { DndModule } from 'ng2-dnd';
import { ModalModule } from 'ngx-modal';
import { DropdownModule } from 'ng2-bootstrap';
import { TreeModule } from 'angular2-tree-component';
import { TooltipModule } from 'ng2-bootstrap/components/tooltip';
import {
  AlmIconModule,
  DialogModule,
  InfiniteScrollModule,
  TreeListModule,
  WidgetsModule
} from 'ngx-widgets';

import { UserService } from 'ngx-login-client';

import { AlmFilterBoardList } from '../../pipes/alm-board-filter.pipe';
import { AuthUserResolve, UsersResolve } from '../common.resolver';
import { GlobalSettings } from '../../shared/globals';
import { IterationModule } from '../../iteration/iteration.module';
import { PlannerBoardRoutingModule } from './planner-board-routing.module';
import { SidepanelModule } from '../../side-panel/side-panel.module';
import { ToolbarPanelModule } from '../../toolbar-panel/toolbar-panel.module';
import { WorkItemBoardComponent } from './work-item-board.component';
import { WorkItemDetailModule } from '../work-item-detail/work-item-detail.module';
import { WorkItemQuickAddModule } from '../work-item-quick-add/work-item-quick-add.module';
import { WorkItemService } from '../work-item.service';


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
    PlannerBoardRoutingModule,
    SidepanelModule,
    ToolbarPanelModule,
    TooltipModule,
    TreeModule,
    TreeListModule,
    WidgetsModule,
    WorkItemDetailModule,
    WorkItemQuickAddModule
  ],
  declarations: [
    AlmFilterBoardList,
    WorkItemBoardComponent,
  ],
  providers: [
    AuthUserResolve,
    GlobalSettings,
    UserService,
    UsersResolve,
    WorkItemService
  ],
  exports: [ WorkItemBoardComponent ]
})
export class PlannerBoardModule {
  constructor(http: Http) {}
}
