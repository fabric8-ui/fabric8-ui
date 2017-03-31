import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';

import {
  BsDropdownConfig,
  BsDropdownModule
} from 'ng2-bootstrap';

import { ListViewModule } from '../listview.module';
import { ListViewExampleComponent } from './listview-example.component';
import { ListViewExampleRoutingModule } from './listview-example-routing.module';

@NgModule({
  declarations: [ ListViewExampleComponent ],
  imports: [
    CommonModule,
    BsDropdownModule,
    FormsModule,
    HttpModule,
    ListViewExampleRoutingModule,
    ListViewModule
  ],
  providers: [BsDropdownConfig]
})
export class ListViewExampleModule {
  constructor(http: Http) {}
}
