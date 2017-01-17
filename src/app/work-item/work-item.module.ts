import { AlmArrayFilter } from './../pipes/alm-array-filter.pipe';
import { AlmFilterBoardList } from './../pipes/alm-board-filter.pipe';
import { AlmIconModule } from './../shared-component/icon/almicon.module';
import { AuthUserResolve, UsersResolve } from './users.resolver';
import { CollapseModule } from 'ng2-bootstrap';
import { CommonModule } from '@angular/common';
import { CountPipe } from 'ng2bln-count-pipe';
import { DialogModule } from './../shared-component/dialog/dialog.module';
import { DndModule } from 'ng2-dnd';
import { DropdownModule } from 'ng2-dropdown';
import { InfiniteScrollModule } from './../shared-component/infinitescroll/infinitescroll.module';
import { NgModule } from '@angular/core';
import { TooltipModule } from 'ng2-bootstrap/components/tooltip';
import { UserService } from './../user/user.service';
import { WorkItemBoardComponent } from './work-item-board/work-item-board.component';
import { WorkItemComponent } from './work-item.component';
import { WorkItemDetailModule } from './work-item-detail/work-item-detail.module';
import { WorkItemListEntryComponent } from './work-item-list/work-item-list-entry/work-item-list-entry.component';
import { WorkItemListComponent } from './work-item-list/work-item-list.component';
import { WorkItemQuickAddModule } from './work-item-quick-add/work-item-quick-add.module';
import { WorkItemRoutingModule } from './work-item-routing.module';

@NgModule({
  imports: [
    AlmIconModule,
    CollapseModule,
    CommonModule,
    DialogModule,
    DndModule.forRoot(),
    DropdownModule,
    InfiniteScrollModule,
    TooltipModule,
    WorkItemDetailModule,
    WorkItemRoutingModule,
    WorkItemQuickAddModule
  ],
  declarations: [
    AlmArrayFilter,
    AlmFilterBoardList,
    CountPipe,
    WorkItemComponent,
    WorkItemListComponent,
    WorkItemBoardComponent,
    WorkItemListEntryComponent
  ],
  providers: [
    AuthUserResolve,
    UserService,
    UsersResolve
  ],
  exports: [
    WorkItemComponent
  ]
})
export class WorkItemModule { }
