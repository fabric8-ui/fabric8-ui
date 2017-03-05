import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';

import { WorkItemQuickAddComponent } from './work-item-quick-add.component';

@NgModule({
  imports:      [ CommonModule, FormsModule ],
  declarations: [ WorkItemQuickAddComponent ],
  exports:      [ WorkItemQuickAddComponent ]
})
export class WorkItemQuickAddModule { }
