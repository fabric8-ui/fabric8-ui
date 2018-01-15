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
import { IterationTreeComponent } from '../iteration-tree/iteration-tree.component';
import { ModalModule } from 'ngx-modal';
import { SwitchModule } from '../switch/switch.module';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { TruncateModule } from 'ng2-truncate';

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
    //TreeModule
    //TreeListModule
  ],
  declarations: [
    FabPlannerIterationModalComponent,
    IterationComponent,
    IterationListEntryComponent,
    IterationTreeComponent
  ],
  exports: [IterationComponent],
  providers: [BsDropdownConfig, IterationService, TooltipConfig]
})
export class IterationModule { }
