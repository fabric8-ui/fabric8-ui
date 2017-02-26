import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'ng2-bootstrap';

import { FiltersModule } from '../filters/filters.module';
import { SortModule } from '../sort/sort.module';
import { ToolbarComponent } from './toolbar.component';
import { ToolbarConfig } from './toolbar-config';

export {
  ToolbarConfig
}

@NgModule({
  imports: [ CommonModule, DropdownModule, FiltersModule, SortModule ],
  declarations: [ ToolbarComponent ],
  exports: [ ToolbarComponent ]
})
export class ToolbarModule { }
