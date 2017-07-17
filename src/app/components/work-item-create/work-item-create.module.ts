import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-modal';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { WorkItemService } from '../../services/work-item.service';
import { WorkItemDetailAddTypeSelectorComponent } from './work-item-create.component';
import { WorkItemDetailAddTypeSelectorWidgetComponent } from './work-item-create-selector/work-item-create-selector.component';

import {
  AlmEditableModule,
  AlmIconModule,
  WidgetsModule
} from 'ngx-widgets';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    ModalModule
  ],
  declarations: [
    WorkItemDetailAddTypeSelectorWidgetComponent,
    WorkItemDetailAddTypeSelectorComponent
  ],
  providers: [
    BsDropdownConfig,
    WorkItemService
  ],
  exports: [WorkItemDetailAddTypeSelectorComponent, WorkItemDetailAddTypeSelectorWidgetComponent]
})
export class WorkItemDetailAddTypeSelectorModule { }
