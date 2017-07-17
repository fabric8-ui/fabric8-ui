import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { WorkItemQuickAddComponent } from './work-item-quick-add.component';

@NgModule({
  imports:      [ BsDropdownModule.forRoot(), CommonModule, FormsModule ],
  declarations: [ WorkItemQuickAddComponent ],
  exports:      [ WorkItemQuickAddComponent ],
  providers:    [ BsDropdownConfig ]
})
export class WorkItemQuickAddModule { }
