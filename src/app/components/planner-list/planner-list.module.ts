import { WorkItemDataService } from './../../services/work-item-data.service';
import { EventService } from './../../services/event.service';
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

import { GlobalSettings } from '../../shared/globals';
import {
  FabPlannerAssociateIterationModalModule
} from '../work-item-iteration-modal/work-item-iteration-modal.module';
import { IterationModule } from '../iterations-panel/iterations-panel.module';
import { PlannerListRoutingModule } from './planner-list-routing.module';
import { SidepanelModule } from '../side-panel/side-panel.module';
import { ToolbarPanelModule } from '../toolbar-panel/toolbar-panel.module';
import { WorkItemDetailModule } from '../work-item-detail/work-item-detail.module';
import { WorkItemDetailAddTypeSelectorModule } from '../work-item-create/work-item-create.module';
import { PlannerListComponent } from './planner-list.component';
import { WorkItemListEntryComponent } from '../work-item-list-entry/work-item-list-entry.component';
import { WorkItemQuickAddModule } from '../work-item-quick-add/work-item-quick-add.module';
import { WorkItemService } from '../../services/work-item.service';
import { MockHttp } from '../../mock/mock-http';
import { HttpService } from '../../services/http-service';

let providers = [];

if (process.env.ENV == 'inmemory') {
  providers = [
    GlobalSettings,
    WorkItemService,
    Broadcaster,
    WorkItemDataService,
    EventService,
    Logger,
    {
      provide: HttpService,
      useClass: MockHttp
    }
  ];
} else {
  providers = [
    GlobalSettings,
    WorkItemService,
    WorkItemDataService,
    Broadcaster,
    EventService,
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
    DropdownModule,
    FabPlannerAssociateIterationModalModule,
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
    WorkItemQuickAddModule,
    WorkItemDetailAddTypeSelectorModule
  ],
  declarations: [
    PlannerListComponent,
    WorkItemListEntryComponent
  ],
  providers: providers,
  exports: [ PlannerListComponent ]
})
export class PlannerListModule {
  constructor(http: Http) {}
}
