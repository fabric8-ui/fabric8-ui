import { MockHttp } from './../../shared/mock-http';
import { HttpService } from './../../shared/http-service';
import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import {
  HttpModule,
  Http,
  XHRBackend,
  RequestOptions
} from '@angular/http';

import { DropdownModule, TooltipModule } from 'ng2-bootstrap';
import { ModalModule } from 'ngx-modal';
import { TreeModule } from 'angular2-tree-component';
import {
  AlmIconModule,
  DialogModule,
  InfiniteScrollModule,
  TreeListModule,
  WidgetsModule
} from 'ngx-widgets';
import { Broadcaster, Logger } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';

import { AuthUserResolve, UsersResolve } from '../common.resolver';
import { FabPlannerAssociateIterationModalComponent } from '../work-item-iteration-association-modal/work-item-iteration-association-modal.component';
import { GlobalSettings } from '../../shared/globals';
import { IterationModule } from '../../iteration/iteration.module';
import { PlannerListRoutingModule } from './planner-list-routing.module';
import { SidepanelModule } from '../../side-panel/side-panel.module';
import { ToolbarPanelModule } from '../../toolbar-panel/toolbar-panel.module';
import { WorkItemDetailModule } from '../work-item-detail/work-item-detail.module';
import { WorkItemListComponent } from './work-item-list.component';
import { WorkItemListEntryComponent } from './work-item-list-entry/work-item-list-entry.component';
import { WorkItemQuickAddModule } from '../work-item-quick-add/work-item-quick-add.module';
import { WorkItemService } from '../work-item.service';

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
      useClass: MockHttp
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
      deps: [XHRBackend, RequestOptions]
    }
  ];
}

@NgModule({
  imports: [
    AlmIconModule,
    CommonModule,
    DialogModule,
    DropdownModule,
    HttpModule,
    InfiniteScrollModule,
    IterationModule,
    ModalModule,
    PlannerListRoutingModule,
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
    FabPlannerAssociateIterationModalComponent,
    WorkItemListComponent,
    WorkItemListEntryComponent
  ],
  providers: providers,
  exports: [ WorkItemListComponent ]
})
export class PlannerListModule {
  constructor(http: Http) {}
}
