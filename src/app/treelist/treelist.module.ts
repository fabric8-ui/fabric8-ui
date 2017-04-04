import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TreeModule } from 'angular-tree-component';

import { TreeListComponent } from './treelist.component';
import { TreeListItemComponent } from './treelist-item.component';

@NgModule({
  declarations: [
    TreeListComponent, TreeListItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    TreeModule
  ],
  exports: [ TreeListComponent, TreeListItemComponent ]
})
export class TreeListModule { }
