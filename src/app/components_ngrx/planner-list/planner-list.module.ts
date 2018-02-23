import { LabelsModule } from './../labels/labels.module';
import { AssigneesModule } from './../assignee/assignee.module';
import { WorkItemCellComponent } from './../work-item-cell/work-item-cell.component';
import { NgxDatatableModule } from 'rh-ngx-datatable';
import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import {
  XHRBackend,
  RequestOptions
} from '@angular/http';

import { AuthenticationService } from 'ngx-login-client';

import { PlannerListComponent } from './planner-list.component';

import { HttpService } from '../../services/http-service';
import { MockHttp } from '../../mock/mock-http';
import { WorkItemService } from './../../services/work-item.service';
import { IterationService } from './../../services/iteration.service';
import { GlobalSettings } from './../../shared/globals';
import { LabelService } from './../../services/label.service';
import { AreaService } from './../../services/area.service';
import { CollaboratorService } from './../../services/collaborator.service';
import { PlannerListRoutingModule } from './../planner-list/planner-list-routing.module';
import { ToolbarPanelModule } from './../toolbar-panel/toolbar-panel.module';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { SidepanelModule } from './../side-panel/side-panel.module';
import {
  PlannerLayoutModule
} from './../../widgets/planner-layout/planner-layout.module';
import { WorkItemQuickAddModule } from './../work-item-quick-add/work-item-quick-add.module';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FilterColumn } from '../../pipes/column-filter.pipe';
import { WorkItemQuickPreviewModule } from '../work-item-quick-preview/work-item-quick-preview.module';
import { WorkItemDataService } from './../../services/work-item-data.service';
import { PlannerModalModule } from '../../components/modal/modal.module';

import { CookieService } from './../../services/cookie.service';
import { FilterService } from './../../services/filter.service';

// ngrx stuff
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as states from './../../states/index.state';
import * as reducers from './../../reducers/index.reducer';
import * as effects from './../../effects/index.effects';
import { WorkItemReducer } from './../../reducers/work-item.reducer';
import { AlmIconModule } from 'ngx-widgets';
import { EmptyStateModule } from 'patternfly-ng';

let providers = [];

if (process.env.ENV == 'inmemory') {
  providers = [
    WorkItemService,
    {
      provide: HttpService,
      useClass: MockHttp
    },
    IterationService,
    TooltipConfig,
    GlobalSettings,
    LabelService,
    AreaService,
    CollaboratorService,
    FilterService,
    BsDropdownConfig,
    CookieService,
    WorkItemDataService
  ];
} else {
  providers = [
    WorkItemService,
    {
      provide: HttpService,
      useFactory: (backend: XHRBackend, options: RequestOptions, auth: AuthenticationService) => {
        return new HttpService(backend, options, auth);
      },
      deps: [XHRBackend, RequestOptions, AuthenticationService]
    },
    IterationService,
    TooltipConfig,
    GlobalSettings,
    LabelService,
    AreaService,
    CollaboratorService,
    FilterService,
    BsDropdownConfig,
    CookieService,
    WorkItemDataService
  ];
}

@NgModule({
  imports: [
    AlmIconModule,
    AssigneesModule,
    CommonModule,
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
    WorkItemQuickPreviewModule,
    StoreModule.forFeature('listPage', {
        iterations: reducers.iterationReducer,
        labels: reducers.LabelReducer,
        areas: reducers.AreaReducer,
        collaborators: reducers.CollaboratorReducer,
        groupTypes: reducers.GroupTypeReducer,
        space: reducers.SpaceReducer,
        workItemTypes: reducers.WorkItemTypeReducer,
        workItems: reducers.WorkItemReducer,
        workItemStates: reducers.WorkItemStateReducer
      }, {
      initialState: {
        iterations: states.initialIterationState,
        labels: states.initialLabelState,
        areas: states.initialAreaState,
        collaborators: states.initialCollaboratorState,
        groupTypes: states.initialGroupTypeState,
        space: states.initialSpaceState,
        workItemTypes: states.initialWorkItemTypeState,
        workItems: states.initialWorkItemState,
        workItemStates: states.initialWIState
      }
    }),
    EffectsModule.forFeature([
      effects.IterationEffects,
      effects.LabelEffects,
      effects.AreaEffects,
      effects.CollaboratorEffects,
      effects.GroupTypeEffects,
      effects.SpaceEffects,
      effects.WorkItemTypeEffects,
      effects.WorkItemEffects
    ])
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
