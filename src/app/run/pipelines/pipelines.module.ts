import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { PipelinesComponent }     from './pipelines.component';
import { PipelinesRoutingModule } from './pipelines-routing.module';
import { SpaceModule } from 'fabric8-runtime-console';

@NgModule({
  imports:      [ CommonModule, PipelinesRoutingModule, HttpModule, SpaceModule ],
  declarations: [ PipelinesComponent ],
})
export class PipelinesModule {
  constructor(http: Http) {}
}
