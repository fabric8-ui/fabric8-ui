import { WorkItemDataService } from './../../services/work-item-data.service';
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
import { EventService } from './../../services/event.service';
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

import { HttpService } from '../../services/http-service';

import { CardComponent } from './../card/card.component';

import {
  FabPlannerAssociateIterationModalModule
} from './../work-item-iteration-modal/work-item-iteration-modal.module';
import { GlobalSettings } from '../../shared/globals';
import { IterationModule } from '../iterations-panel/iterations-panel.module';
import { PlannerBoardRoutingModule } from './planner-board-routing.module';
import { SidepanelModule } from '../side-panel/side-panel.module';
import { ToolbarPanelModule } from '../toolbar-panel/toolbar-panel.module';
import { PlannerBoardComponent } from './planner-board.component';
import { WorkItemDetailAddTypeSelectorModule } from '../work-item-create/work-item-create.module';
import { WorkItemDetailModule } from '../work-item-detail/work-item-detail.module';
import { WorkItemQuickAddModule } from '../work-item-quick-add/work-item-quick-add.module';
import { WorkItemService } from '../../services/work-item.service';

import { MockHttp } from '../../mock/mock-http';

let providers = [];

if (process.env.ENV == 'inmemory') {
  providers = [
    EventService,
    GlobalSettings,
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
    EventService,
    GlobalSettings,
    WorkItemService,
    WorkItemDataService,
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
    PlannerBoardComponent,
    CardComponent
  ],
  providers: providers,
  exports: [ PlannerBoardComponent ]
})
export class PlannerBoardModule {
  constructor(http: Http) {}
}
