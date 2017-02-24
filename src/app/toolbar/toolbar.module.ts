import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'ng2-bootstrap';
import { FormsModule } from '@angular/forms';

import { Action } from './action';
import { ActionsConfig } from './actions-config';
import { FiltersModule } from '../filters/filters.module';
import { SortModule } from '../sort/sort.module';
import { ToolbarComponent } from './toolbar.component';
import { ToolbarConfig } from './toolbar-config';
import { View } from './view';
import { ViewsConfig } from './views-config';

export {
  Action,
  ActionsConfig,
  ToolbarConfig,
  View,
  ViewsConfig
}

@NgModule({
  imports: [ CommonModule, DropdownModule, FiltersModule, FormsModule, SortModule ],
  declarations: [ ToolbarComponent ],
  exports: [ ToolbarComponent ]
})
export class ToolbarModule { }
