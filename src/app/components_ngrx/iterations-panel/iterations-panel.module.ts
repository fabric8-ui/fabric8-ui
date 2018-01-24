import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CollapseModule } from 'ngx-bootstrap';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';

import {
  WidgetsModule
} from 'ngx-widgets';
import { ActionModule, ListModule } from 'patternfly-ng';
import { DragulaModule } from 'ng2-dragula';
import { FabPlannerIterationModalComponent } from '../iterations-modal/iterations-modal.component';
import { MyDatePickerModule } from 'mydatepicker';
import { IterationComponent } from './iterations-panel.component';
import { IterationService } from '../../services/iteration.service';
import { IterationListEntryComponent } from '../iteration-list-entry/iteration-list-entry.component';

import { ModalModule } from 'ngx-modal';
import  { SwitchModule } from './../../components/switch/switch.module';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { TruncateModule } from 'ng2-truncate';

// ngrx stuff
import { StoreModule } from '@ngrx/store';
import { iterationUiReducer } from './../../reducers/iteration-reducer';
import { initialUIState } from './../../states/iteration.state';

@NgModule({
  imports: [
    ActionModule,
    BsDropdownModule.forRoot(),
    CollapseModule,
    CommonModule,
    DragulaModule,
    FormsModule,
    MyDatePickerModule,
    ModalModule,
    ListModule,
    TooltipModule.forRoot(),
    TruncateModule,
    SwitchModule,
    WidgetsModule,
    RouterModule,
    // TreeModule
    // TreeListModule
    StoreModule.forFeature('iterationPanel', {
      iterationUI: iterationUiReducer
    }, {
      initialState: {
        iterationUI: initialUIState
      }
    })
  ],
  declarations: [
    FabPlannerIterationModalComponent,
    IterationComponent,
    IterationListEntryComponent
  ],
  exports: [IterationComponent],
  providers: [BsDropdownConfig, IterationService, TooltipConfig]
})
export class IterationModule { }
