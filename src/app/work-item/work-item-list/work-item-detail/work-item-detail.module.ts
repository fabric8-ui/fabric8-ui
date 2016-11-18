import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { DropdownModule }     from 'ng2-dropdown';

import { AlmIconModule }      from './../../../shared-component/icon/almicon.module';
import { AlmEditableModule }     from './../../../shared-component/editable/almeditable.module';
import { WorkItemDetailComponent } from './work-item-detail.component';

//Pipes
import { AlmTrim } from './../../../pipes/alm-trim';
import { AlmSearchHighlight } from './../../../pipes/alm-search-highlight.pipe';

@NgModule({
  imports: [
     AlmIconModule,
     AlmEditableModule,
     CommonModule,
     DropdownModule,
     FormsModule,
  ],
  declarations: [ WorkItemDetailComponent, AlmTrim, AlmSearchHighlight ],
  exports:      [ WorkItemDetailComponent ]
})
export class WorkItemDetailModule { }