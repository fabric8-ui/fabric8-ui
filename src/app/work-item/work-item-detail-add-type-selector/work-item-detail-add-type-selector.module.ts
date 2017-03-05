import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-modal';
import { DropdownModule } from 'ng2-bootstrap';

import { WorkItemService } from './../work-item.service';
import { WorkItemDetailAddTypeSelectorComponent } from './work-item-detail-add-type-selector.component';

import {
  AlmEditableModule,
  AlmIconModule,
  WidgetsModule
} from 'ngx-widgets';

@NgModule({
  imports: [
    CommonModule,
    ModalModule
  ],
  declarations: [
    WorkItemDetailAddTypeSelectorComponent
  ],
  providers: [
    WorkItemService
  ],
  exports: [WorkItemDetailAddTypeSelectorComponent]
})
export class WorkItemDetailAddTypeSelectorModule { }
