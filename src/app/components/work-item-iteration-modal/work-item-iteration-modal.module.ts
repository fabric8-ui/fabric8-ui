
import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {
  WidgetsModule
} from 'ngx-widgets';
import { ModalModule } from 'ngx-modal';
import {
  FabPlannerAssociateIterationModalComponent
} from './work-item-iteration-modal.component';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    FormsModule,
    ModalModule,
    WidgetsModule
  ],

  declarations: [
    FabPlannerAssociateIterationModalComponent
  ],

  providers: [
    BsDropdownConfig
  ],

  exports: [
    FabPlannerAssociateIterationModalComponent
  ]
})
export class FabPlannerAssociateIterationModalModule { }
