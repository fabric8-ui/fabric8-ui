import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import {
  WidgetsModule
} from 'ngx-widgets';

import { CustomQueryComponent } from './custom-query-panel.component';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-modal';
import { TooltipModule } from 'ngx-bootstrap';
import { TruncateModule } from 'ng2-truncate';
import { CustomQueryService } from './../../services/custom-query.service';
import { IterationModule } from './../iterations-panel/iterations-panel.module';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    FormsModule,
    ModalModule,
    TooltipModule.forRoot(),
    TruncateModule,
    WidgetsModule,
    IterationModule,
    RouterModule
  ],
  declarations: [
    CustomQueryComponent
  ],
  exports: [CustomQueryComponent],
  providers: [BsDropdownConfig, CustomQueryService]
})
export class CustomQueryModule { }
