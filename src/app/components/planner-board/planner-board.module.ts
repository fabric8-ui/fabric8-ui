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
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { EventService } from './../../services/event.service';

import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { Logger } from 'ngx-base';
import {
  AlmIconModule,
  DialogModule,
  InfiniteScrollModule,
  //TreeListModule,
  WidgetsModule
} from 'ngx-widgets';
import { AuthenticationService } from 'ngx-login-client';

import { HttpService, factoryForHttpService } from '../../services/http-service';

import {
  FabPlannerAssociateIterationModalModule
} from './../work-item-iteration-modal/work-item-iteration-modal.module';
import { GlobalSettings } from '../../shared/globals';
import { IterationModule } from '../iterations-panel/iterations-panel.module';
import { CardModule } from '../card/card.module';
import { PlannerBoardComponent } from './planner-board.component';
import { PlannerBoardRoutingModule } from './planner-board-routing.module';
import { SidepanelModule } from '../side-panel/side-panel.module';
import { ToolbarPanelModule } from '../toolbar-panel/toolbar-panel.module';
import { UrlService } from './../../services/url.service';
import { WorkItemDetailAddTypeSelectorModule } from '../work-item-create/work-item-create.module';
import { WorkItemDetailModule } from '../work-item-detail/work-item-detail.module';
import { WorkItemQuickAddModule } from '../work-item-quick-add/work-item-quick-add.module';
import { WorkItemService } from '../../services/work-item.service';
import { PlannerLayoutModule } from '../../widgets/planner-layout/planner-layout.module';
import { PlannerModalModule } from '../modal/modal.module';

let providers = [
  BsDropdownConfig,
  EventService,
  GlobalSettings,
  WorkItemService,
  WorkItemDataService,
  Logger,
  {
    provide: HttpService,
    useFactory: factoryForHttpService,
    deps: [XHRBackend, RequestOptions, AuthenticationService]
  },
  TooltipConfig,
  UrlService
];

@NgModule({
  imports: [
    AlmIconModule,
    BsDropdownModule.forRoot(),
    CardModule,
    CommonModule,
    DialogModule,
    DragulaModule,
    FabPlannerAssociateIterationModalModule,
    HttpModule,
    InfiniteScrollModule,
    IterationModule,
    ModalModule,
    PlannerBoardRoutingModule,
    PlannerLayoutModule,
    SidepanelModule,
    ToolbarPanelModule,
    TooltipModule.forRoot(),
    //TreeModule,
    //TreeListModule,
    WidgetsModule,
    WorkItemDetailModule,
    WorkItemDetailAddTypeSelectorModule,
    WorkItemQuickAddModule,
    PlannerModalModule
  ],
  declarations: [
    PlannerBoardComponent
  ],
  providers: providers,
  exports: [ PlannerBoardComponent ]
})
export class PlannerBoardModule {
  constructor(http: Http) {}
}
