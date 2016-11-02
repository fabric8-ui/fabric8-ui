import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { DropdownModule as Ng2Dropdown } from 'ng2-dropdown';

import { DropdownModule }   from './../../shared-component/dropdown/dropdown.module';
import { DialogModule }   from './../../shared-component/dialog/dialog.module';

import { WorkItemListComponent } from './work-item-list.component';
import { WorkItemQuickAddModule } from './../work-item-quick-add/work-item-quick-add.module';
import { WorkItemListEntryComponent } from './work-item-list-entry/work-item-list-entry.component';

@NgModule({
  imports:      [
    CommonModule, 
    WorkItemQuickAddModule,
    Ng2Dropdown,
    DropdownModule,
    DialogModule
  ],
  declarations: [
     WorkItemListComponent,
     WorkItemListEntryComponent 
  ],
  exports: [
     WorkItemListComponent
  ]
})
export class WorkItemListModule { }