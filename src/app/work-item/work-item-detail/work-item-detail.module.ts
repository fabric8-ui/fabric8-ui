import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';

import { WorkItemDetailComponent } from './work-item-detail.component';
import { DialogModule }   from './../../shared-component/dialog/dialog.module';

//Pipes
import { AlmTrim } from './../../pipes/alm-trim';

@NgModule({
  imports:      [ CommonModule, DialogModule, FormsModule ],
  declarations: [ WorkItemDetailComponent, AlmTrim ],
  exports:      [ WorkItemDetailComponent ]
})
export class WorkItemDetailModule { }