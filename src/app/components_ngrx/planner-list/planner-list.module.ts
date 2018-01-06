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

// ngrx stuff
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { IterationState, initialState as initialIterationState } from './../../states/iteration.state';
import { iterationReducer } from './../../reducers/iteration-reducer';
import { IterationEffects } from './../../effects/iteration.effects';
import { LabelState, initialState as initialLabelState } from './../../states/label.state';
import { LabelReducer } from './../../reducers/label.reducer';
import { LabelEffects } from './../../effects/label.effects';
import { AreaState, initialState as initialAreaState } from './../../states/area.state';
import { AreaReducer } from './../../reducers/area.reducer';
import { AreaEffects } from './../../effects/area.effects';
import { CollaboratorState, initialState as initialCollaboratorState } from './../../states/collaborator.state';
import { CollaboratorReducer } from './../../reducers/collaborator.reducer';
import { CollaboratorEffects } from './../../effects/collaborator.effects';
import { TooltipConfig } from 'ngx-bootstrap/tooltip/tooltip.config';

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
    CollaboratorService
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
    CollaboratorService
  ];
}

@NgModule({
  imports: [
    PlannerListRoutingModule,
    StoreModule.forFeature('listPage', {
      iterations: iterationReducer,
      labels: LabelReducer,
      areas: AreaReducer,
      collaborators: CollaboratorReducer
    }, {
    initialState: {
      iterations: initialIterationState,
      labels: initialLabelState,
      areas: initialAreaState,
      collaborators: initialCollaboratorState
    }
  }),
  EffectsModule.forFeature([
    IterationEffects,
    LabelEffects,
    AreaEffects,
    CollaboratorEffects
  ])],
  declarations: [ PlannerListComponent ],
  providers: providers,
  exports: [ PlannerListComponent ]
})
export class PlannerListModule {
  constructor() {}
}
