import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { DropdownModule } from 'ng2-bootstrap';
import { FiltersModule } from '../../filters/filters.module';
import { ToolbarModule } from '../toolbar.module';

import { ToolbarExampleComponent } from './toolbar-example.component';
import { ToolbarExampleRoutingModule } from './toolbar-example-routing.module';

@NgModule({
  declarations: [ ToolbarExampleComponent ],
  imports: [
    CommonModule,
    DropdownModule,
    HttpModule,
    FiltersModule,
    ToolbarExampleRoutingModule,
    ToolbarModule
  ]
})
export class ToolbarExampleModule {
  constructor(http: Http) {}
}
