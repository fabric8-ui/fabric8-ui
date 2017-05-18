import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';

import { DropdownModule } from 'ng2-bootstrap';

import { WorkItemQuickAddComponent } from './work-item-quick-add.component';

@NgModule({
  imports:      [ CommonModule, FormsModule, DropdownModule ],
  declarations: [ WorkItemQuickAddComponent ],
  exports:      [ WorkItemQuickAddComponent ]
})
export class WorkItemQuickAddModule { }
