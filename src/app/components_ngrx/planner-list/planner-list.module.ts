import { CommonModule }     from '@angular/common';
import { NgModule }         from '@angular/core';
import {
  RequestOptions,
  XHRBackend
} from '@angular/http';
import { NgxDatatableModule } from 'rh-ngx-datatable';
import { AssigneesModule } from './../assignee/assignee.module';
import { LabelsModule } from './../labels/labels.module';
import { WorkItemCellComponent } from './../work-item-cell/work-item-cell.component';
import { WorkItemPreviewPanelModule } from './../work-item-preview-panel/work-item-preview-panel.module';

import { AuthenticationService } from 'ngx-login-client';

import { PlannerListComponent } from './planner-list.component';

import { TruncateModule } from 'ng2-truncate';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { FilterColumn } from '../../pipes/column-filter.pipe';
import { factoryForHttpService, HttpService } from '../../services/http-service';
import { PlannerModalModule } from '../../widgets/modal/modal.module';
import { AreaService } from './../../services/area.service';
import { CollaboratorService } from './../../services/collaborator.service';
import { CustomQueryService } from './../../services/custom-query.service';
import { IterationService } from './../../services/iteration.service';
import { LabelService } from './../../services/label.service';
import { WorkItemDataService } from './../../services/work-item-data.service';
import { WorkItemService } from './../../services/work-item.service';
import { GlobalSettings } from './../../shared/globals';
import {
  PlannerLayoutModule
} from './../../widgets/planner-layout/planner-layout.module';
import { PlannerListRoutingModule } from './../planner-list/planner-list-routing.module';
import { SidepanelModule } from './../side-panel/side-panel.module';
import { ToolbarPanelModule } from './../toolbar-panel/toolbar-panel.module';
import { WorkItemQuickAddModule } from './../work-item-quick-add/work-item-quick-add.module';

import { CookieService } from './../../services/cookie.service';
import { FilterService } from './../../services/filter.service';

import { AlmIconModule, WidgetsModule } from 'ngx-widgets';
import { EmptyStateModule } from 'patternfly-ng/empty-state';
import { InfotipService } from '../../services/infotip.service';
import { UrlService } from '../../services/url.service';
import { ClickOutModule } from '../../widgets/clickout/clickout.module';

// Data Querries
import { WorkItemTypeQuery } from '../../models/work-item-type';
import { AreaQuery } from './../../models/area.model';
import { CommentQuery } from './../../models/comment';
import { GroupTypeQuery } from './../../models/group-types.model';
import { IterationQuery } from './../../models/iteration.model';
import { LabelQuery } from './../../models/label.model';
import { SpaceQuery } from './../../models/space';
import { UserQuery } from './../../models/user';
import { WorkItemQuery } from './../../models/work-item';

import { UserAvatarModule } from './../../widgets/user-avatar/user-avatar.module';

let providers = [
    WorkItemService,
    {
      provide: HttpService,
      useFactory: factoryForHttpService,
      deps: [XHRBackend, RequestOptions, AuthenticationService]
    },
    CustomQueryService,
    IterationService,
    TooltipConfig,
    GlobalSettings,
    LabelService,
    AreaService,
    CollaboratorService,
    FilterService,
    BsDropdownConfig,
    CookieService,
    WorkItemDataService,
    UrlService,
    InfotipService,
    CommentQuery,
    UserQuery,
    LabelQuery,
    IterationQuery,
    WorkItemQuery,
    AreaQuery,
    SpaceQuery,
    GroupTypeQuery,
    WorkItemTypeQuery,
    SpaceQuery
  ];

@NgModule({
  imports: [
    AlmIconModule,
    AssigneesModule,
    CommonModule,
    ClickOutModule,
    PlannerListRoutingModule,
    PlannerLayoutModule,
    PlannerModalModule,
    EmptyStateModule,
    LabelsModule,
    ToolbarPanelModule,
    TooltipModule.forRoot(),
    SidepanelModule,
    WorkItemQuickAddModule,
    BsDropdownModule.forRoot(),
    NgxDatatableModule,
    WorkItemPreviewPanelModule,
    WidgetsModule,
    TruncateModule,
    UserAvatarModule
  ],
  declarations: [
    PlannerListComponent,
    WorkItemCellComponent,
    FilterColumn
  ],
  providers: providers,
  exports: [ PlannerListComponent ]
})
export class PlannerListModule {
  constructor() {}
}
