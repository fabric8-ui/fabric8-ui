import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CollapseModule } from 'ng2-bootstrap';
import { DropdownModule } from 'ng2-bootstrap';

import {
  WidgetsModule
} from 'ngx-widgets';

import { FabPlannerIterationModalComponent } from './iteration-modal/iteration-modal.component';
import { MyDatePickerModule } from 'mydatepicker';
import { IterationComponent } from './iteration.component';
import { IterationService } from './iteration.service';
import { ModalModule } from 'ngx-modal';
import { TooltipModule } from 'ng2-bootstrap';

@NgModule({
  imports: [
    CollapseModule,
    CommonModule,
    DropdownModule,
    FormsModule,
    MyDatePickerModule,
    ModalModule,
    TooltipModule,
    WidgetsModule
  ],
  declarations: [
    FabPlannerIterationModalComponent,
    IterationComponent
  ],
  exports: [IterationComponent],
  providers: [IterationService]
})
export class IterationModule { }
