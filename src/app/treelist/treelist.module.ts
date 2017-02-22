import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TreeModule } from 'angular2-tree-component';

import { TreeListComponent } from './treelist.component';

@NgModule({
  declarations: [
    TreeListComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    TreeModule
  ],
  providers: [],
  bootstrap: [ TreeListComponent ],
  exports: [ TreeListComponent ]
})
export class TreeListModule { }
