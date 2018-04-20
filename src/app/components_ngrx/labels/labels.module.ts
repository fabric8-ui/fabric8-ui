import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { LabelsComponent } from './labels.component';
import{ FilterService } from '../../services/filter.service'
@NgModule({
  imports: [
    BsDropdownModule,
    CommonModule,
    RouterModule
  ],
  declarations: [
    LabelsComponent
  ],
  providers: [BsDropdownConfig, FilterService],
  exports: [LabelsComponent]
})

export class LabelsModule { }
