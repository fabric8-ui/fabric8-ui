import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import {
  HttpModule,
  Http,
  XHRBackend,
  RequestOptions
} from '@angular/http';

import { ModalModule } from 'ngx-modal';
import { DragulaModule } from 'ng2-dragula';
import { DropdownModule } from 'ng2-bootstrap';
import { TreeModule } from 'angular2-tree-component';
import { TooltipModule } from 'ng2-bootstrap';
import { TruncateModule } from 'ng2-truncate';
import { Broadcaster, Logger } from 'ngx-base';
import {
  AlmIconModule,
  DialogModule,
  InfiniteScrollModule,
  TreeListModule,
  WidgetsModule
} from 'ngx-widgets';
import { AuthenticationService } from 'ngx-login-client';

import { HttpService } from './../../shared/http-service';

import { AlmFilterBoardList } from '../../pipes/alm-board-filter.pipe';
import { AuthUserResolve, UsersResolve } from '../common.resolver';
import {
  FabPlannerAssociateIterationModalModule
} from '../work-item-iteration-association-modal/work-item-iteration-association-modal.module';
import { GlobalSettings } from '../../shared/globals';
import { IterationModule } from '../../iteration/iteration.module';
import { PlannerBoardRoutingModule } from './planner-board-routing.module';
import { SidepanelModule } from '../../side-panel/side-panel.module';
import { ToolbarPanelModule } from '../../toolbar-panel/toolbar-panel.module';
import { WorkItemBoardComponent } from './work-item-board.component';
import { WorkItemDetailAddTypeSelectorModule } from '../work-item-detail-add-type-selector/work-item-detail-add-type-selector.module';
import { WorkItemDetailModule } from '../work-item-detail/work-item-detail.module';
import { WorkItemQuickAddModule } from '../work-item-quick-add/work-item-quick-add.module';
import { WorkItemService } from '../work-item.service';

import { MockHttp } from './../../shared/mock-http';

let providers = [];

if (process.env.ENV == 'inmemory') {
  providers = [
    AuthUserResolve,
    GlobalSettings,
    UsersResolve,
    WorkItemService,
    Broadcaster,
    Logger,
    {
      provide: HttpService,
      useExisting: MockHttp
    }
  ];
} else {
  providers = [
    AuthUserResolve,
    GlobalSettings,
    UsersResolve,
    WorkItemService,
    Broadcaster,
    Logger,
    {
      provide: HttpService,
      useFactory: (backend: XHRBackend, options: RequestOptions, auth: AuthenticationService) => {
        return new HttpService(backend, options, auth);
      },
      deps: [XHRBackend, RequestOptions, AuthenticationService]
    }
  ];
}


@NgModule({
  imports: [
    AlmIconModule,
    CommonModule,
    DialogModule,
    DragulaModule,
    DropdownModule,
    FabPlannerAssociateIterationModalModule,
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
    TruncateModule,
    WidgetsModule,
    WorkItemDetailModule,
    WorkItemDetailAddTypeSelectorModule,
    WorkItemQuickAddModule
  ],
  declarations: [
    AlmFilterBoardList,
    WorkItemBoardComponent,
  ],
  providers: providers,
  exports: [ WorkItemBoardComponent ]
})
export class PlannerBoardModule {
  constructor(http: Http) {}
}
