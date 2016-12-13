import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { LearnComponent }     from './learn.component';
import { LearnRoutingModule } from './learn-routing.module';

@NgModule({
  imports:      [ CommonModule, LearnRoutingModule, HttpModule ],
  declarations: [ LearnComponent ],
})
export class LearnModule {
  constructor(http: Http) {}
}