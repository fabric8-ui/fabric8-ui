import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { LabelsComponent } from './labels.component';

@NgModule({
  imports: [
    BsDropdownModule,
    CommonModule
  ],
  declarations: [
    LabelsComponent
  ],
  providers: [BsDropdownConfig],
  exports: [LabelsComponent]
})
export class LabelsModule { }
