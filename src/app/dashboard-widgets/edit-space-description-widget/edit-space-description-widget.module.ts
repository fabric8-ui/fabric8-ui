import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AlmEditableModule } from 'ngx-widgets';

import { EditSpaceDescriptionWidgetComponent } from './edit-space-description-widget.component';


@NgModule({
  imports: [CommonModule, FormsModule, AlmEditableModule],
  declarations: [EditSpaceDescriptionWidgetComponent],
  exports: [EditSpaceDescriptionWidgetComponent]
})
export class EditSpaceDescriptionWidgetModule { }
