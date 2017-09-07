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

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
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
import { GroupTypesModule } from '../group-types-panel/group-types-panel.module';
import { IterationModule } from '../iterations-panel/iterations-panel.module';
import { LabelsModule } from '../labels/labels.module';
import { PlannerListRoutingModule } from './planner-list-routing.module';
import { SidepanelModule } from '../side-panel/side-panel.module';
import { ToolbarPanelModule } from '../toolbar-panel/toolbar-panel.module';
import { UrlService } from './../../services/url.service';
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
    BsDropdownConfig,
    GlobalSettings,
    WorkItemService,
    Broadcaster,
    WorkItemDataService,
    EventService,
    Logger,
    {
      provide: HttpService,
      useClass: MockHttp
    },
    TooltipConfig,
    UrlService
  ];
} else {
  providers = [
    BsDropdownConfig,
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
    },
    TooltipConfig,
    UrlService
  ];
}

@NgModule({
  imports: [
    AlmIconModule,
    BsDropdownModule.forRoot(),
    CommonModule,
    DialogModule,
    FabPlannerAssociateIterationModalModule,
    HttpModule,
    InfiniteScrollModule,
    GroupTypesModule,
    IterationModule,
    LabelsModule,
    ModalModule,
    PlannerListRoutingModule,
    SidepanelModule,
    ToolbarPanelModule,
    TooltipModule.forRoot(),
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
