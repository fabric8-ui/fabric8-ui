import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CollapseModule } from 'ng2-bootstrap';
import { DropdownModule } from 'ng2-bootstrap';

import {
  WidgetsModule
} from 'ngx-widgets';

import { DragulaModule } from 'ng2-dragula';
import { FabPlannerIterationModalComponent } from '../iterations-modal/iterations-modal.component';
import { MyDatePickerModule } from 'mydatepicker';
import { IterationComponent } from './iterations-panel.component';
import { IterationService } from '../../services/iteration.service';
import { ModalModule } from 'ngx-modal';
import { TooltipModule } from 'ng2-bootstrap';
import { TruncateModule } from 'ng2-truncate';

@NgModule({
  imports: [
    CollapseModule,
    CommonModule,
    DragulaModule,
    DropdownModule,
    FormsModule,
    MyDatePickerModule,
    ModalModule,
    TooltipModule,
    TruncateModule,
    WidgetsModule,
    RouterModule
  ],
  declarations: [
    FabPlannerIterationModalComponent,
    IterationComponent
  ],
  exports: [IterationComponent],
  providers: [IterationService]
})
export class IterationModule { }
