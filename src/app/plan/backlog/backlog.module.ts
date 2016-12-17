import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { BacklogComponent }     from './backlog.component';
import { BacklogRoutingModule } from './backlog-routing.module';

@NgModule({
  imports:      [ CommonModule, BacklogRoutingModule, HttpModule ],
  declarations: [ BacklogComponent ],
})
export class BacklogModule {
  constructor(http: Http) {}
}