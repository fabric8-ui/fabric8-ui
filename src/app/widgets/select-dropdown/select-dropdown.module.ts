import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectDropdownComponent } from './select-dropdown.component';
import { AlmEditableModule } from 'ngx-widgets';
import { ClickOutModule } from '../clickout/clickout.module';

@NgModule({
  declarations: [ SelectDropdownComponent ],
  imports: [ CommonModule, ClickOutModule ],
  exports: [ SelectDropdownComponent ]
})
export class SelectDropdownModule { }
