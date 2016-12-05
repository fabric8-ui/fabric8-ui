import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { NoContentComponent }     from './no-content.component';
import { NoContentRoutingModule } from './no-content-routing.module';

@NgModule({
  imports:      [ CommonModule, NoContentRoutingModule, HttpModule ],
  declarations: [ NoContentComponent ]
})
export class NoContentModule {
  constructor(http: Http) {}
}
