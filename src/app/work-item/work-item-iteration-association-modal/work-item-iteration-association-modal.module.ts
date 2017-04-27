import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';

import {
  DropdownConfig,
  DropdownModule,
} from 'ng2-bootstrap';
import {
  WidgetsModule
} from 'ngx-widgets';
import { ModalModule } from 'ngx-modal';
import {
  FabPlannerAssociateIterationModalComponent
} from './work-item-iteration-association-modal.component';

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    ModalModule,
    WidgetsModule
  ],

  declarations: [
    FabPlannerAssociateIterationModalComponent
  ],

  providers: [
    DropdownConfig
  ],

  exports: [
    FabPlannerAssociateIterationModalComponent
  ]
})
export class FabPlannerAssociateIterationModalModule { }
