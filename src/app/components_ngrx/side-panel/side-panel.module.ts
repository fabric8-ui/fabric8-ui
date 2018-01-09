import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CollapseModule } from 'ngx-bootstrap';
import { TooltipModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-modal';
import { GroupTypesModule } from
  './../../components/group-types-panel/group-types-panel.module';
import { SidepanelComponent } from './side-panel.component';

// ngrs stuff
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  IterationState,
  initialState as initialIterationState
} from './../../states/iteration.state';
import { iterationReducer } from './../../reducers/iteration-reducer';
import { IterationEffects } from './../../effects/iteration.effects';

@NgModule({
  imports: [
    CollapseModule,
    CommonModule,
    GroupTypesModule,
    ModalModule,
    RouterModule,
    TooltipModule
  ],
  declarations: [
    SidepanelComponent
  ],
  exports: [SidepanelComponent]
})
export class SidepanelModule { }
