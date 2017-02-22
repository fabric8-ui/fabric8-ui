import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountPipe } from 'ng2bln-count-pipe';
import { TooltipModule } from 'ng2-bootstrap/components/tooltip';
import { DndModule } from 'ng2-dnd';
import { ModalModule } from 'ng2-modal';
import { DropdownModule } from 'ng2-dropdown';
import {
  AlmArrayFilter,
  AlmIconModule,
  DialogModule,
  InfiniteScrollModule
} from 'ngx-widgets';
import { UserService } from 'ngx-login-client';

import { AlmFilterBoardList } from '../pipes/alm-board-filter.pipe';
import { FabPlannerAssociateIterationModalComponent } from './work-item-iteration-association-modal/work-item-iteration-association-modal.component';
import { IterationModule } from '../iteration/iteration.module';
import { SidepanelModule } from '../side-panel/side-panel.module';
import { WorkItemBoardComponent } from './work-item-board/work-item-board.component';
import { WorkItemDetailModule } from './work-item-detail/work-item-detail.module';
import { WorkItemListEntryComponent } from './work-item-list/work-item-list-entry/work-item-list-entry.component';
import { WorkItemListComponent } from './work-item-list/work-item-list.component';
import { WorkItemQuickAddModule } from './work-item-quick-add/work-item-quick-add.module';

import { AuthUserResolve, IterationsResolve, UsersResolve } from './common.resolver';
import { WorkItemComponent } from './work-item.component';
import { WorkItemRoutingModule } from './work-item-routing.module';
import { TreeModule } from 'angular2-tree-component';
import { TreeListModule, } from 'ngx-widgets';

@NgModule({
  imports: [
    AlmIconModule,
    CommonModule,
    DialogModule,
    DndModule.forRoot(),
    DropdownModule,
    InfiniteScrollModule,
    IterationModule,
    ModalModule,
    SidepanelModule,
    TooltipModule,
    WorkItemDetailModule,
    WorkItemRoutingModule,
    WorkItemQuickAddModule,
    TreeModule,
    TreeListModule
  ],
  declarations: [
    AlmArrayFilter,
    AlmFilterBoardList,
    CountPipe,
    FabPlannerAssociateIterationModalComponent,
    WorkItemComponent,
    WorkItemListComponent,
    WorkItemBoardComponent,
    WorkItemListEntryComponent
  ],
  providers: [
    AuthUserResolve,
    IterationsResolve,
    UserService,
    UsersResolve
  ],
  exports: [
    WorkItemComponent
  ]
})
export class WorkItemModule { }
