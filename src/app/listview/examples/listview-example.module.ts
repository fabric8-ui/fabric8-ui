import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'ng2-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';

import { ListViewModule } from '../listview.module';
import { ListViewExampleComponent } from './listview-example.component';
import { ListViewExampleRoutingModule } from './listview-example-routing.module';

@NgModule({
  declarations: [ ListViewExampleComponent ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    HttpModule,
    ListViewExampleRoutingModule,
    ListViewModule
  ]
})
export class ListViewExampleModule {
  constructor(http: Http) {}
}
