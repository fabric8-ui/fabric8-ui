import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { CollaborationComponent }     from './collaboration.component';
import { CollaborationRoutingModule } from './collaboration-routing.module';

@NgModule({
  imports:      [ CommonModule, CollaborationRoutingModule, HttpModule ],
  declarations: [ CollaborationComponent ],
})
export class CollaborationModule {
  constructor(http: Http) {}
}