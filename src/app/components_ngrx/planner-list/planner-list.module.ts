import { FilterService } from './../../services/filter.service';
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

// ngrx stuff
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as states from './../../states/index.state';
import * as reducers from './../../reducers/index.reducer';
import * as effects from './../../effects/index.effects';

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
    FilterService
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
    FilterService
  ];
}

@NgModule({
  imports: [
    CommonModule,
    PlannerListRoutingModule,
    PlannerLayoutModule,
    ToolbarPanelModule,
    TooltipModule.forRoot(),
    SidepanelModule,
    StoreModule.forFeature('listPage', {
        iterations: reducers.iterationReducer,
        labels: reducers.LabelReducer,
        areas: reducers.AreaReducer,
        collaborators: reducers.CollaboratorReducer,
        groupTypes: reducers.GroupTypeReducer,
        space: reducers.SpaceReducer,
        workItemTypes: reducers.WorkItemTypeReducer,
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
      effects.WorkItemTypeEffects
    ])
  ],
  declarations: [ PlannerListComponent ],
  providers: providers,
  exports: [ PlannerListComponent ]
})
export class PlannerListModule {
  constructor() {}
}
