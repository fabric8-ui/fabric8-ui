import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import { DropdownModule, DropdownConfig } from 'ng2-bootstrap';

import { FiltersModule } from '../filters.module';
import { FilterExampleComponent } from './filter-example.component';
import { FilterExampleRoutingModule } from './filter-example-routing.module';

@NgModule({
  imports: [ CommonModule, DropdownModule, FilterExampleRoutingModule, FiltersModule, HttpModule ],
  declarations: [ FilterExampleComponent ],
  providers: [ DropdownConfig ]
})
export class FilterExampleModule {
  constructor(http: Http) {}
}
