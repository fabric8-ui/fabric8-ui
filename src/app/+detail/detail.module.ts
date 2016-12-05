import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { DetailComponent }   from './detail.component';
import { DetailRoutingModule }   from './detail-routing.module';

@NgModule({
  imports:      [ CommonModule, DetailRoutingModule, HttpModule ],
  declarations: [ DetailComponent ],
})
export class DetailModule {
  constructor(http: Http) {}
}
