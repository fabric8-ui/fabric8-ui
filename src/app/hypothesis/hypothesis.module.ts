import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';

import { HypothesisComponent }   from './hypothesis.component';
import { HypothesisRoutingModule }   from './hypothesis-routing.module';

@NgModule({
  imports:      [ CommonModule, HypothesisRoutingModule ],
  declarations: [ HypothesisComponent ],
  exports: [ HypothesisComponent ]
})
export class HypothesisModule { }