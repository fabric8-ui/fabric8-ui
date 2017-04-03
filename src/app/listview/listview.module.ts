import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EmptyStateModule } from '../emptystate/emptystate.module';
import { ListViewComponent } from './listview.component';
import { ListViewConfig } from './listview-config';
import { ListViewEvent } from './listview-event';

export {
  ListViewConfig,
  ListViewEvent
}

@NgModule({
  imports: [ CommonModule, EmptyStateModule, FormsModule ],
  declarations: [ ListViewComponent ],
  exports: [ ListViewComponent ]
})
export class ListViewModule { }
