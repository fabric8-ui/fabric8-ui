import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-modal';
import { DropdownModule } from 'ng2-bootstrap';

import { WorkItemService } from './../work-item/work-item.service';
import { FilterPanelComponent } from './filter-panel.component';
import { WorkItemDetailAddTypeSelectorModule } from './../work-item/work-item-detail-add-type-selector/work-item-detail-add-type-selector.module';

import {
  AlmEditableModule,
  AlmIconModule,
  WidgetsModule
} from 'ngx-widgets';

@NgModule({
  imports: [
    AlmEditableModule,
    AlmIconModule,
    CommonModule,
    DropdownModule,
    WidgetsModule,
    WorkItemDetailAddTypeSelectorModule
  ],
  declarations: [
    FilterPanelComponent
  ],
  providers: [
    WorkItemService
  ],
  exports: [FilterPanelComponent]
})
export class FilterPanelModule { }
